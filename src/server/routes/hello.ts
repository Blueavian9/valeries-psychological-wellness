import { Hono } from "hono";
import type { Env } from "../types/env.js";

const helloRouter = new Hono<{ Bindings: Env }>();

helloRouter.get("/hello", (c) => c.json({ message: "Hello from Hono" }));

export default helloRouter;
