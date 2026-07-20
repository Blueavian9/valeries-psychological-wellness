export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    return res.status(200).send("ok");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res
        .status(400)
        .json({ error: "Missing required fields: to, subject, html" });
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Valerie's Wellness <onboarding@resend.dev>",
        to,
        subject,
        html,
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data });

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
