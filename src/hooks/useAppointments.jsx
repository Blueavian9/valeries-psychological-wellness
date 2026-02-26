import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

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
  const { user } = useAuth()

  const [appointments, setAppointments] = useState([])
  const [clients,      setClients]      = useState([])
  const [services,     setServices]     = useState([])
  const [loading,      setLoading]      = useState(true)
  const [error,        setError]        = useState(null)

  // ── Fetch all data on mount ───────────────────────────────────────────────

  const fetchAll = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)

    try {
      const [apptRes, clientRes, serviceRes] = await Promise.all([
        supabase
          .from('appointments')
          .select(`
            *,
            client:clients(*),
            service:services(*)
          `)
          .order('start_time', { ascending: true }),

        supabase
          .from('clients')
          .select('*')
          .order('last_name', { ascending: true }),

        supabase
          .from('services')
          .select('*')
          .order('name', { ascending: true }),
      ])

      if (apptRes.error)    throw apptRes.error
      if (clientRes.error)  throw clientRes.error
      if (serviceRes.error) throw serviceRes.error

      setAppointments(apptRes.data ?? [])
      setClients(clientRes.data ?? [])
      setServices(serviceRes.data ?? [])
    } catch (err) {
      console.error('[useAppointments] fetchAll error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  // ── Real-time subscription ────────────────────────────────────────────────
  // Keeps the appointments list in sync without polling

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('appointments-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAppointments((prev) => [...prev, payload.new].sort(
              (a, b) => new Date(a.start_time) - new Date(b.start_time)
            ))
          }
          if (payload.eventType === 'UPDATE') {
            setAppointments((prev) =>
              prev.map((a) => (a.id === payload.new.id ? payload.new : a))
            )
          }
          if (payload.eventType === 'DELETE') {
            setAppointments((prev) => prev.filter((a) => a.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  // ── Appointments CRUD ─────────────────────────────────────────────────────

  /**
   * Create a new appointment.
   * @param {Object} apptData - { client_id, service_id, start_time, end_time, notes?, status? }
   */
  async function createAppointment(apptData) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([{
        ...apptData,
        status: apptData.status ?? 'scheduled',
        practitioner_id: user.id,
      }])
      .select(`*, client:clients(*), service:services(*)`)
      .single()

    if (error) {
      console.error('[useAppointments] createAppointment error:', error)
      return { data: null, error }
    }

    // Real-time will handle the state update; this is a safety net
    setAppointments((prev) =>
      [...prev, data].sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
    )
    return { data, error: null }
  }

  /**
   * Update an existing appointment.
   * @param {string} id - Appointment UUID
   * @param {Object} updates - Fields to update
   */
  async function updateAppointment(id, updates) {
    const { data, error } = await supabase
      .from('appointments')
      .update(updates)
      .eq('id', id)
      .select(`*, client:clients(*), service:services(*)`)
      .single()

    if (error) {
      console.error('[useAppointments] updateAppointment error:', error)
      return { data: null, error }
    }

    setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)))
    return { data, error: null }
  }

  /**
   * Cancel an appointment (soft delete — sets status to 'cancelled').
   * @param {string} id - Appointment UUID
   */
  async function cancelAppointment(id) {
    return updateAppointment(id, { status: 'cancelled' })
  }

  /**
   * Hard delete an appointment. Use cancelAppointment for most cases.
   * @param {string} id - Appointment UUID
   */
  async function deleteAppointment(id) {
    const { error } = await supabase.from('appointments').delete().eq('id', id)

    if (error) {
      console.error('[useAppointments] deleteAppointment error:', error)
      return { error }
    }

    setAppointments((prev) => prev.filter((a) => a.id !== id))
    return { error: null }
  }

  // ── Clients ───────────────────────────────────────────────────────────────

  /**
   * Create a new client.
   * @param {Object} clientData - { first_name, last_name, email, phone?, notes? }
   */
  async function createClient(clientData) {
    const { data, error } = await supabase
      .from('clients')
      .insert([{ ...clientData, practitioner_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error('[useAppointments] createClient error:', error)
      return { data: null, error }
    }

    setClients((prev) =>
      [...prev, data].sort((a, b) => a.last_name.localeCompare(b.last_name))
    )
    return { data, error: null }
  }

  /**
   * Look up a single client by ID (from local state — no extra DB call).
   * @param {string} id - Client UUID
   */
  function getClientById(id) {
    return clients.find((c) => c.id === id) ?? null
  }

  // ── Helpers ───────────────────────────────────────────────────────────────

  /** Appointments for a specific date (YYYY-MM-DD) */
  function getAppointmentsByDate(dateStr) {
    return appointments.filter((a) => a.start_time?.startsWith(dateStr))
  }

  /** Upcoming (future, non-cancelled) appointments */
  const upcomingAppointments = appointments.filter(
    (a) => a.status !== 'cancelled' && new Date(a.start_time) >= new Date()
  )

  /** Today's appointments */
  const todaysAppointments = getAppointmentsByDate(
    new Date().toISOString().split('T')[0]
  )

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
  }
}