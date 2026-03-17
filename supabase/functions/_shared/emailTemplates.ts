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