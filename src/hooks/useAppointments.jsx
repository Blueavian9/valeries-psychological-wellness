import { useCallback, useEffect, useState } from "react";
import { neon } from "../lib/neon";
import { useAuth } from "./useAuth";

// ─────────────────────────────────────────────────────────────────────────────
// useAppointments
// Replaces all store.js calls for appointments, clients, and services.
//
// Usage:
//   const {
//     appointments, clients, services,
//     loading, error,
//     createAppointment, updateAppointment, cancelAppointment,
//     createClient, getClientById,
//   } = useAppointments()
// ─────────────────────────────────────────────────────────────────────────────

export function useAppointments() {
  const { user } = useAuth();

  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ── Fetch all data on mount ───────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);

    try {
      const [apptRes, clientRes, serviceRes] = await Promise.all([
        neon
          .from("appointments")
          .select(
            `
            *,
            client:clients(*),
            service:services(*)
          `,
          )
          .order("start_time", { ascending: true }),

        neon
          .from("clients")
          .select("*")
          .order("last_name", { ascending: true }),

        neon.from("services").select("*").order("name", { ascending: true }),
      ]);

      if (apptRes.error) throw apptRes.error;
      if (clientRes.error) throw clientRes.error;
      if (serviceRes.error) throw serviceRes.error;

      setAppointments(apptRes.data ?? []);
      setClients(clientRes.data ?? []);
      setServices(serviceRes.data ?? []);
    } catch (err) {
      console.error("[useAppointments] fetchAll error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // ── Keep list current ─────────────────────────────────────────────────────
  // Neon's Data API has no websocket/channel subscriptions (unlike Supabase
  // Realtime), so we poll instead. 30s is plenty for a booking dashboard —
  // nothing here needs sub-second live updates.

  useEffect(() => {
    if (!user) return;
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, [user, fetchAll]);

  // ── Appointments CRUD ─────────────────────────────────────────────────────

  /**
   * Create a new appointment.
   * @param {Object} apptData - { client_id, service_id, start_time, end_time, notes?, status? }
   */
  async function createAppointment(apptData) {
    const { data, error } = await neon
      .from("appointments")
      .insert([
        {
          ...apptData,
          status: apptData.status ?? "scheduled",
          practitioner_id: user.id,
        },
      ])
      .select(`*, client:clients(*), service:services(*)`)
      .single();

    if (error) {
      console.error("[useAppointments] createAppointment error:", error);
      return { data: null, error };
    }

    setAppointments((prev) =>
      [...prev, data].sort(
        (a, b) => new Date(a.start_time) - new Date(b.start_time),
      ),
    );
    return { data, error: null };
  }

  /**
   * Update an existing appointment.
   * @param {string} id - Appointment UUID
   * @param {Object} updates - Fields to update
   */
  async function updateAppointment(id, updates) {
    const { data, error } = await neon
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select(`*, client:clients(*), service:services(*)`)
      .single();

    if (error) {
      console.error("[useAppointments] updateAppointment error:", error);
      return { data: null, error };
    }

    setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)));
    return { data, error: null };
  }

  /**
   * Cancel an appointment (soft delete — sets status to 'cancelled').
   * @param {string} id - Appointment UUID
   */
  async function cancelAppointment(id) {
    return updateAppointment(id, { status: "cancelled" });
  }

  /**
   * Hard delete an appointment. Use cancelAppointment for most cases.
   * @param {string} id - Appointment UUID
   */
  async function deleteAppointment(id) {
    const { error } = await neon.from("appointments").delete().eq("id", id);

    if (error) {
      console.error("[useAppointments] deleteAppointment error:", error);
      return { error };
    }

    setAppointments((prev) => prev.filter((a) => a.id !== id));
    return { error: null };
  }

  // ── Clients ───────────────────────────────────────────────────────────────

  /**
   * Create a new client.
   * @param {Object} clientData - { first_name, last_name, email, phone?, notes? }
   */
  async function createClient(clientData) {
    const { data, error } = await neon
      .from("clients")
      .insert([{ ...clientData, practitioner_id: user.id }])
      .select()
      .single();

    if (error) {
      console.error("[useAppointments] createClient error:", error);
      return { data: null, error };
    }

    setClients((prev) =>
      [...prev, data].sort((a, b) => a.last_name.localeCompare(b.last_name)),
    );
    return { data, error: null };
  }

  /**
   * Look up a single client by ID (from local state — no extra DB call).
   * @param {string} id - Client UUID
   */
  function getClientById(id) {
    return clients.find((c) => c.id === id) ?? null;
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Appointments for a specific date (YYYY-MM-DD) */
  function getAppointmentsByDate(dateStr) {
    return appointments.filter((a) => a.start_time?.startsWith(dateStr));
  }

  /** Upcoming (future, non-cancelled) appointments */
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== "cancelled" && new Date(a.start_time) >= new Date(),
  );

  /** Today's appointments */
  const todaysAppointments = getAppointmentsByDate(
    new Date().toISOString().split("T")[0],
  );

  return {
    // State
    appointments,
    clients,
    services,
    loading,
    error,

    // Derived
    upcomingAppointments,
    todaysAppointments,

    // Appointments
    createAppointment,
    updateAppointment,
    cancelAppointment,
    deleteAppointment,
    getAppointmentsByDate,

    // Clients
    createClient,
    getClientById,

    // Manual refresh
    refetch: fetchAll,
  };
}
