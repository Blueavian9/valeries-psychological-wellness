import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Check, Clock, Calendar, ArrowLeft, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

// ─── HIPAA SEO: noindex this page ─────────────────────────────────────────────
// This page contains session reference data — must never be indexed by Google
// Phase 6 will add this via Vercel headers config as well

const palette = {
  cream: "#fdfcf7",
  sage: "#a8b5a2",
  teal: "#3a6d77",
  charcoal: "#333645",
  lavender: "#c4b5e2",
};

// ─── Status poller ────────────────────────────────────────────────────────────
// Polls Supabase every 2 seconds until webhook updates status to "confirmed"
// Stops after 30 seconds (15 attempts) to avoid infinite loop
function useAppointmentStatus(appointmentId) {
  const [status, setStatus] = useState("pending");
  const [appointment, setAppointment] = useState(null);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!appointmentId) return;
    if (status === "confirmed" || attempts >= 15) return;

    const timer = setTimeout(async () => {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          status,
          start_time,
          end_time,
          client_name,
          client_email,
          service:service_id (
            name,
            duration_minutes,
            price
          )
        `,
        )
        .eq("id", appointmentId)
        .single();

      if (!error && data) {
        setAppointment(data);
        setStatus(data.status);
      }
      setAttempts((a) => a + 1);
    }, 2000);

    return () => clearTimeout(timer);
  }, [appointmentId, status, attempts]);

  return { status, appointment };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BookingConfirmation() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get("appointment_id");
  const { status, appointment } = useAppointmentStatus(appointmentId);

  // ── No appointment ID in URL ──────────────────────────────────────────────
  if (!appointmentId) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: palette.cream }}
      >
        <div className="text-center max-w-md">
          <p
            className="text-lg font-bold mb-2"
            style={{ color: palette.charcoal }}
          >
            No booking found
          </p>
          <p className="text-sm mb-6" style={{ color: palette.sage }}>
            This confirmation link appears to be invalid.
          </p>
          <Link
            to="/booking"
            className="px-6 py-3 rounded-xl text-sm font-bold text-white"
            style={{ background: palette.teal }}
          >
            Book a Session
          </Link>
        </div>
      </div>
    );
  }

  // ── Pending: waiting for webhook ──────────────────────────────────────────
  if (status === "pending") {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ background: palette.cream }}
      >
        <div className="text-center max-w-md">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: `${palette.teal}15` }}
          >
            <Loader
              className="w-10 h-10 animate-spin"
              style={{ color: palette.teal }}
            />
          </div>
          <h1
            className="text-2xl font-bold mb-2"
            style={{ color: palette.charcoal }}
          >
            Confirming your booking…
          </h1>
          <p className="text-sm mb-2" style={{ color: palette.sage }}>
            We're processing your payment. This takes just a moment.
          </p>
          <p className="text-xs" style={{ color: palette.sage }}>
            Please don't close this window.
          </p>
        </div>
      </div>
    );
  }

  // ── Confirmed: webhook fired, DB updated ──────────────────────────────────
  if (status === "confirmed" && appointment) {
    const startTime = new Date(appointment.start_time);

    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{
          background: `linear-gradient(135deg, ${palette.cream} 0%, #eef4ee 100%)`,
        }}
      >
        {/* noindex meta — HIPAA + SEO requirement */}
        <head>
          <meta name="robots" content="noindex, nofollow" />
        </head>

        <div className="max-w-md w-full text-center">
          {/* Success icon */}
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${palette.teal}, ${palette.sage})`,
            }}
          >
            <Check className="w-10 h-10 text-white" />
          </div>

          <h1
            className="text-3xl font-bold mb-2"
            style={{ color: palette.charcoal }}
          >
            You're booked!
          </h1>
          <p className="text-sm mb-8" style={{ color: palette.sage }}>
            A confirmation has been sent to{" "}
            <strong style={{ color: palette.teal }}>
              {appointment.client_email}
            </strong>
          </p>

          {/* Booking summary card */}
          <div
            className="rounded-2xl p-6 mb-6 text-left shadow-sm"
            style={{ background: "white" }}
          >
            <p
              className="font-bold text-lg mb-4"
              style={{ color: palette.teal }}
            >
              {appointment.service?.name}
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Calendar
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.sage }}
                />
                <span style={{ color: palette.charcoal }}>
                  {startTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Clock
                  className="w-4 h-4 shrink-0"
                  style={{ color: palette.sage }}
                />
                <span style={{ color: palette.charcoal }}>
                  {startTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
                  {" · "}
                  {appointment.service?.duration_minutes} min session
                </span>
              </div>
            </div>

            {/* HIPAA privacy note */}
            <div
              className="mt-4 pt-4 border-t text-xs"
              style={{ borderColor: "#e8e4dd", color: "#8a9490" }}
            >
              🔒 Your session details are private and encrypted. Booking ID:{" "}
              {appointmentId.slice(0, 8)}…
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Link
              to="/booking"
              className="px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:shadow-md"
              style={{ borderColor: palette.teal, color: palette.teal }}
            >
              Book Another
            </Link>
            <Link
              to="/"
              className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md hover:opacity-90"
              style={{ background: palette.teal }}
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Fallback: timed out waiting for webhook ───────────────────────────────
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: palette.cream }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: `${palette.teal}15` }}
        >
          <Check className="w-10 h-10" style={{ color: palette.teal }} />
        </div>
        <h1
          className="text-2xl font-bold mb-2"
          style={{ color: palette.charcoal }}
        >
          Booking received!
        </h1>
        <p className="text-sm mb-6" style={{ color: palette.sage }}>
          Your payment was processed. You'll receive a confirmation email
          shortly. If you don't see it, check your spam folder.
        </p>
        <Link
          to="/"
          className="px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{ background: palette.teal }}
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
