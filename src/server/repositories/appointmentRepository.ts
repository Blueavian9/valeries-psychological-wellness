/**
 * Appointment Repository
 * Single Responsibility: Data access layer for appointments
 */
import type { D1Database } from "@cloudflare/workers-types";

export type Appointment = {
  id: string;
  practitioner_id: string;
  start_at: string;
  end_at: string;
  status: string;
  client_email: string;
  client_name: string | null;
  client_timezone: string | null;
  created_at: string;
  updated_at: string;
  canceled_at: string | null;
};

export type AppointmentCreateInput = {
  practitioner_id: string;
  start_at: string;
  end_at: string;
  client_email: string;
  client_name?: string | null;
  client_timezone?: string | null;
};

export interface IAppointmentRepository {
  create(input: AppointmentCreateInput): Promise<Appointment>;
  getById(id: string): Promise<Appointment | null>;
  findConflicting(
    practitionerId: string,
    startAt: string,
    endAt: string
  ): Promise<Appointment | null>;
}

export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly db: D1Database) {}

  async create(input: AppointmentCreateInput): Promise<Appointment> {
    const id = crypto.randomUUID();
    const now = new Date().toISOString();

    const result = await this.db
      .prepare(
        `
        INSERT INTO appointments
          (id, practitioner_id, start_at, end_at, status, client_email, client_name, client_timezone, created_at, updated_at)
        VALUES
          (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)
        RETURNING *
        `
      )
      .bind(
        id,
        input.practitioner_id,
        input.start_at,
        input.end_at,
        "booked",
        input.client_email,
        input.client_name ?? null,
        input.client_timezone ?? null,
        now,
        now
      )
      .first<Appointment>();

    if (!result) {
      throw new Error("Failed to create appointment");
    }

    return result;
  }

  async getById(id: string): Promise<Appointment | null> {
    return await this.db
      .prepare(
        `
        SELECT id, practitioner_id, start_at, end_at, status, client_email, client_name, 
               client_timezone, created_at, updated_at, canceled_at
        FROM appointments
        WHERE id = ?
        LIMIT 1
        `
      )
      .bind(id)
      .first<Appointment | null>();
  }

  /**
   * Find any existing appointment that conflicts with the given time slot.
   * A conflict occurs when appointments overlap in time for the same practitioner.
   */
  async findConflicting(
    practitionerId: string,
    startAt: string,
    endAt: string
  ): Promise<Appointment | null> {
    return await this.db
      .prepare(
        `
        SELECT id, practitioner_id, start_at, end_at, status, client_email, client_name,
               client_timezone, created_at, updated_at, canceled_at
        FROM appointments
        WHERE practitioner_id = ?
          AND status = 'booked'
          AND (
            (start_at < ? AND end_at > ?) OR  -- Overlaps start
            (start_at < ? AND end_at > ?) OR  -- Overlaps end
            (start_at >= ? AND end_at <= ?)   -- Fully contained
          )
        LIMIT 1
        `
      )
      .bind(practitionerId, endAt, startAt, endAt, startAt, startAt, endAt)
      .first<Appointment | null>();
  }
}
