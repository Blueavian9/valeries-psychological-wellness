import { Hono } from "hono";
import type { Env } from "../server/types/env";

import helloRouter from "../server/routes/hello";
import healthRouter from "../server/routes/health";
import availabilityRouter from "../server/routes/availability";

const app = new Hono<{ Bindings: Env }>();

app.route("/api", healthRouter);
app.route("/api", helloRouter);
app.route("/api", availabilityRouter);


export default app;
