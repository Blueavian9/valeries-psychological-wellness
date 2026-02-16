// ─────────────────────────────────────────────────────────────────────────────
// services/store.js
// In-memory data store with localStorage persistence.
// Future: replace read/write calls with real API fetch() calls.
// ─────────────────────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  APPOINTMENTS: "hf_appointments",
  CLIENTS: "hf_clients",
  SERVICES: "hf_services",
};

// ─── Default seed data ────────────────────────────────────────────────────────

const DEFAULT_SERVICES = [
  {
    id: "s1",
    name: "Individual Therapy",
    duration: 50,
    price: 120,
    deposit: 0,
    color: "#3a6d77",
    description: "One-on-one holistic therapy session",
    bufferBefore: 10,
    bufferAfter: 10,
    intakeQuestions: [
      "What brings you here today?",
      "Any relevant medical history?",
    ],
  },
  {
    id: "s2",
    name: "Couples Counseling",
    duration: 80,
    price: 180,
    deposit: 50,
    color: "#c4b5e2",
    description: "Therapy for couples using Gottman Method",
    bufferBefore: 10,
    bufferAfter: 15,
    intakeQuestions: [
      "How long have you been together?",
      "What is your main concern?",
    ],
  },
  {
    id: "s3",
    name: "Mindfulness Session",
    duration: 45,
    price: 80,
    deposit: 0,
    color: "#a8b5a2",
    description: "Guided breathwork, meditation and somatic grounding",
    bufferBefore: 5,
    bufferAfter: 10,
    intakeQuestions: ["Do you have a meditation practice?"],
  },
  {
    id: "s4",
    name: "Somatic / Trauma",
    duration: 60,
    price: 140,
    deposit: 40,
    color: "#b8a88f",
    description: "Body-based trauma processing using somatic experiencing",
    bufferBefore: 15,
    bufferAfter: 15,
    intakeQuestions: [
      "Do you have a trauma history you would like to share?",
      "Any physical conditions?",
    ],
  },
  {
    id: "s5",
    name: "Free Consultation",
    duration: 15,
    price: 0,
    deposit: 0,
    color: "#e8b4bc",
    description: "15-minute intro call to see if we are a good fit",
    bufferBefore: 0,
    bufferAfter: 5,
    intakeQuestions: ["What are you hoping to work on?"],
  },
];

const today = new Date();
const fmt = (d) => d.toISOString();
const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const setHour = (d, h, m = 0) => {
  const x = new Date(d);
  x.setHours(h, m, 0, 0);
  return x;
};

const DEFAULT_APPOINTMENTS = [
  {
    id: "a1",
    serviceId: "s1",
    serviceName: "Individual Therapy",
    clientName: "Maya Rodriguez",
    clientEmail: "maya@example.com",
    clientPhone: "555-0101",
    start: fmt(setHour(addDays(today, 1), 10)),
    end: fmt(setHour(addDays(today, 1), 11)),
    status: "confirmed",
    paymentStatus: "paid",
    notes: "First session. Anxiety focus.",
    intakeAnswers: { "What brings you here today?": "Anxiety and work stress" },
    color: "#3a6d77",
  },
  {
    id: "a2",
    serviceId: "s2",
    serviceName: "Couples Counseling",
    clientName: "Jordan & Alex Kim",
    clientEmail: "jordan@example.com",
    clientPhone: "555-0202",
    start: fmt(setHour(addDays(today, 1), 14)),
    end: fmt(setHour(addDays(today, 1), 15, 20)),
    status: "confirmed",
    paymentStatus: "deposit",
    notes: "",
    intakeAnswers: { "How long have you been together?": "4 years" },
    color: "#c4b5e2",
  },
  {
    id: "a3",
    serviceId: "s3",
    serviceName: "Mindfulness Session",
    clientName: "Priya Sharma",
    clientEmail: "priya@example.com",
    clientPhone: "555-0303",
    start: fmt(setHour(addDays(today, 2), 9)),
    end: fmt(setHour(addDays(today, 2), 9, 45)),
    status: "confirmed",
    paymentStatus: "pending",
    notes: "Returning client",
    intakeAnswers: {},
    color: "#a8b5a2",
  },
  {
    id: "a4",
    serviceId: "s4",
    serviceName: "Somatic / Trauma",
    clientName: "Sam Torres",
    clientEmail: "sam@example.com",
    clientPhone: "555-0404",
    start: fmt(setHour(addDays(today, 3), 11)),
    end: fmt(setHour(addDays(today, 3), 12)),
    status: "confirmed",
    paymentStatus: "paid",
    notes: "",
    intakeAnswers: {},
    color: "#b8a88f",
  },
  {
    id: "a5",
    serviceId: "s1",
    serviceName: "Individual Therapy",
    clientName: "Leila Hassan",
    clientEmail: "leila@example.com",
    clientPhone: "555-0505",
    start: fmt(setHour(addDays(today, 5), 13)),
    end: fmt(setHour(addDays(today, 5), 14)),
    status: "confirmed",
    paymentStatus: "paid",
    notes: "Depression + grief",
    intakeAnswers: {},
    color: "#3a6d77",
  },
  {
    id: "a6",
    serviceId: "s5",
    serviceName: "Free Consultation",
    clientName: "Chris Nguyen",
    clientEmail: "chris@example.com",
    clientPhone: "555-0606",
    start: fmt(setHour(addDays(today, 0), 15)),
    end: fmt(setHour(addDays(today, 0), 15, 15)),
    status: "confirmed",
    paymentStatus: "free",
    notes: "",
    intakeAnswers: {},
    color: "#e8b4bc",
  },
];

const DEFAULT_CLIENTS = [
  {
    id: "c1",
    name: "Maya Rodriguez",
    email: "maya@example.com",
    phone: "555-0101",
    notes:
      "Anxiety + work stress. Responds well to somatic grounding exercises.",
    tags: ["anxiety", "ongoing"],
  },
  {
    id: "c2",
    name: "Jordan & Alex Kim",
    email: "jordan@example.com",
    phone: "555-0202",
    notes: 'Communication issues. Good progress with "I" statements.',
    tags: ["couples"],
  },
  {
    id: "c3",
    name: "Priya Sharma",
    email: "priya@example.com",
    phone: "555-0303",
    notes: "Mindfulness focus. Returning client from 2023.",
    tags: ["mindfulness", "returning"],
  },
  {
    id: "c4",
    name: "Sam Torres",
    email: "sam@example.com",
    phone: "555-0404",
    notes: "Trauma history. Move slowly and with care.",
    tags: ["trauma", "somatic"],
  },
  {
    id: "c5",
    name: "Leila Hassan",
    email: "leila@example.com",
    phone: "555-0505",
    notes: "Grief + depression. Recently lost a parent.",
    tags: ["grief", "depression"],
  },
  {
    id: "c6",
    name: "Chris Nguyen",
    email: "chris@example.com",
    phone: "555-0606",
    notes: "New lead via website.",
    tags: ["new"],
  },
];

// ─── Storage helpers ──────────────────────────────────────────────────────────

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("localStorage write failed", e);
  }
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export function getAppointments() {
  return load(STORAGE_KEYS.APPOINTMENTS, DEFAULT_APPOINTMENTS);
}

export function saveAppointment(appt) {
  const all = getAppointments();
  const existing = all.findIndex((a) => a.id === appt.id);
  if (existing >= 0) {
    all[existing] = appt;
  } else {
    all.push(appt);
  }
  save(STORAGE_KEYS.APPOINTMENTS, all);
  return appt;
}

export function cancelAppointment(id) {
  const all = getAppointments().map((a) =>
    a.id === id ? { ...a, status: "cancelled" } : a,
  );
  save(STORAGE_KEYS.APPOINTMENTS, all);
}

export function createAppointment(data) {
  const service = getServices().find((s) => s.id === data.serviceId);
  const appt = {
    id: "a" + Date.now(),
    serviceId: data.serviceId,
    serviceName: service?.name || "",
    clientName: data.clientName,
    clientEmail: data.clientEmail,
    clientPhone: data.clientPhone || "",
    start: data.start,
    end: data.end,
    status: "confirmed",
    paymentStatus:
      service?.price === 0
        ? "free"
        : service?.deposit > 0
          ? "deposit"
          : "pending",
    notes: data.notes || "",
    intakeAnswers: data.intakeAnswers || {},
    color: service?.color || "#3a6d77",
  };
  saveAppointment(appt);
  // Also upsert client
  upsertClient({
    name: data.clientName,
    email: data.clientEmail,
    phone: data.clientPhone || "",
  });
  return appt;
}

// ─── Services ────────────────────────────────────────────────────────────────

export function getServices() {
  return load(STORAGE_KEYS.SERVICES, DEFAULT_SERVICES);
}

export function saveService(svc) {
  const all = getServices();
  const existing = all.findIndex((s) => s.id === svc.id);
  if (existing >= 0) {
    all[existing] = svc;
  } else {
    all.push({ ...svc, id: "s" + Date.now() });
  }
  save(STORAGE_KEYS.SERVICES, all);
}

export function deleteService(id) {
  const all = getServices().filter((s) => s.id !== id);
  save(STORAGE_KEYS.SERVICES, all);
}

// ─── Clients ─────────────────────────────────────────────────────────────────

export function getClients() {
  return load(STORAGE_KEYS.CLIENTS, DEFAULT_CLIENTS);
}

export function upsertClient(data) {
  const all = getClients();
  const existing = all.find((c) => c.email === data.email);
  if (!existing) {
    all.push({
      id: "c" + Date.now(),
      name: data.name,
      email: data.email,
      phone: data.phone || "",
      notes: "",
      tags: ["new"],
    });
    save(STORAGE_KEYS.CLIENTS, all);
  }
}

export function saveClientNote(clientId, notes) {
  const all = getClients().map((c) =>
    c.id === clientId ? { ...c, notes } : c,
  );
  save(STORAGE_KEYS.CLIENTS, all);
}

// ─── Revenue helpers ──────────────────────────────────────────────────────────

export function getRevenueThisMonth() {
  const now = new Date();
  const appts = getAppointments().filter((a) => {
    const d = new Date(a.start);
    return (
      d.getMonth() === now.getMonth() &&
      d.getFullYear() === now.getFullYear() &&
      a.status !== "cancelled" &&
      (a.paymentStatus === "paid" || a.paymentStatus === "deposit")
    );
  });
  const svcs = getServices();
  return appts.reduce((sum, a) => {
    const svc = svcs.find((s) => s.id === a.serviceId);
    if (!svc) return sum;
    return sum + (a.paymentStatus === "deposit" ? svc.deposit : svc.price);
  }, 0);
}
