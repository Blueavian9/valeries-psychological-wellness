import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";

// ── Stripe client ──────────────────────────────────────────────────────────────
const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2025-08-27.basil",
  httpClient: Stripe.createFetchHttpClient(),
});

// ── Main handler ───────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const { amount, currency = "usd", metadata = {} } = await req.json();

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return new Response(
        JSON.stringify({ error: "Invalid amount" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create PaymentIntent — amount in cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: true },
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (err) {
    console.error("[create-payment-intent ERROR]", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});