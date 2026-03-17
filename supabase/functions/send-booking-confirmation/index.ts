import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ─── Resend API (no SDK needed — clean fetch call) ────────────────────────────
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ─── Email sender ─────────────────────────────────────────────────────────────
async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "Valerie's Wellness <onboarding@resend.dev>",
      to,
      subject,
      html,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Resend error: ${JSON.stringify(data)}`);
  return data;
}

// ─── Email template ───────────────────────────────────────────────────────────
function bookingConfirmationTemplate(params: {
  clientName: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  appointmentId: string;
}) {
  const { clientName, serviceName, date, time, duration, appointmentId } = params;

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Booking Confirmed</title>
    </head>
    <body style="margin:0;padding:0;background:#fdfcf7;font-family:system-ui,-apple-system,sans-serif;">
      
      <!-- Wrapper -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdfcf7;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
              
              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#3a6d77,#a8b5a2);border-radius:16px 16px 0 0;padding:40px 40px 32px;text-align:center;">
                  <div style="width:64px;height:64px;background:rgba(255,255,255,0.2);border-radius:50%;margin:0 auto 16px;display:flex;align-items:center;justify-content:center;">
                    <span style="font-size:28px;">✓</span>
                  </div>
                  <h1 style="margin:0;color:white;font-size:26px;font-weight:700;">You're booked!</h1>
                  <p style="margin:8px 0 0;color:rgba(255,255,255,0.85);font-size:15px;">
                    Your session has been confirmed.
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="background:white;padding:32px 40px;border-radius:0 0 16px 16px;border:1px solid #e8e4dd;border-top:none;">
                  
                  <p style="margin:0 0 24px;color:#333645;font-size:15px;">
                    Hi <strong>${clientName}</strong>, we look forward to seeing you!
                  </p>

                  <!-- Booking details card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdfcf7;border-radius:12px;border:1px solid #e8e4dd;margin-bottom:24px;">
                    <tr>
                      <td style="padding:20px 24px;border-bottom:1px solid #e8e4dd;">
                        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8b5a2;">Session</p>
                        <p style="margin:4px 0 0;font-size:17px;font-weight:700;color:#3a6d77;">${serviceName}</p>
                        <p style="margin:2px 0 0;font-size:13px;color:#8a9490;">${duration} minute session</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px;border-bottom:1px solid #e8e4dd;">
                        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8b5a2;">Date</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#333645;">📅 ${date}</p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:16px 24px;">
                        <p style="margin:0;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#a8b5a2;">Time</p>
                        <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#333645;">🕐 ${time}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- HIPAA privacy note -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f0;border-radius:10px;margin-bottom:24px;">
                    <tr>
                      <td style="padding:14px 18px;">
                        <p style="margin:0;font-size:12px;color:#6b7b6a;">
                          🔒 <strong>Your privacy is protected.</strong> 
                          This communication is confidential. Your session details 
                          are never shared with third parties.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- Questions note -->
                  <p style="margin:0 0 8px;font-size:14px;color:#333645;">
                    Questions or need to reschedule? Reply to this email and we'll get back to you promptly.
                  </p>

                  <p style="margin:0;font-size:13px;color:#8a9490;">
                    Booking reference: <code style="background:#f4f4f4;padding:2px 6px;border-radius:4px;font-size:11px;">${appointmentId.slice(0, 8).toUpperCase()}</code>
                  </p>

                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:24px 40px;text-align:center;">
                  <p style="margin:0;font-size:12px;color:#a8b5a2;">
                    Valerie Muñoz Psychological Wellness<br/>
                    This email was sent to confirm your appointment booking.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>

    </body>
    </html>
  `;
}

// ─── Main handler ─────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { appointment_id } = await req.json();
    if (!appointment_id) {
      return new Response(
        JSON.stringify({ error: "appointment_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // ── Fetch appointment + service data from Supabase ────────────────────
    const { data: appointment, error: fetchError } = await supabase
      .from("appointments")
      .select(`
        id,
        client_name,
        client_email,
        start_time,
        service:service_id (
          name,
          duration_minutes
        )
      `)
      .eq("id", appointment_id)
      .single();

    if (fetchError || !appointment) {
      throw new Error(`Appointment not found: ${fetchError?.message}`);
    }

    // ── Format date and time ──────────────────────────────────────────────
    const startTime = new Date(appointment.start_time);
    const date = startTime.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const time = startTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    // ── Send confirmation email ───────────────────────────────────────────
    await sendEmail(
      appointment.client_email,
      `Your session is confirmed — ${appointment.service.name}`,
      bookingConfirmationTemplate({
        clientName: appointment.client_name,
        serviceName: appointment.service.name,
        date,
        time,
        duration: appointment.service.duration_minutes,
        appointmentId: appointment.id,
      })
    );

    // ── Write audit log ───────────────────────────────────────────────────
    await supabase.from("audit_logs").insert({
      action: "confirmation_email_sent",
      appointment_id,
      triggered_by: "send-booking-confirmation",
      metadata: { to: appointment.client_email },
      created_at: new Date().toISOString(),
    });

    console.log("[EMAIL SENT]", appointment.client_email);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error("[SEND EMAIL ERROR]", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});