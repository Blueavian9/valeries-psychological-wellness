import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendAdminEmail } from "../_shared/adminNotify.ts";
import {
  adminPaymentSucceededTemplate,
  bookingConfirmationTemplate,
} from "../_shared/emailTemplates.ts";

// ── Stripe client ──────────────────────────────────────────────────────────────
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-08-27.basil",
  httpClient: Stripe.createFetchHttpClient(),
});

// ── Supabase admin client ──────────────────────────────────────────────────────
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// ── Audit logger (HIPAA) ───────────────────────────────────────────────────────
async function writeAuditLog(
  action: string,
  appointmentId: string | null,
  metadata: Record<string, unknown>
) {
  const { error } = await supabase.from("audit_logs").insert({
    action,
    appointment_id: appointmentId,
    triggered_by: "stripe_webhook",
    metadata,
    created_at: new Date().toISOString(),
  });
  if (error) console.error("[AUDIT LOG FAILED]", action, error.message);
}

// ── Trigger confirmation email ─────────────────────────────────────────────────
async function triggerConfirmationEmail(appointmentId: string) {
  try {
    // 1. Fetch appointment + related data from Supabase
    const { data: appt, error } = await supabase
      .from("appointments")
      .select(`
        id,
        scheduled_at,
        services ( name, price ),
        profiles!appointments_client_id_fkey ( full_name, email ),
        therapists ( full_name )
      `)
      .eq("id", appointmentId)
      .single();

    if (error || !appt) {
      console.error("[EMAIL FETCH FAILED]", error?.message ?? "No appointment found");
      return;
    }

    const clientName  = appt.profiles?.full_name  ?? "Valued Client";
    const clientEmail = appt.profiles?.email       ?? null;
    const serviceName = appt.services?.name        ?? "Therapy Session";
    const therapistName = appt.therapists?.full_name ?? "Your Therapist";
    const amount      = appt.services?.price
      ? `$${Number(appt.services.price).toFixed(2)}`
      : "Paid";
    const scheduledAt = new Date(appt.scheduled_at).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!clientEmail) {
      console.warn("[EMAIL SKIPPED] No client email for appointment", appointmentId);
      return;
    }

    // 2. Call send-email Edge Function with rendered template
    const res = await fetch(
      `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
        },
        body: JSON.stringify({
          to: clientEmail,
          subject: "Your Appointment is Confirmed 🌿",
          html: bookingConfirmationTemplate({
            clientName,
            serviceName,
            therapistName,
            scheduledAt,
            amount,
          }),
        }),
      }
    );

    if (!res.ok) {
      console.error("[EMAIL SEND FAILED]", appointmentId, await res.text());
    } else {
      console.log("[EMAIL SENT]", { appointmentId });
    }
  } catch (err) {
    console.error("[EMAIL TRIGGER ERROR]", err.message);
  }
}

// ── Handler: payment succeeded ─────────────────────────────────────────────────
async function onPaymentSucceeded(intent: Stripe.PaymentIntent) {
  try {
    const { error: apptError } = await supabase
      .from("appointments")
      .update({ status: "confirmed" })
      .eq("stripe_payment_intent_id", intent.id);
    if (apptError) throw new Error(`appointments update failed: ${apptError.message}`);

    const { error: payError } = await supabase.from("payments").upsert(
      {
        stripe_payment_intent_id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: "succeeded",
      },
      { onConflict: "stripe_payment_intent_id" }
    );
    if (payError) throw new Error(`payments upsert failed: ${payError.message}`);

    // ── Send confirmation email ──────────────────────────────────────────────
    const appointmentId = intent.metadata?.appointment_id;
    if (appointmentId) {
      await triggerConfirmationEmail(appointmentId);
    }

    await writeAuditLog(
      "payment_confirmed",
      appointmentId ?? null,
      {
        stripe_payment_intent_id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
      }
    );

    if (appointmentId) {
      await sendAdminEmail(
        `Payment succeeded — ${appointmentId}`,
        adminPaymentSucceededTemplate({
          appointmentId,
          amount: intent.amount / 100,
          currency: intent.currency,
        })
      );
    }

    console.log("[SUCCEEDED]", intent.id);
  } catch (err) {
    console.error("[onPaymentSucceeded ERROR]", err.message);
    throw err;
  }
}

// ── Handler: payment failed ────────────────────────────────────────────────────
async function onPaymentFailed(intent: Stripe.PaymentIntent) {
  try {
    const { error: apptError } = await supabase
      .from("appointments")
      .update({ status: "pending" })
      .eq("stripe_payment_intent_id", intent.id);
    if (apptError) throw new Error(`appointments update failed: ${apptError.message}`);

    const { error: payError } = await supabase.from("payments").upsert(
      {
        stripe_payment_intent_id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: "failed",
      },
      { onConflict: "stripe_payment_intent_id" }
    );
    if (payError) throw new Error(`payments upsert failed: ${payError.message}`);

    await writeAuditLog(
      "payment_failed",
      intent.metadata?.appointment_id ?? null,
      {
        stripe_payment_intent_id: intent.id,
        failure_message: intent.last_payment_error?.message ?? "unknown",
      }
    );
    console.log("[FAILED]", intent.id);
  } catch (err) {
    console.error("[onPaymentFailed ERROR]", err.message);
    throw err;
  }
}

// ── Handler: payment canceled ──────────────────────────────────────────────────
async function onPaymentCanceled(intent: Stripe.PaymentIntent) {
  try {
    const { error: apptError } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("stripe_payment_intent_id", intent.id);
    if (apptError) throw new Error(`appointments update failed: ${apptError.message}`);

    const { error: payError } = await supabase.from("payments").upsert(
      {
        stripe_payment_intent_id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: "cancelled",
      },
      { onConflict: "stripe_payment_intent_id" }
    );
    if (payError) throw new Error(`payments upsert failed: ${payError.message}`);

    await writeAuditLog(
      "payment_canceled",
      intent.metadata?.appointment_id ?? null,
      { stripe_payment_intent_id: intent.id }
    );
    console.log("[CANCELED]", intent.id);
  } catch (err) {
    console.error("[onPaymentCanceled ERROR]", err.message);
    throw err;
  }
}

// ── Handler: requires action (3D Secure) ──────────────────────────────────────
async function onRequiresAction(intent: Stripe.PaymentIntent) {
  try {
    const { error } = await supabase
      .from("appointments")
      .update({ status: "pending_action" })
      .eq("stripe_payment_intent_id", intent.id);
    if (error) throw new Error(`appointments update failed: ${error.message}`);

    await writeAuditLog(
      "payment_requires_action",
      intent.metadata?.appointment_id ?? null,
      {
        stripe_payment_intent_id: intent.id,
        next_action: intent.next_action?.type ?? "unknown",
      }
    );
    console.log("[REQUIRES ACTION]", intent.id);
  } catch (err) {
    console.error("[onRequiresAction ERROR]", err.message);
    throw err;
  }
}

// ── Handler: charge refunded ───────────────────────────────────────────────────
async function onChargeRefunded(charge: Stripe.Charge) {
  try {
    const intentId = charge.payment_intent as string;

    const { error: payError } = await supabase
      .from("payments")
      .update({ status: "refunded" })
      .eq("stripe_payment_intent_id", intentId);
    if (payError) throw new Error(`payments update failed: ${payError.message}`);

    const { error: apptError } = await supabase
      .from("appointments")
      .update({ status: "cancelled" })
      .eq("stripe_payment_intent_id", intentId);
    if (apptError) throw new Error(`appointments update failed: ${apptError.message}`);

    await writeAuditLog("payment_refunded", null, {
      stripe_payment_intent_id: intentId,
      amount_refunded: charge.amount_refunded / 100,
    });
    console.log("[REFUNDED]", intentId);
  } catch (err) {
    console.error("[onChargeRefunded ERROR]", err.message);
    throw err;
  }
}

// ── Main router ────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing stripe-signature", { status: 400 });
  }

  const body = await req.text();
  let event: Stripe.Event;

  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret
    );
  } catch (err) {
    console.error("[SIGNATURE VERIFICATION FAILED]", err.message);
    return new Response(`Webhook signature error: ${err.message}`, {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await onPaymentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.payment_failed":
        await onPaymentFailed(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.canceled":
        await onPaymentCanceled(event.data.object as Stripe.PaymentIntent);
        break;
      case "payment_intent.requires_action":
        await onRequiresAction(event.data.object as Stripe.PaymentIntent);
        break;
      case "charge.refunded":
        await onChargeRefunded(event.data.object as Stripe.Charge);
        break;
      default:
        console.log("[UNHANDLED EVENT]", event.type);
    }
  } catch (err) {
    console.error("[HANDLER ERROR]", event.type, err.message);
    return new Response(
      JSON.stringify({ received: true, error: err.message }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify({ received: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});