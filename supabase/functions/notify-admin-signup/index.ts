import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendAdminEmail } from "../_shared/adminNotify.ts";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { user_id?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  if (!body.user_id) {
    return new Response(JSON.stringify({ error: "user_id required" }), {
      status: 400, headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, full_name, role")
    .eq("id", body.user_id)
    .single();

  if (error || !profile) {
    console.error("[notify-admin-signup] profile not found:", body.user_id);
    return new Response(JSON.stringify({ error: "Profile not found" }), {
      status: 404, headers: { "Content-Type": "application/json" },
    });
  }

  await sendAdminEmail(
    `New signup — ${profile.role ?? "client"}`,
    `<p>New user registered.</p><p>Role: ${profile.role ?? "client"}</p><p>Name: ${profile.full_name ?? "Unknown"}</p>`
  );

  console.log("[notify-admin-signup] notified for user:", profile.id);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200, headers: { "Content-Type": "application/json" },
  });
});
