/**
 * Appointment Service
 * Single Responsibility: Business logic for appointment operations
 */
import type { IAppointmentRepository } from "../repositories/appointmentRepository.js";
import type { AppointmentCreateInput, Appointment } from "../repositories/appointmentRepository.js";

export class AppointmentService {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  /**
   * Validate email format (basic check)
   */
  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  /**
   * Validate ISO timestamp string
   */
  private isValidIsoTimestamp(ts: string): boolean {
    const parsed = Date.parse(ts);
    return !Number.isNaN(parsed);
  }

  /**
   * Create a new appointment with validation and conflict checking
   */
  async createAppointment(input: AppointmentCreateInput): Promise<Appointment> {
    // Validate required fields
    if (!input.practitioner_id || input.practitioner_id.trim().length === 0) {
      throw new Error("practitioner_id is required");
    }

    if (!input.start_at || !input.end_at) {
      throw new Error("start_at and end_at are required");
    }

    if (!this.isValidIsoTimestamp(input.start_at)) {
      throw new Error("start_at must be a valid ISO timestamp");
    }

    if (!this.isValidIsoTimestamp(input.end_at)) {
      throw new Error("end_at must be a valid ISO timestamp");
    }

    const startMs = Date.parse(input.start_at);
    const endMs = Date.parse(input.end_at);

    if (endMs <= startMs) {
      throw new Error("end_at must be after start_at");
    }

    if (!input.client_email || input.client_email.trim().length === 0) {
      throw new Error("client_email is required");
    }

    if (!this.isValidEmail(input.client_email)) {
      throw new Error("client_email must be a valid email address");
    }

    // Check for conflicting appointments
    const conflict = await this.appointmentRepository.findConflicting(
      input.practitioner_id,
      input.start_at,
      input.end_at
    );

    if (conflict) {
      throw new Error(
        "This time slot is already booked. Please select another time."
      );
    }

    // Create the appointment
    return this.appointmentRepository.create({
      practitioner_id: input.practitioner_id.trim(),
      start_at: input.start_at,
      end_at: input.end_at,
      client_email: input.client_email.trim().toLowerCase(),
      client_name: input.client_name?.trim() || null,
      client_timezone: input.client_timezone?.trim() || null,
    });
  }

  /**
   * Get appointment by ID (for confirmation page)
   */
  async getAppointmentById(id: string): Promise<Appointment | null> {
    if (!id || id.trim().length === 0) {
      throw new Error("Appointment ID is required");
    }

    return this.appointmentRepository.getById(id.trim());
  }
}
