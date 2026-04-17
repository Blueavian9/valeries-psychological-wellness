import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { adminNewBookingTemplate } from "../_shared/emailTemplates.ts";
import { sendAdminEmail } from "../_shared/adminNotify.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const WINDOW_MS = 15 * 60 * 1000;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { appointment_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const appointmentId = body.appointment_id?.trim();
  if (!appointmentId) {
    return new Response(JSON.stringify({ error: "appointment_id required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: appt, error } = await supabase
    .from("appointments")
    .select(`
      id,
      status,
      client_name,
      client_email,
      created_at,
      start_time,
      services ( name )
    `)
    .eq("id", appointmentId)
    .single();

  if (error || !appt) {
    console.error("notify-admin-booking: appointment not found");
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  const created = new Date(appt.created_at).getTime();
  if (Number.isFinite(created) && Date.now() - created > WINDOW_MS) {
    console.warn("notify-admin-booking: outside time window", { appointmentId: appt.id });
    return new Response(JSON.stringify({ error: "Expired" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const serviceName = (appt.services as { name?: string } | null)?.name ?? "Session";
  const scheduledAt = appt.start_time
    ? new Date(appt.start_time).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    : "—";

  await sendAdminEmail({
    subject: `New booking — ${serviceName}`,
    html: adminNewBookingTemplate({
      appointmentId: appt.id,
      clientName: appt.client_name ?? "Guest",
      clientEmail: appt.client_email ?? "—",
      serviceName,
      scheduledAt,
      status: appt.status ?? "unknown",
    }),
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
});
