// ─── In-Memory Data Store ─────────────────────────────────────────────────────
// Simple client-side state management for demo purposes
// In production, replace with Supabase hooks

// ─── Services Data ────────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: "free-consultation",
    name: "Free Consultation",
    description:
      "A 15-minute introductory session to discuss your needs and see if we're a good fit.",
    duration: 15,
    price: 0,
    deposit: 0,
    color: "#16a34a",
    intakeQuestions: [],
  },
  {
    id: "individual-therapy",
    name: "Individual Therapy",
    description:
      "One-on-one holistic therapy session addressing anxiety, depression, trauma, or personal growth.",
    duration: 60,
    price: 120,
    deposit: 30,
    color: "#3a6d77",
    intakeQuestions: [
      "What brings you to therapy at this time?",
      "Have you participated in therapy before?",
    ],
  },
  {
    id: "couples-therapy",
    name: "Couples Therapy",
    description:
      "Relationship counseling for couples seeking deeper connection, communication, or conflict resolution.",
    duration: 90,
    price: 180,
    deposit: 50,
    color: "#c4b5e2",
    intakeQuestions: [
      "What are your primary goals for couples therapy?",
      "How long have you been together?",
    ],
  },
  {
    id: "group-session",
    name: "Group Wellness Session",
    description:
      "Join a small group (max 6) for guided mindfulness, breathwork, and holistic wellness practices.",
    duration: 90,
    price: 45,
    deposit: 0,
    color: "#a8b5a2",
    intakeQuestions: ["What are you hoping to gain from the group experience?"],
  },
];

// ─── Appointments Storage ─────────────────────────────────────────────────────
let appointments = [
  {
    id: "apt-001",
    serviceId: "free-consultation",
    clientName: "Chris Nguyen",
    clientEmail: "chris@example.com",
    clientPhone: "(555) 123-4567",
    start: "2026-02-16T15:00:00.000Z",
    end: "2026-02-16T15:15:00.000Z",
    status: "confirmed",
    notes: "",
    intakeAnswers: {},
  },
  {
    id: "apt-002",
    serviceId: "individual-therapy",
    clientName: "Maya Rodriguez",
    clientEmail: "maya@example.com",
    clientPhone: "(555) 234-5678",
    start: "2026-02-17T10:00:00.000Z",
    end: "2026-02-17T11:00:00.000Z",
    status: "confirmed",
    notes: "",
    intakeAnswers: {
      "What brings you to therapy at this time?":
        "Dealing with work stress and anxiety",
      "Have you participated in therapy before?": "Yes, about 2 years ago",
    },
  },
  {
    id: "apt-003",
    serviceId: "couples-therapy",
    clientName: "Jordan & Alex Kim",
    clientEmail: "jordan.kim@example.com",
    clientPhone: "(555) 345-6789",
    start: "2026-02-17T14:00:00.000Z",
    end: "2026-02-17T15:30:00.000Z",
    status: "confirmed",
    notes: "",
    intakeAnswers: {
      "What are your primary goals for couples therapy?":
        "Improve communication and rebuild trust",
      "How long have you been together?": "5 years, married for 2",
    },
  },
  {
    id: "apt-004",
    serviceId: "individual-therapy",
    clientName: "Rita Chen",
    clientEmail: "rita.chen@example.com",
    clientPhone: "(555) 456-7890",
    start: "2026-02-18T09:00:00.000Z",
    end: "2026-02-18T10:00:00.000Z",
    status: "confirmed",
    notes: "",
    intakeAnswers: {},
  },
  {
    id: "apt-005",
    serviceId: "free-consultation",
    clientName: "David Park",
    clientEmail: "david.park@example.com",
    clientPhone: "",
    start: "2026-02-19T16:00:00.000Z",
    end: "2026-02-19T16:15:00.000Z",
    status: "pending",
    notes: "",
    intakeAnswers: {},
  },
];

// ─── Client Data ──────────────────────────────────────────────────────────────
const CLIENTS = [
  {
    id: "c1",
    name: "Chris Nguyen",
    email: "chris@example.com",
    status: "active",
    notes: "",
  },
  {
    id: "c2",
    name: "Maya Rodriguez",
    email: "maya@example.com",
    status: "active",
    notes: "",
  },
  {
    id: "c3",
    name: "Jordan & Alex Kim",
    email: "jordan.kim@example.com",
    status: "active",
    notes: "",
  },
  {
    id: "c4",
    name: "Rita Chen",
    email: "rita.chen@example.com",
    status: "active",
    notes: "",
  },
  {
    id: "c5",
    name: "David Park",
    email: "david.park@example.com",
    status: "pending",
    notes: "",
  },
  {
    id: "c6",
    name: "Emma Wilson",
    email: "emma.w@example.com",
    status: "active",
    notes: "",
  },
];

// ─── Services ─────────────────────────────────────────────────────────────────

export function getServices() {
  return [...SERVICES];
}

export function getServiceById(serviceId) {
  return SERVICES.find((s) => s.id === serviceId);
}

export function saveService(serviceData) {
  const index = SERVICES.findIndex((s) => s.id === serviceData.id);
  if (index === -1) {
    SERVICES.push({ ...serviceData });
    return serviceData;
  }
  SERVICES[index] = { ...SERVICES[index], ...serviceData };
  return SERVICES[index];
}

export function deleteService(serviceId) {
  const index = SERVICES.findIndex((s) => s.id === serviceId);
  if (index === -1) return false;
  SERVICES.splice(index, 1);
  return true;
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function getAppointments() {
  return [...appointments];
}

export function createAppointment(appointmentData) {
  const newAppointment = {
    id: `apt-${Date.now()}`,
    ...appointmentData,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };
  appointments.push(newAppointment);
  console.log("✅ Appointment created:", newAppointment);
  return newAppointment;
}

export function updateAppointment(appointmentId, updates) {
  const index = appointments.findIndex((apt) => apt.id === appointmentId);
  if (index === -1) {
    console.error("Appointment not found:", appointmentId);
    return null;
  }
  appointments[index] = {
    ...appointments[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  console.log("✅ Appointment updated:", appointments[index]);
  return appointments[index];
}

export function cancelAppointment(appointmentId) {
  return updateAppointment(appointmentId, { status: "cancelled" });
}

export function deleteAppointment(appointmentId) {
  const initialLength = appointments.length;
  appointments = appointments.filter((apt) => apt.id !== appointmentId);
  const deleted = appointments.length < initialLength;
  if (deleted) {
    console.log("✅ Appointment deleted:", appointmentId);
  } else {
    console.error("Appointment not found:", appointmentId);
  }
  return deleted;
}

export function getAppointmentsByDateRange(startDate, endDate) {
  return appointments.filter((apt) => {
    const aptStart = new Date(apt.start);
    return aptStart >= startDate && aptStart <= endDate;
  });
}

export function getTodaysAppointments() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return getAppointmentsByDateRange(today, tomorrow);
}

export function getUpcomingAppointments() {
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
  return getAppointmentsByDateRange(now, sevenDaysFromNow).sort(
    (a, b) => new Date(a.start) - new Date(b.start),
  );
}

// ─── Clients ──────────────────────────────────────────────────────────────────

export function getClients() {
  return [...CLIENTS];
}

export function getActiveClientsCount() {
  return CLIENTS.filter((c) => c.status === "active").length;
}

export function saveClientNote(clientId, note) {
  const index = CLIENTS.findIndex((c) => c.id === clientId);
  if (index === -1) return null;
  CLIENTS[index] = {
    ...CLIENTS[index],
    notes: note,
    updatedAt: new Date().toISOString(),
  };
  return CLIENTS[index];
}

// ─── Revenue ──────────────────────────────────────────────────────────────────

export function getMonthlyRevenue() {
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const monthAppointments = getAppointmentsByDateRange(
    firstDayOfMonth,
    lastDayOfMonth,
  );
  return monthAppointments.reduce((total, apt) => {
    const service = getServiceById(apt.serviceId);
    return total + (service?.price || 0);
  }, 0);
}

export function getRevenueThisMonth() {
  return getMonthlyRevenue();
}

export function getDashboardStats() {
  const today = getTodaysAppointments();
  const upcoming = getUpcomingAppointments();
  return {
    todaySessions: today.length,
    activeClients: getActiveClientsCount(),
    monthlyRevenue: getMonthlyRevenue(),
    upcomingCount: upcoming.length,
  };
}
