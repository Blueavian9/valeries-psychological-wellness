/**
 * Appointments API Routes
 * Single Responsibility: Handle HTTP requests for appointment endpoints
 */
import { Hono } from "hono";
import type { Env } from "../types/env.js";
import { getDatabase } from "../db/connection.js";
import { AppointmentRepository } from "../repositories/appointmentRepository.js";
import { AppointmentService } from "../services/appointmentService.js";
import { writeAuditLog } from "../db/audit.js";

const appointmentsRouter = new Hono<{ Bindings: Env }>();

/**
 * POST /api/appointments
 * Create a new appointment booking
 */
appointmentsRouter.post("/appointments", async (c) => {
  try {
    const body = await c.req.json<{
      practitioner_id?: string;
      start_at?: string;
      end_at?: string;
      client_email?: string;
      client_name?: string;
      client_timezone?: string;
    }>();

    const db = getDatabase(c.env);
    const appointmentRepository = new AppointmentRepository(db);
    const appointmentService = new AppointmentService(appointmentRepository);

    const appointment = await appointmentService.createAppointment({
      practitioner_id: body.practitioner_id ?? "",
      start_at: body.start_at ?? "",
      end_at: body.end_at ?? "",
      client_email: body.client_email ?? "",
      client_name: body.client_name ?? null,
      client_timezone: body.client_timezone ?? null,
    });

    // Write audit log for the creation
    await writeAuditLog(db, {
      actor_type: "client",
      action: "create",
      entity: "appointments",
      entity_id: appointment.id,
      metadata: {
        practitioner_id: appointment.practitioner_id,
        start_at: appointment.start_at,
        end_at: appointment.end_at,
      },
    });

    // Return minimal confirmation payload (no sensitive details beyond what's needed)
    return c.json(
      {
        id: appointment.id,
        practitioner_id: appointment.practitioner_id,
        start_at: appointment.start_at,
        end_at: appointment.end_at,
        status: appointment.status,
        created_at: appointment.created_at,
      },
      201
    );
  } catch (error) {
    console.error("Error in POST /api/appointments:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to create appointment";
    return c.json({ error: errorMessage }, 400);
  }
});

/**
 * GET /api/appointments/:id
 * Get appointment confirmation details
 */
appointmentsRouter.get("/appointments/:id", async (c) => {
  try {
    const id = c.req.param("id");

    if (!id || id.trim().length === 0) {
      return c.json({ error: "Invalid appointment ID" }, 400);
    }

    const db = getDatabase(c.env);
    const appointmentRepository = new AppointmentRepository(db);
    const appointmentService = new AppointmentService(appointmentRepository);

    const appointment = await appointmentService.getAppointmentById(id);

    if (!appointment) {
      return c.json({ error: "Appointment not found" }, 404);
    }

    // Return minimal confirmation payload (no sensitive details)
    return c.json({
      id: appointment.id,
      practitioner_id: appointment.practitioner_id,
      start_at: appointment.start_at,
      end_at: appointment.end_at,
      status: appointment.status,
      created_at: appointment.created_at,
    });
  } catch (error) {
    console.error("Error in GET /api/appointments/:id:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch appointment";
    return c.json({ error: errorMessage }, 500);
  }
});

export default appointmentsRouter;
