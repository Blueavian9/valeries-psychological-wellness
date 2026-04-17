export function bookingConfirmationTemplate({
  clientName,
  serviceName,
  therapistName,
  scheduledAt,
  amount,
}: {
  clientName: string;
  serviceName: string;
  therapistName: string;
  scheduledAt: string;
  amount: string;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Booking Confirmation</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background-color:#4a7c59;padding:32px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">
                      🌿 Valerie's Psychological Wellness
                    </h1>
                    <p style="color:#c8e6c9;margin:8px 0 0;font-size:14px;">
                      Your healing journey continues
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px;">
                    <h2 style="color:#2d2d2d;margin:0 0 8px;">Booking Confirmed ✅</h2>
                    <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 24px;">
                      Hi <strong>${clientName}</strong>, your appointment has been successfully booked and payment received. Here's your summary:
                    </p>

                    <!-- Booking Details Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f1;border-radius:6px;padding:24px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Service</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${serviceName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Therapist</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${therapistName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Date & Time</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${scheduledAt}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Amount Paid</span><br/>
                          <span style="color:#4a7c59;font-size:20px;font-weight:bold;">${amount}</span>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
                      You will receive a reminder 24 hours before your appointment. If you need to reschedule or have any questions, please contact us directly.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#4a7c59;border-radius:6px;padding:14px 28px;">
                          <a href="https://valeries-psychological-wellness.vercel.app/dashboard"
                            style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                            View My Dashboard →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9f9f9;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
                    <p style="color:#aaa;font-size:12px;margin:0;line-height:1.6;">
                      © 2025 Valerie's Psychological Wellness. All rights reserved.<br/>
                      This email was sent because you booked an appointment on our platform.
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
export function appointmentReminderTemplate({
  clientName,
  serviceName,
  therapistName,
  scheduledAt,
  format,
}: {
  clientName: string;
  serviceName: string;
  therapistName: string;
  scheduledAt: string;
  format: string;
}) {
  const formatLabel: Record<string, string> = {
    video: "📹 Video Session",
    phone: "📞 Phone Session",
    chat: "💬 Chat Session",
    "in-person": "🏥 In-Person Session",
  };

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Appointment Reminder</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">

                <!-- Header -->
                <tr>
                  <td style="background-color:#4a7c59;padding:32px;text-align:center;">
                    <h1 style="color:#ffffff;margin:0;font-size:24px;letter-spacing:1px;">
                      🌿 Valerie's Psychological Wellness
                    </h1>
                    <p style="color:#c8e6c9;margin:8px 0 0;font-size:14px;">
                      Your appointment is tomorrow
                    </p>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:40px 32px;">
                    <h2 style="color:#2d2d2d;margin:0 0 8px;">Appointment Reminder ⏰</h2>
                    <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 24px;">
                      Hi <strong>${clientName}</strong>, this is a friendly reminder that your appointment is coming up in <strong>24 hours</strong>. Here are your details:
                    </p>

                    <!-- Appointment Details Box -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f1;border-radius:6px;padding:24px;margin-bottom:24px;">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Service</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${serviceName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Therapist</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${therapistName}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Date & Time</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${scheduledAt}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;">
                          <span style="color:#777;font-size:13px;text-transform:uppercase;letter-spacing:0.5px;">Format</span><br/>
                          <span style="color:#2d2d2d;font-size:16px;font-weight:bold;">${formatLabel[format] ?? format}</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Prep Tips -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff8e1;border-left:4px solid #f9a825;border-radius:4px;padding:16px 20px;margin-bottom:24px;">
                      <tr>
                        <td>
                          <p style="color:#555;font-size:14px;line-height:1.7;margin:0;">
                            <strong style="color:#2d2d2d;">Before your session:</strong><br/>
                            ✔ Find a quiet, private space<br/>
                            ✔ Test your audio/video if joining online<br/>
                            ✔ Have water nearby<br/>
                            ✔ Give yourself a few minutes to settle in
                          </p>
                        </td>
                      </tr>
                    </table>

                    <p style="color:#555;font-size:14px;line-height:1.6;margin:0 0 24px;">
                      Need to reschedule or have questions? Contact us as soon as possible so we can accommodate you.
                    </p>

                    <!-- CTA Button -->
                    <table cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="background-color:#4a7c59;border-radius:6px;padding:14px 28px;">
                          <a href="https://valeriemunozpsyc.com/dashboard"
                            style="color:#ffffff;text-decoration:none;font-size:15px;font-weight:bold;">
                            View My Dashboard →
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color:#f9f9f9;padding:24px 32px;text-align:center;border-top:1px solid #eee;">
                    <p style="color:#aaa;font-size:12px;margin:0;line-height:1.6;">
                      © 2025 Valerie's Psychological Wellness. All rights reserved.<br/>
                      You're receiving this reminder because you have an upcoming appointment on our platform.
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function contactAutoReplyTemplate({ name }: { name: string }) {
  const safe = escapeHtml(name);
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
          <tr><td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;">
              <tr><td style="background-color:#4a7c59;padding:28px;text-align:center;">
                <h1 style="color:#ffffff;margin:0;font-size:22px;">Thank you for reaching out</h1>
              </td></tr>
              <tr><td style="padding:32px;">
                <p style="color:#555;font-size:16px;line-height:1.6;margin:0 0 16px;">Hi <strong>${safe}</strong>,</p>
                <p style="color:#555;font-size:15px;line-height:1.6;margin:0 0 16px;">
                  We received your message and will respond within <strong>2 business hours</strong> during regular office hours.
                </p>
                <p style="color:#555;font-size:15px;line-height:1.6;margin:0;">
                  If this is urgent, please call our office or use the phone number on our website.
                </p>
              </td></tr>
              <tr><td style="background-color:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
                <p style="color:#aaa;font-size:12px;margin:0;">Valerie's Psychological Wellness</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
    </html>
  `;
}

export function contactAdminNotificationTemplate({
  name,
  email,
  phone,
  message,
  preferredContact,
  newsletter,
}: {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  preferredContact: string;
  newsletter: boolean;
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head><meta charset="utf-8" /></head>
      <body style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="color:#4a7c59;">New contact form submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        ${phone ? `<p><strong>Phone:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p><strong>Preferred contact:</strong> ${escapeHtml(preferredContact)}</p>
        <p><strong>Newsletter:</strong> ${newsletter ? "Yes" : "No"}</p>
        <p><strong>Message:</strong></p>
        <p style="white-space:pre-wrap;border-left:4px solid #4a7c59;padding-left:12px;">${escapeHtml(message)}</p>
      </body>
    </html>
  `;
}

export function adminPaymentSucceededTemplate({
  appointmentId,
  amount,
  currency,
}: {
  appointmentId: string;
  amount: number;
  currency: string;
}) {
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8" /></head>
    <body style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#4a7c59;">Payment succeeded</h2>
      <p><strong>Appointment ID:</strong> ${escapeHtml(appointmentId)}</p>
      <p><strong>Amount:</strong> ${amount.toFixed(2)} ${currency.toUpperCase()}</p>
    </body></html>
  `;
}

export function adminBookingCreatedTemplate({
  appointmentId,
  status,
  serviceName,
  startTime,
}: {
  appointmentId: string;
  status: string;
  serviceName: string;
  startTime: string;
}) {
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8" /></head>
    <body style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#4a7c59;">New booking created</h2>
      <p><strong>Appointment ID:</strong> ${escapeHtml(appointmentId)}</p>
      <p><strong>Status:</strong> ${escapeHtml(status)}</p>
      <p><strong>Service:</strong> ${escapeHtml(serviceName)}</p>
      <p><strong>Start:</strong> ${escapeHtml(startTime)}</p>
    </body></html>
  `;
}

export function adminSignupTemplate({
  userId,
  email,
  fullName,
}: {
  userId: string;
  email: string;
  fullName: string;
}) {
  return `
    <!DOCTYPE html>
    <html><head><meta charset="utf-8" /></head>
    <body style="font-family:Arial,sans-serif;color:#333;">
      <h2 style="color:#4a7c59;">New user signup</h2>
      <p><strong>User ID:</strong> ${escapeHtml(userId)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Name:</strong> ${escapeHtml(fullName)}</p>
    </body></html>
  `;
}
