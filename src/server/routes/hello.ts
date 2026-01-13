import { Hono } from "hono";
import type { Env } from "../types/env.js";
import helloRouter from "../server/routes/hello";
import healthRouter from "../server/routes/health";
const helloRouter = new Hono<{ Bindings: Env }>();

helloRouter.get("/hello", (c) => c.json({ message: "Hello from Hono" }));

export default helloRouter;
