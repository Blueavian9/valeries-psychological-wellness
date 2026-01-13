import { Hono } from "hono";
import type { Env } from "../server/types/env.js";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/health", (c) => c.json({ ok: true }));

export default app;





// import { Hono } from "hono";
// import helloRouter from "../server/routes/hello.js";
// import healthRouter from "../server/routes/health.js";
// import publicRouter from "../server/routes/public.js";
// import type { Env } from "../server/types/env.js";

// // Adjust this path based on where your connection file actually lives.
// // Common options:
// // - "../db/connection.js"
// // - "../server/db/connection.js"
// // - "../../db/connection.js"
// // - "../src/db/connection.ts"
// import { getDatabase } from "../server/db/connection.js";   // ← change this if needed

// const app = new Hono<{ Bindings: Env }>();

// // Mount sub-routers under /api
// app.route("/api", healthRouter);
// app.route("/api", helloRouter);
// app.route("/api", publicRouter);

// // Root API endpoint for testing
// app.get("/api", (c) => {
//   return c.json({
//     ok: true,
//     name: "Valerie Psych Booking API",
//     timestamp: new Date().toISOString(),
//     message: "API is running. Try /api/health or /api/hello"
//   });
// });

// // Catch-all 404 for unknown API paths
// app.notFound((c) => {
//   return c.json({ error: "Not Found", path: c.req.path }, 404);
// });

// // Global error handler
// app.onError((err, c) => {
//   console.error("Hono error:", err);
//   return c.json({ error: "Internal Server Error", message: err.message }, 500);
// });

// export default app;