import { NeonAuthUIProvider } from "@neondatabase/neon-js/auth/react/ui";
import { neon } from "./lib/neon.js";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NeonAuthUIProvider authClient={neon.auth} magicLink>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </NeonAuthUIProvider>
  </StrictMode>,
);
