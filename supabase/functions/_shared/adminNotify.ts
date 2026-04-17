/** Resend admin notification — do not log recipient or HTML body (may contain PHI). */

export async function sendAdminEmail(subject: string, html: string): Promise<boolean> {
  const admin = Deno.env.get("ADMIN_EMAIL");
  const key = Deno.env.get("RESEND_API_KEY");
  const from =
    Deno.env.get("RESEND_FROM_EMAIL") ??
    "Valerie's Wellness <onboarding@resend.dev>";

  if (!admin || !key) {
    console.warn("[ADMIN EMAIL] ADMIN_EMAIL or RESEND_API_KEY not set");
    return false;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: admin,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[ADMIN EMAIL FAILED]", { status: res.status });
    return false;
  }
  console.log("[ADMIN EMAIL SENT]");
  return true;
}
