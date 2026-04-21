// supabase/functions/send-reminder/index.ts
// Queries appointments starting in the next 24 hours and sends reminder emails.
// Called by pg_cron every hour via pg_net.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { appointmentReminderTemplate } from "../_shared/emailTemplates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL = "onboarding@resend.dev";

Deno.serve(async (req: Request) => {
  // Allow Supabase cron pings (GET) and manual triggers (POST)
  if (req.method !== "GET" && req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // ── Query appointments in the 23h–25h window from now ──────────────────────
  // The 2-hour window prevents missed sends if cron runs slightly late,
  // and prevents double-sends from overlapping hourly runs.
  const windowStart = new Date(Date.now() + 23 * 60 * 60 * 1000).toISOString();
  const windowEnd   = new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString();

  const { data: appointments, error } = await supabase
    .from("appointments")
    .select(`
      id,
      client_name,
      client_email,
      scheduled_at,
      format,
      services ( name ),
      therapists (
        profiles ( full_name )
      )
    `)
    .eq("status", "confirmed")
    .gte("scheduled_at", windowStart)
    .lte("scheduled_at", windowEnd)
    .not("client_email", "is", null);

  if (error) {
    console.error("DB query error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!appointments || appointments.length === 0) {
    console.log("No appointments in reminder window.");
    return new Response(
      JSON.stringify({ sent: 0, message: "No upcoming appointments in window." }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── Send a reminder email for each appointment ──────────────────────────────
  const results = await Promise.allSettled(
    appointments.map(async (appt) => {
      const clientName    = appt.client_name ?? "Valued Client";
      const clientEmail   = appt.client_email!;
      const serviceName   = (appt.services as any)?.name ?? "Your Session";
      const therapistName = (appt.therapists as any)?.profiles?.full_name ?? "Your Therapist";
      const format        = appt.format ?? "video";

      const scheduledAt = new Date(appt.scheduled_at).toLocaleString("en-US", {
        weekday: "long",
        year:    "numeric",
        month:   "long",
        day:     "numeric",
        hour:    "2-digit",
        minute:  "2-digit",
        timeZoneName: "short",
      });

      const html = appointmentReminderTemplate({
        clientName,
        serviceName,
        therapistName,
        scheduledAt,
        format,
      });

      const res = await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type":  "application/json",
        },
        body: JSON.stringify({
          from:    FROM_EMAIL,
          to:      clientEmail,
          subject: `⏰ Reminder: Your appointment is tomorrow — ${serviceName}`,
          html,
        }),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("[REMINDER SEND FAILED]", { appointmentId: appt.id, status: res.status });
        throw new Error(`Resend error for appointment ${appt.id}`);
      }

      console.log("[REMINDER SENT]", { appointmentId: appt.id });
      return { id: appt.id };
    })
  );

  const sent   = results.filter((r) => r.status === "fulfilled").length;
  const failed = results.filter((r) => r.status === "rejected").length;

  return new Response(
    JSON.stringify({ sent, failed, total: appointments.length }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});