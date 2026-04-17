// Public contact form: insert row + auto-reply + admin email (service role server-side).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendAdminEmail } from "../_shared/adminNotify.ts";
import {
  contactAdminNotificationTemplate,
  contactAutoReplyTemplate,
} from "../_shared/emailTemplates.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const FROM_EMAIL =
  Deno.env.get("RESEND_FROM_EMAIL") ??
  "Valerie's Wellness <onboarding@resend.dev>";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

function mapPreferredContact(raw: string): "email" | "phone" | "text" {
  if (raw === "phone") return "phone";
  if (raw === "either") return "text";
  return "email";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const full_name = String(payload.full_name ?? "").trim();
  const email = String(payload.email ?? "").trim().toLowerCase();
  const phone = payload.phone ? String(payload.phone).trim() : "";
  const message = String(payload.message ?? "").trim();
  const preferred_raw = String(payload.preferred_contact ?? "email");
  const newsletter_opt_in = Boolean(payload.newsletter_opt_in);

  if (!full_name || full_name.length > 200) {
    return new Response(JSON.stringify({ error: "Invalid name" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: "Invalid email" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  if (message.length < 10 || message.length > 500) {
    return new Response(JSON.stringify({ error: "Invalid message" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const preferred_contact = mapPreferredContact(preferred_raw);

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  const { data: row, error: insertError } = await supabase
    .from("contact_submissions")
    .insert({
      full_name,
      email,
      phone: phone || null,
      message,
      preferred_contact,
      newsletter_opt_in,
    })
    .select("id")
    .single();

  if (insertError || !row) {
    console.error("[SEND-CONTACT-REPLY] insert failed", insertError?.message);
    return new Response(JSON.stringify({ error: "Could not save submission" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const userHtml = contactAutoReplyTemplate({ name: full_name });
  const userRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: email,
      subject: "We received your message — Valerie's Psychological Wellness",
      html: userHtml,
    }),
  });

  if (!userRes.ok) {
    console.error("[SEND-CONTACT-REPLY] user email failed", {
      status: userRes.status,
      submissionId: row.id,
    });
  }

  await sendAdminEmail(
    `New contact — ${row.id}`,
    contactAdminNotificationTemplate({
      name: full_name,
      email,
      phone: phone || null,
      message,
      preferredContact: preferred_raw,
      newsletter: newsletter_opt_in,
    }),
  );

  return new Response(
    JSON.stringify({ success: true, id: row.id }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
