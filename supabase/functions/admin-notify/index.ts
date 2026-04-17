// Invoked only from pg_net (DB triggers) with service role — not exposed to browsers.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendAdminEmail } from "../_shared/adminNotify.ts";
import {
  adminBookingCreatedTemplate,
  adminSignupTemplate,
} from "../_shared/emailTemplates.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function assertServiceRole(req: Request): boolean {
  const auth = req.headers.get("Authorization") ?? "";
  const token = auth.replace(/^Bearer\s+/i, "").trim();
  return token.length > 0 && token === SUPABASE_SERVICE_ROLE_KEY;
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!assertServiceRole(req)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: { event?: string; appointment_id?: string; user_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  if (body.event === "booking_created" && body.appointment_id) {
    const { data: appt, error } = await supabase
      .from("appointments")
      .select(`
        id,
        status,
        start_time,
        services ( name )
      `)
      .eq("id", body.appointment_id)
      .single();

    if (error || !appt) {
      console.error("[ADMIN-NOTIFY] booking fetch failed", {
        appointmentId: body.appointment_id,
      });
      return new Response(JSON.stringify({ error: "Appointment not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const serviceName =
      (appt.services as { name?: string } | null)?.name ?? "Session";
    const startTime = appt.start_time
      ? new Date(appt.start_time).toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "TBD";

    await sendAdminEmail(
      `New booking — ${appt.id}`,
      adminBookingCreatedTemplate({
        appointmentId: appt.id,
        status: appt.status ?? "unknown",
        serviceName,
        startTime,
      }),
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (body.event === "signup" && body.user_id) {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id, email, full_name")
      .eq("id", body.user_id)
      .single();

    if (error || !profile) {
      console.error("[ADMIN-NOTIFY] profile fetch failed", {
        userId: body.user_id,
      });
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await sendAdminEmail(
      `New user signup — ${profile.id}`,
      adminSignupTemplate({
        userId: profile.id,
        email: profile.email ?? "",
        fullName: profile.full_name ?? "",
      }),
    );
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ error: "Unknown event" }), {
    status: 400,
    headers: { "Content-Type": "application/json" },
  });
});
