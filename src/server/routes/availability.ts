import { Hono } from "hono";
import type { Env } from "../types/env";

const availabilityRouter = new Hono<{ Bindings: Env }>();

function isIsoDateString(v: string) {
  // Loose ISO check; Date.parse does the real work
  return typeof v === "string" && v.length >= 10;
}

availabilityRouter.get("/availability", async (c) => {
  const practitionerId = c.req.query("practitioner_id");
  const from = c.req.query("from");
  const to = c.req.query("to");

  if (!practitionerId || !from || !to) {
    return c.json(
      { error: "Missing required query params: practitioner_id, from, to" },
      400
    );
  }

  if (!isIsoDateString(from) || !isIsoDateString(to)) {
    return c.json({ error: "from/to must be ISO timestamps" }, 400);
  }

  const fromMs = Date.parse(from);
  const toMs = Date.parse(to);

  if (Number.isNaN(fromMs) || Number.isNaN(toMs)) {
    return c.json({ error: "from/to must be valid ISO timestamps" }, 400);
  }

  if (toMs <= fromMs) {
    return c.json({ error: "`to` must be after `from`" }, 400);
  }

  // Public read: return bookable slots only
  const rows = await c.env.DB.prepare(
    `
    SELECT id, practitioner_id, start_at, end_at
    FROM availability
    WHERE practitioner_id = ?
      AND is_bookable = 1
      AND start_at >= ?
      AND end_at <= ?
    ORDER BY start_at ASC
    `
  )
    .bind(practitionerId, from, to)
    .all<{
      id: string;
      practitioner_id: string;
      start_at: string;
      end_at: string;
    }>();

  return c.json({
    practitioner_id: practitionerId,
    from,
    to,
    slots: rows.results ?? [],
  });
});

export default availabilityRouter;
