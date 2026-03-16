import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ── Stripe client ──────────────────────────────────────────────────────────────
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-08-27.basil",
  httpClient: Stripe.createFetchHttpClient(),
});

// ── Supabase admin client (server-side only, never exposed to browser) ─────────
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// ── Webhook secret (rotated, secured in Supabase secrets vault) ────────────────
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// ── Audit logger (HIPAA requirement: who changed what and when) ────────────────
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

    await writeAuditLog(
      "payment_confirmed",
      intent.metadata?.appointment_id ?? null,
      {
        stripe_payment_intent_id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
      }
    );
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
        failure_message: i