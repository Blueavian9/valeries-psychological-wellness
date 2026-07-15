import { createClient } from "@neondatabase/neon-js";
import { BetterAuthReactAdapter } from "@neondatabase/neon-js/auth/react/adapters";

const authUrl = import.meta.env.VITE_NEON_AUTH_URL;
const dataApiUrl = import.meta.env.VITE_NEON_DATA_API_URL;

if (!authUrl || !dataApiUrl) {
  throw new Error(
    "Missing Neon env variables. Check VITE_NEON_AUTH_URL and VITE_NEON_DATA_API_URL in .env.local.",
  );
}

export const neon = createClient({
  auth: {
    url: authUrl,
    adapter: BetterAuthReactAdapter(),
  },
  dataApi: {
    url: dataApiUrl,
  },
});