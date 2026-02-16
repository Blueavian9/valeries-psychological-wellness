import { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, Navigate } from "react-router-dom";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  ChevronRight,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Menu,
  X,
  Plus,
  Pencil,
  Trash2,
  ChevronLeft,
  Eye,
  Leaf,
  AlertCircle,
  TrendingUp,
  Bell,
} from "lucide-react";
import {
  getAppointments,
  getClients,
  getServices,
  cancelAppointment,
  saveClientNote,
  saveService,
  deleteService,
  getRevenueThisMonth,
} from "../services/store.js";

// ─── Palette ──────────────────────────────────────────────────────────────────
const P = {
  cream: "#fdfcf7",
  sage: "#a8b5a2",
  lavender: "#c4b5e2",
  teal: "#3a6d77",
  taupe: "#b8a88f",
  charcoal: "#333645",
  coral: "#e8b4bc",
  bg: "#f5f3ee",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
const fmtTime = (iso) =>
  new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
const fmtMoney = (n) => `$${n.toLocaleString()}`;

const STATUS_STYLES = {
  confirmed: { bg: `${P.sage}25`, color: P.teal, label: "Confirmed" },
  cancelled: { bg: "#fef2f2", color: "#dc2626", label: "Cancelled" },
  completed: { bg: `${P.lavender}30`, color: "#7c3aed", label: "Completed" },
};
const PAYMENT_STYLES = {
  paid: { bg: `${P.sage}25`, color: "#15803d", label: "Paid" },
  deposit: { bg: `${P.lavender}30`, color: "#7c3aed", label: "Deposit" },
  pending: { bg: "#fef9c3", color: "#b45309", label: "Pending" },
  free: { bg: "#f0f9ff", color: "#0369a1", label: "Free" },
};

function Badge({ style, label }) {
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ open, onClose }) {
  const loc = useLocation();
  const nav = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Overview" },
    { to: "/dashboard/calendar", icon: Calendar, label: "Calendar" },
    { to: "/dashboard/clients", icon: Users, label: "Clients" },
    { to: "/dashboard/services", icon: Settings, label: "Services" },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
        fixed lg:static inset-y-0 left-0 z-40 w-60 flex flex-col shadow-xl lg:shadow-none
        transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
        style={{ background: P.charcoal }}
      >
        {/* Logo */}
        <div
          className="flex items-center justify-between px-5 py-5 border-b"
          style={{ borderColor: "#ffffff18" }}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${P.teal}, ${P.sage})`,
              }}
            >
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">
                HarmonyFlow
              </p>
              <p className="text-xs mt-0.5" style={{ color: P.sage }}>
                Practice Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => {
            const active = loc.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{
                  background: active ? `${P.teal}40` : "transparent",
                  color: active ? "white" : P.sage,
                }}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t"
          style={{ borderColor: "#ffffff18" }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold"
              style={{
                background: `linear-gradient(135deg, ${P.coral}, ${P.lavender})`,
              }}
            >
              V
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Valerie Muñoz</p>
              <p className="text-xs" style={{ color: P.sage }}>
                Licensed Therapist
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// ─── Overview Panel ───────────────────────────────────────────────────────────
function Overview() {
  const [appts, setAppts] = useState([]);
  const [clients, setClients] = useState([]);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    setAppts(getAppointments());
    setClients(getClients());
    setRevenue(getRevenueThisMonth());
  }, []);

  const today = new Date();
  const upcoming = appts
    .filter((a) => new Date(a.start) >= today && a.status !== "cancelled")
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .slice(0, 5);

  const todayAppts = appts.filter((a) => {
    const d = new Date(a.start);
    return (
      d.toDateString() === today.toDateString() && a.status !== "cancelled"
    );
  });

  const stats = [
    {
      label: "Today's Sessions",
      value: todayAppts.length,
      icon: Calendar,
      color: P.teal,
      sub: "sessions scheduled",
    },
    {
      label: "Active Clients",
      value: clients.length,
      icon: Users,
      color: P.lavender,
      sub: "in your practice",
    },
    {
      label: "Revenue This Month",
      value: fmtMoney(revenue),
      icon: DollarSign,
      color: P.sage,
      sub: "confirmed payments",
    },
    {
      label: "Upcoming (7 days)",
      value: upcoming.length,
      icon: Clock,
      color: P.coral,
      sub: "sessions this week",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: P.charcoal }}>
          Good{" "}
          {new Date().getHours() < 12
            ? "morning"
            : new Date().getHours() < 17
              ? "afternoon"
              : "evening"}
          , Valerie 🌿
        </h1>
        <p className="text-sm mt-1" style={{ color: P.sage }}>
          {today.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, sub }) => (
          <div
            key={label}
            className="rounded-2xl p-5 shadow-sm"
            style={{ background: "white" }}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${color}20` }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUp className="w-4 h-4" style={{ color: P.sage }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: P.charcoal }}>
              {value}
            </p>
            <p
              className="text-sm font-medium mt-0.5"
              style={{ color: P.charcoal }}
            >
              {label}
            </p>
            <p className="text-xs mt-0.5" style={{ color: P.sage }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      {/* Today's sessions + Upcoming */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Today */}
        <div className="rounded-2xl shadow-sm" style={{ background: "white" }}>
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "#f0ede8" }}
          >
            <h2 className="font-bold text-sm" style={{ color: P.charcoal }}>
              Today's Sessions
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: `${P.teal}20`, color: P.teal }}
            >
              {todayAppts.length} sessions
            </span>
          </div>
          <div className="divide-y" style={{ borderColor: "#f0ede8" }}>
            {todayAppts.length === 0 ? (
              <div
                className="p-6 text-center text-sm"
                style={{ color: P.sage }}
              >
                No sessions scheduled today 🌿
              </div>
            ) : (
              todayAppts.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: a.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: P.charcoal }}
                    >
                      {a.clientName}
                    </p>
                    <p className="text-xs" style={{ color: P.sage }}>
                      {a.serviceName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-bold" style={{ color: P.teal }}>
                      {fmtTime(a.start)}
                    </p>
                    <Badge
                      style={
                        PAYMENT_STYLES[a.paymentStatus] ||
                        PAYMENT_STYLES.pending
                      }
                      label={
                        PAYMENT_STYLES[a.paymentStatus]?.label ||
                        a.paymentStatus
                      }
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming */}
        <div className="rounded-2xl shadow-sm" style={{ background: "white" }}>
          <div
            className="flex items-center justify-between p-5 border-b"
            style={{ borderColor: "#f0ede8" }}
          >
            <h2 className="font-bold text-sm" style={{ color: P.charcoal }}>
              Upcoming Appointments
            </h2>
            <Link
              to="/dashboard/calendar"
              className="text-xs font-semibold hover:opacity-70"
              style={{ color: P.teal }}
            >
              View all →
            </Link>
          </div>
          <div className="divide-y" style={{ borderColor: "#f0ede8" }}>
            {upcoming.length === 0 ? (
              <div
                className="p-6 text-center text-sm"
                style={{ color: P.sage }}
              >
                No upcoming appointments
              </div>
            ) : (
              upcoming.map((a) => (
                <div key={a.id} className="flex items-center gap-3 px-5 py-3.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ background: a.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-semibold truncate"
                      style={{ color: P.charcoal }}
                    >
                      {a.clientName}
                    </p>
                    <p className="text-xs" style={{ color: P.sage }}>
                      {a.serviceName}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-xs font-medium"
                      style={{ color: P.charcoal }}
                    >
                      {fmtDate(a.start)}
                    </p>
                    <p className="text-xs" style={{ color: P.sage }}>
                      {fmtTime(a.start)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Calendar Panel ───────────────────────────────────────────────────────────
function CalendarPanel() {
  const [view, setView] = useState("week"); // 'week' | 'month'
  const [refDate, setRefDate] = useState(new Date());
  const [appts, setAppts] = useState([]);
  const [selectedAppt, setSelectedAppt] = useState(null);

  useEffect(() => {
    setAppts(getAppointments());
  }, []);

  const refreshAppts = () => setAppts(getAppointments());

  // Week view helpers
  const weekStart = new Date(refDate);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });

  const apptsByDay = (day) =>
    appts.filter((a) => {
      const d = new Date(a.start);
      return (
        d.toDateString() === day.toDateString() && a.status !== "cancelled"
      );
    });

  // Month view helpers
  const firstDay = new Date(
    refDate.getFullYear(),
    refDate.getMonth(),
    1,
  ).getDay();
  const daysInMonth = new Date(
    refDate.getFullYear(),
    refDate.getMonth() + 1,
    0,
  ).getDate();

  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleCancel = (id) => {
    cancelAppointment(id);
    refreshAppts();
    setSelectedAppt(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold" style={{ color: P.charcoal }}>
          Calendar
        </h1>
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div
            className="flex rounded-xl border overflow-hidden"
            style={{ borderColor: "#e0ddd6" }}
          >
            {["week", "month"].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className="px-4 py-2 text-xs font-semibold capitalize transition-all"
                style={{
                  background: view === v ? P.teal : "white",
                  color: view === v ? "white" : P.charcoal,
                }}
              >
                {v}
              </button>
            ))}
          </div>
          {/* Nav */}
          <button
            onClick={() => {
              const d = new Date(refDate);
              if (view === "week") d.setDate(d.getDate() - 7);
              else d.setMonth(d.getMonth() - 1);
              setRefDate(d);
            }}
            className="p-2 rounded-xl border transition-all hover:bg-gray-50"
            style={{ borderColor: "#e0ddd6" }}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: P.charcoal }} />
          </button>
          <button
            onClick={() => setRefDate(new Date())}
            className="px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all hover:bg-gray-50"
            style={{ borderColor: "#e0ddd6", color: P.charcoal }}
          >
            Today
          </button>
          <button
            onClick={() => {
              const d = new Date(refDate);
              if (view === "week") d.setDate(d.getDate() + 7);
              else d.setMonth(d.getMonth() + 1);
              setRefDate(d);
            }}
            className="p-2 rounded-xl border transition-all hover:bg-gray-50"
            style={{ borderColor: "#e0ddd6" }}
          >
            <ChevronRight className="w-4 h-4" style={{ color: P.charcoal }} />
          </button>
        </div>
      </div>

      {view === "week" ? (
        <div
          className="rounded-2xl overflow-hidden shadow-sm"
          style={{ background: "white" }}
        >
          <div
            className="grid grid-cols-7 border-b"
            style={{ borderColor: "#f0ede8" }}
          >
            {weekDays.map((day, i) => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div
                  key={i}
                  className="p-3 text-center border-r last:border-0"
                  style={{ borderColor: "#f0ede8" }}
                >
                  <p
                    className="text-xs font-semibold"
                    style={{ color: P.sage }}
                  >
                    {
                      ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                        day.getDay()
                      ]
                    }
                  </p>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1 text-sm font-bold ${isToday ? "text-white" : ""}`}
                    style={{
                      background: isToday ? P.teal : "transparent",
                      color: isToday ? "white" : P.charcoal,
                    }}
                  >
                    {day.getDate()}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-7 min-h-64">
            {weekDays.map((day, i) => (
              <div
                key={i}
                className="p-2 border-r last:border-0 min-h-32"
                style={{ borderColor: "#f0ede8" }}
              >
                {apptsByDay(day).map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAppt(a)}
                    className="w-full text-left rounded-lg px-2 py-1.5 mb-1.5 text-xs font-medium hover:opacity-80 transition-opacity"
                    style={{
                      background: `${a.color}25`,
                      color: a.color,
                      borderLeft: `3px solid ${a.color}`,
                    }}
                  >
                    <p className="font-bold truncate">{fmtTime(a.start)}</p>
                    <p className="truncate opacity-80">{a.clientName}</p>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div
          className="rounded-2xl shadow-sm overflow-hidden"
          style={{ background: "white" }}
        >
          <div
            className="p-4 border-b text-center font-bold"
            style={{ borderColor: "#f0ede8", color: P.charcoal }}
          >
            {MONTHS[refDate.getMonth()]} {refDate.getFullYear()}
          </div>
          <div
            className="grid grid-cols-7 border-b"
            style={{ borderColor: "#f0ede8" }}
          >
            {DAYS_SHORT.map((d) => (
              <div
                key={d}
                className="p-2 text-center text-xs font-semibold"
                style={{ color: P.sage }}
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div
                key={`e${i}`}
                className="min-h-20 border-b border-r"
                style={{ borderColor: "#f0ede8" }}
              />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const d = new Date(
                refDate.getFullYear(),
                refDate.getMonth(),
                day,
              );
              const dayAppts = apptsByDay(d);
              const isToday = d.toDateString() === new Date().toDateString();
              return (
                <div
                  key={day}
                  className="min-h-20 p-1.5 border-b border-r"
                  style={{ borderColor: "#f0ede8" }}
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1`}
                    style={{
                      background: isToday ? P.teal : "transparent",
                      color: isToday ? "white" : P.charcoal,
                    }}
                  >
                    {day}
                  </div>
                  {dayAppts.slice(0, 2).map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAppt(a)}
                      className="w-full text-left rounded px-1 py-0.5 mb-0.5 text-xs truncate hover:opacity-80"
                      style={{ background: `${a.color}30`, color: a.color }}
                    >
                      {a.clientName}
                    </button>
                  ))}
                  {dayAppts.length > 2 && (
                    <p className="text-xs" style={{ color: P.sage }}>
                      +{dayAppts.length - 2} more
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Appointment detail drawer */}
      {selectedAppt && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40"
          onClick={() => setSelectedAppt(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="p-5"
              style={{ background: `${selectedAppt.color}15` }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p
                    className="font-bold text-lg"
                    style={{ color: P.charcoal }}
                  >
                    {selectedAppt.clientName}
                  </p>
                  <p className="text-sm" style={{ color: P.sage }}>
                    {selectedAppt.serviceName}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedAppt(null)}
                  className="p-1 rounded-lg hover:bg-white/50 transition-colors"
                >
                  <X className="w-4 h-4" style={{ color: P.sage }} />
                </button>
              </div>
            </div>
            <div className="p-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: P.sage }}>Date</span>{" "}
                <span className="font-semibold" style={{ color: P.charcoal }}>
                  {fmtDate(selectedAppt.start)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: P.sage }}>Time</span>{" "}
                <span className="font-semibold" style={{ color: P.charcoal }}>
                  {fmtTime(selectedAppt.start)} – {fmtTime(selectedAppt.end)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: P.sage }}>Email</span>{" "}
                <span className="font-semibold" style={{ color: P.charcoal }}>
                  {selectedAppt.clientEmail}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: P.sage }}>Status</span>{" "}
                <Badge
                  style={
                    STATUS_STYLES[selectedAppt.status] ||
                    STATUS_STYLES.confirmed
                  }
                  label={
                    STATUS_STYLES[selectedAppt.status]?.label ||
                    selectedAppt.status
                  }
                />
              </div>
              <div className="flex justify-between">
                <span style={{ color: P.sage }}>Payment</span>{" "}
                <Badge
                  style={
                    PAYMENT_STYLES[selectedAppt.paymentStatus] ||
                    PAYMENT_STYLES.pending
                  }
                  label={
                    PAYMENT_STYLES[selectedAppt.paymentStatus]?.label ||
                    selectedAppt.paymentStatus
                  }
                />
              </div>
              {selectedAppt.notes && (
                <div
                  className="pt-2 border-t"
                  style={{ borderColor: "#f0ede8" }}
                >
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: P.sage }}
                  >
                    NOTES
                  </p>
                  <p style={{ color: P.charcoal }}>{selectedAppt.notes}</p>
                </div>
              )}
            </div>
            {selectedAppt.status !== "cancelled" && (
              <div className="px-5 pb-5">
                <button
                  onClick={() => handleCancel(selectedAppt.id)}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border-2 transition-all hover:bg-red-50"
                  style={{ borderColor: "#fecaca", color: "#dc2626" }}
                >
                  Cancel Appointment
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Clients Panel ────────────────────────────────────────────────────────────
function ClientsPanel() {
  const [clients, setClients] = useState([]);
  const [appts, setAppts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editNote, setEditNote] = useState("");

  useEffect(() => {
    setClients(getClients());
    setAppts(getAppointments());
  }, []);

  const clientAppts = (email) =>
    appts
      .filter((a) => a.clientEmail === email)
      .sort((a, b) => new Date(b.start) - new Date(a.start));

  const handleSaveNote = () => {
    if (!selected) return;
    saveClientNote(selected.id, editNote);
    setClients(getClients());
    setSelected((c) => ({ ...c, notes: editNote }));
  };

  return (
    <div className="grid lg:grid-cols-5 gap-5">
      {/* Client list */}
      <div
        className="lg:col-span-2 rounded-2xl shadow-sm overflow-hidden"
        style={{ background: "white" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "#f0ede8" }}>
          <h2 className="font-bold" style={{ color: P.charcoal }}>
            All Clients
          </h2>
          <p className="text-xs mt-0.5" style={{ color: P.sage }}>
            {clients.length} clients in your practice
          </p>
        </div>
        <div
          className="divide-y overflow-y-auto"
          style={{ borderColor: "#f0ede8", maxHeight: "70vh" }}
        >
          {clients.map((c) => {
            const lastAppt = clientAppts(c.email)[0];
            const isSelected = selected?.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => {
                  setSelected(c);
                  setEditNote(c.notes || "");
                }}
                className="w-full text-left px-4 py-3.5 transition-all hover:bg-gray-50 flex items-center gap-3"
                style={{ background: isSelected ? `${P.teal}10` : "white" }}
              >
                <div
                  className="w-9 h-9 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm text-white"
                  style={{
                    background: `linear-gradient(135deg, ${P.teal}, ${P.sage})`,
                  }}
                >
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: P.charcoal }}
                  >
                    {c.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: P.sage }}>
                    {lastAppt
                      ? `Last: ${fmtDate(lastAppt.start)}`
                      : "No sessions yet"}
                  </p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.tags?.slice(0, 1).map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${P.lavender}30`,
                        color: "#7c3aed",
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Client detail */}
      <div className="lg:col-span-3">
        {!selected ? (
          <div
            className="rounded-2xl shadow-sm h-64 flex items-center justify-center"
            style={{ background: "white" }}
          >
            <div className="text-center">
              <Users
                className="w-12 h-12 mx-auto mb-3"
                style={{ color: P.sage }}
              />
              <p className="text-sm font-medium" style={{ color: P.sage }}>
                Select a client to view details
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Header */}
            <div
              className="rounded-2xl shadow-sm p-6"
              style={{ background: "white" }}
            >
              <div className="flex items-start gap-4 mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl text-white"
                  style={{
                    background: `linear-gradient(135deg, ${P.teal}, ${P.sage})`,
                  }}
                >
                  {selected.name[0]}
                </div>
                <div>
                  <h2
                    className="text-xl font-bold"
                    style={{ color: P.charcoal }}
                  >
                    {selected.name}
                  </h2>
                  <p className="text-sm" style={{ color: P.sage }}>
                    {selected.email}
                  </p>
                  {selected.phone && (
                    <p className="text-sm" style={{ color: P.sage }}>
                      {selected.phone}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selected.tags?.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: `${P.lavender}30`, color: "#7c3aed" }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div
              className="rounded-2xl shadow-sm p-5"
              style={{ background: "white" }}
            >
              <h3
                className="font-bold text-sm mb-3"
                style={{ color: P.charcoal }}
              >
                Private Notes
              </h3>
              <textarea
                rows={4}
                value={editNote}
                onChange={(e) => setEditNote(e.target.value)}
                placeholder="Confidential notes about this client's care, progress, preferences..."
                className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all resize-none"
                style={{
                  borderColor: "#e0ddd6",
                  background: P.cream,
                  color: P.charcoal,
                }}
                onFocus={(e) => (e.target.style.borderColor = P.teal)}
                onBlur={(e) => (e.target.style.borderColor = "#e0ddd6")}
              />
              <button
                onClick={handleSaveNote}
                className="mt-2 px-5 py-2 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: P.teal }}
              >
                Save Note
              </button>
            </div>

            {/* Appointment history */}
            <div
              className="rounded-2xl shadow-sm overflow-hidden"
              style={{ background: "white" }}
            >
              <div className="p-4 border-b" style={{ borderColor: "#f0ede8" }}>
                <h3 className="font-bold text-sm" style={{ color: P.charcoal }}>
                  Session History
                </h3>
              </div>
              <div className="divide-y" style={{ borderColor: "#f0ede8" }}>
                {clientAppts(selected.email).length === 0 ? (
                  <div
                    className="p-4 text-center text-sm"
                    style={{ color: P.sage }}
                  >
                    No sessions yet
                  </div>
                ) : (
                  clientAppts(selected.email).map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center gap-3 px-4 py-3"
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ background: a.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: P.charcoal }}
                        >
                          {a.serviceName}
                        </p>
                        <p className="text-xs" style={{ color: P.sage }}>
                          {fmtDate(a.start)} at {fmtTime(a.start)}
                        </p>
                      </div>
                      <Badge
                        style={
                          STATUS_STYLES[a.status] || STATUS_STYLES.confirmed
                        }
                        label={STATUS_STYLES[a.status]?.label || a.status}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Services Panel ───────────────────────────────────────────────────────────
function ServicesPanel() {
  const [services, setServices] = useState([]);
  const [editing, setEditing] = useState(null);
  const blank = {
    id: null,
    name: "",
    duration: 50,
    price: 0,
    deposit: 0,
    color: P.teal,
    description: "",
    bufferBefore: 10,
    bufferAfter: 10,
    intakeQuestions: [],
  };

  useEffect(() => {
    setServices(getServices());
  }, []);

  const refresh = () => setServices(getServices());

  const handleSave = () => {
    if (!editing?.name) return;
    saveService(editing);
    refresh();
    setEditing(null);
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this service?")) return;
    deleteService(id);
    refresh();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: P.charcoal }}>
          Services
        </h1>
        <button
          onClick={() => setEditing({ ...blank })}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all shadow-sm"
          style={{ background: P.teal }}
        >
          <Plus className="w-4 h-4" /> Add Service
        </button>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div
            key={svc.id}
            className="rounded-2xl shadow-sm overflow-hidden"
            style={{ background: "white" }}
          >
            <div className="h-2" style={{ background: svc.color }} />
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-bold" style={{ color: P.charcoal }}>
                    {svc.name}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: P.sage }}>
                    {svc.description}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setEditing({ ...svc })}
                    className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" style={{ color: P.sage }} />
                  </button>
                  <button
                    onClick={() => handleDelete(svc.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                  </button>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span
                  className="flex items-center gap-1"
                  style={{ color: P.teal }}
                >
                  <Clock className="w-3 h-3" /> {svc.duration} min
                </span>
                <span
                  className="flex items-center gap-1 font-bold"
                  style={{ color: svc.color }}
                >
                  <DollarSign className="w-3 h-3" />
                  {svc.price === 0 ? "Free" : `$${svc.price}`}
                </span>
                {svc.deposit > 0 && (
                  <span style={{ color: P.taupe }}>
                    Deposit: ${svc.deposit}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40"
          onClick={() => setEditing(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl shadow-2xl overflow-y-auto max-h-[90vh]"
            style={{ background: "white" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: "#f0ede8" }}
            >
              <h2 className="font-bold text-lg" style={{ color: P.charcoal }}>
                {editing.id ? "Edit Service" : "New Service"}
              </h2>
              <button
                onClick={() => setEditing(null)}
                className="p-1.5 rounded-lg hover:bg-gray-100"
              >
                <X className="w-4 h-4" style={{ color: P.sage }} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                {
                  key: "name",
                  label: "Service Name",
                  type: "text",
                  placeholder: "e.g. Individual Therapy",
                },
                {
                  key: "description",
                  label: "Description",
                  type: "text",
                  placeholder: "Brief description",
                },
                { key: "duration", label: "Duration (min)", type: "number" },
                { key: "price", label: "Price ($)", type: "number" },
                { key: "deposit", label: "Deposit ($)", type: "number" },
                {
                  key: "bufferBefore",
                  label: "Buffer Before (min)",
                  type: "number",
                },
                {
                  key: "bufferAfter",
                  label: "Buffer After (min)",
                  type: "number",
                },
              ].map(({ key, label, type, placeholder }) => (
                <div key={key}>
                  <label
                    className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                    style={{ color: P.charcoal }}
                  >
                    {label}
                  </label>
                  <input
                    type={type}
                    value={editing[key]}
                    onChange={(e) =>
                      setEditing((prev) => ({
                        ...prev,
                        [key]:
                          type === "number" ? +e.target.value : e.target.value,
                      }))
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border-2 text-sm outline-none"
                    style={{ borderColor: "#e0ddd6", color: P.charcoal }}
                  />
                </div>
              ))}
              <div>
                <label
                  className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                  style={{ color: P.charcoal }}
                >
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={editing.color}
                    onChange={(e) =>
                      setEditing((prev) => ({ ...prev, color: e.target.value }))
                    }
                    className="w-10 h-10 rounded-xl cursor-pointer border-2"
                    style={{ borderColor: "#e0ddd6" }}
                  />
                  <span className="text-sm" style={{ color: P.sage }}>
                    {editing.color}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3 px-6 pb-6">
              <button
                onClick={() => setEditing(null)}
                className="px-5 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all"
                style={{ borderColor: "#e0ddd6", color: P.charcoal }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white hover:opacity-90 transition-all"
                style={{ background: P.teal }}
              >
                {editing.id ? "Save Changes" : "Create Service"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard shell ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: P.bg }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header
          className="flex items-center justify-between px-5 py-3 border-b shadow-sm shrink-0"
          style={{ background: "white", borderColor: "#e8e4dd" }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          >
            <Menu className="w-5 h-5" style={{ color: P.charcoal }} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link
              to="/book"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition-all"
              style={{
                background: `linear-gradient(135deg, ${P.teal}, ${P.sage})`,
              }}
            >
              <Plus className="w-3.5 h-3.5" /> New Booking
            </Link>
            <button className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors">
              <Bell className="w-5 h-5" style={{ color: P.charcoal }} />
              <span
                className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                style={{ background: P.coral }}
              />
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="calendar" element={<CalendarPanel />} />
            <Route path="clients" element={<ClientsPanel />} />
            <Route path="services" element={<ServicesPanel />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
