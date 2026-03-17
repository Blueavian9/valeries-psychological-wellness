import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  DollarSign,
  ArrowLeft,
  Leaf,
  Calendar,
  CreditCard,
  Lock,
} from "lucide-react";
import { supabase } from "../lib/supabase";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const palette = {
  cream: "#fdfcf7",
  sage: "#a8b5a2",
  lavender: "#c4b5e2",
  teal: "#3a6d77",
  taupe: "#b8a88f",
  charcoal: "#333645",
  coral: "#e8b4bc",
};

const SERVICE_COLORS = [palette.teal, palette.sage, palette.lavender, palette.coral];
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function generateTimeSlots(date) {
  const day = date.getDay();
  if (day === 0) return [];
  const [startH, endH] = day === 6 ? [10, 14] : [9, 18];
  const slots = [];
  for (let h = startH; h < endH; h++) {
    for (let m of [0, 30]) {
      if (h === endH - 1 && m === 30) continue;
      slots.push(`${h > 12 ? h - 12 : h === 0 ? 12 : h}:${m === 0 ? "00" : "30"} ${h >= 12 ? "PM" : "AM"}`);
    }
  }
  return slots.filter((_, i) => ![1, 4, 7, 10].includes(i));
}

function ServiceStep({ services, selectedId, onSelect }) {
  return (
    <div>
      <h2 style={{ color: palette.charcoal }} className="text-2xl font-bold mb-2">Choose a Service</h2>
      <p className="text-sm mb-8" style={{ color: palette.sage }}>Select the type of session that feels right for you.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((svc, idx) => {
          const color = svc.color ?? SERVICE_COLORS[idx % SERVICE_COLORS.length];
          return (
            <button key={svc.id} onClick={() => onSelect(svc.id)}
              className="text-left rounded-2xl p-5 border-2 transition-all hover:shadow-md hover:-translate-y-0.5"
              style={{ borderColor: selectedId === svc.id ? color : "#e8e4dd", background: selectedId === svc.id ? `${color}12` : palette.cream }}>
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}25` }}>
                  <Leaf className="w-5 h-5" style={{ color }} />
                </div>
                {selectedId === svc.id && (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: color }}>
                    <Check className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </div>
              <p className="font-bold text-sm mb-1" style={{ color: palette.charcoal }}>{svc.name}</p>
              {svc.description && <p className="text-xs mb-3" style={{ color: "#8a9490" }}>{svc.description}</p>}
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1" style={{ color: palette.teal }}><Clock className="w-3.5 h-3.5" /> {svc.duration_minutes} min</span>
                <span className="flex items-center gap-1 font-bold" style={{ color }}><DollarSign className="w-3.5 h-3.5" />{svc.price === 0 ? "Free" : `$${svc.price}`}</span>
                {svc.deposit > 0 && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}20`, color }}>${svc.deposit} deposit</span>}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarStep({ service, selectedDate, selectedTime, onSelect }) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const timeSlots = selectedDate ? generateTimeSlots(selectedDate) : [];

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); onSelect({ date: null, time: null }); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); onSelect({ date: null, time: null }); };
  const isSunday = (day) => new Date(viewYear, viewMonth, day).getDay() === 0;
  const isPast = (day) => { const d = new Date(viewYear, viewMonth, day); d.setHours(23, 59, 59); return d < today; };
  const isSelected = (day) => selectedDate && selectedDate.getFullYear() === viewYear && selectedDate.getMonth() === viewMonth && selectedDate.getDate() === day;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: palette.charcoal }}>Pick a Date & Time</h2>
      <p className="text-sm mb-6" style={{ color: palette.sage }}>Session: <strong style={{ color: palette.teal }}>{service.name}</strong> · {service.duration_minutes} min</p>
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 rounded-2xl border p-5" style={{ background: palette.cream, borderColor: "#e8e4dd" }}>
          <div className="flex items-center justify-between mb-5">
            <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white transition-colors" style={{ color: palette.charcoal }}><ChevronLeft className="w-4 h-4" /></button>
            <span className="font-bold text-sm" style={{ color: palette.charcoal }}>{MONTHS[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white transition-colors" style={{ color: palette.charcoal }}><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-xs py-1 font-semibold" style={{ color: palette.sage }}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }).map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const disabled = isPast(day) || isSunday(day);
              const selected = isSelected(day);
              const isToday = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
              return (
                <button key={day} disabled={disabled}
                  onClick={() => onSelect({ date: new Date(viewYear, viewMonth, day), time: null })}
                  className="aspect-square rounded-xl text-sm font-medium transition-all flex items-center justify-center"
                  style={{ background: selected ? palette.teal : isToday ? `${palette.teal}20` : "transparent", color: selected ? "white" : disabled ? "#ccc" : isToday ? palette.teal : palette.charcoal, cursor: disabled ? "not-allowed" : "pointer" }}>
                  {day}
                </button>
              );
            })}
          </div>
          <div className="mt-3 flex gap-4 text-xs" style={{ color: palette.sage }}>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ background: palette.teal }} /> Selected</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-200" /> Unavailable</span>
          </div>
        </div>
        <div className="lg:col-span-2">
          {!selectedDate ? (
            <div className="h-full flex items-center justify-center rounded-2xl border p-6 text-center" style={{ background: palette.cream, borderColor: "#e8e4dd" }}>
              <div><Calendar className="w-10 h-10 mx-auto mb-3" style={{ color: palette.sage }} /><p className="text-sm font-medium" style={{ color: palette.charcoal }}>Select a date to see available times</p></div>
            </div>
          ) : timeSlots.length === 0 ? (
            <div className="h-full flex items-center justify-center rounded-2xl border p-6 text-center" style={{ background: palette.cream, borderColor: "#e8e4dd" }}>
              <p className="text-sm" style={{ color: palette.sage }}>No availability on this day.</p>
            </div>
          ) : (
            <div className="rounded-2xl border p-5 h-full" style={{ background: palette.cream, borderColor: "#e8e4dd" }}>
              <p className="font-bold text-sm mb-4" style={{ color: palette.charcoal }}>{selectedDate.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}</p>
              <div className="grid grid-cols-2 gap-2 overflow-y-auto max-h-72">
                {timeSlots.map(time => (
                  <button key={time} onClick={() => onSelect({ date: selectedDate, time })}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold border-2 transition-all"
                    style={{ borderColor: selectedTime === time ? palette.teal : "#e0ddd6", background: selectedTime === time ? `${palette.teal}15` : "white", color: selectedTime === time ? palette.teal : palette.charcoal }}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailsStep({ service, form, onChange }) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: palette.charcoal }}>Your Details</h2>
      <p className="text-sm mb-8" style={{ color: palette.sage }}>Almost there — just a few details so we can prepare for your session.</p>
      <div className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: palette.charcoal }}>Full Name *</label>
            <input value={form.clientName} onChange={e => onChange("clientName", e.target.value)} placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
              style={{ borderColor: "#e0ddd6", background: "white", color: palette.charcoal }}
              onFocus={e => (e.target.style.borderColor = palette.teal)} onBlur={e => (e.target.style.borderColor = "#e0ddd6")} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: palette.charcoal }}>Phone (optional)</label>
            <input value={form.clientPhone} onChange={e => onChange("clientPhone", e.target.value)} placeholder="+1 (555) 000-0000"
              className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
              style={{ borderColor: "#e0ddd6", background: "white", color: palette.charcoal }}
              onFocus={e => (e.target.style.borderColor = palette.teal)} onBlur={e => (e.target.style.borderColor = "#e0ddd6")} />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: palette.charcoal }}>Email Address *</label>
          <input type="email" value={form.clientEmail} onChange={e => onChange("clientEmail", e.target.value)} placeholder="you@example.com"
            className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
            style={{ borderColor: "#e0ddd6", background: "white", color: palette.charcoal }}
            onFocus={e => (e.target.style.borderColor = palette.teal)} onBlur={e => (e.target.style.borderColor = "#e0ddd6")} />
        </div>
        <div className="p-4 rounded-2xl text-sm" style={{ background: `${palette.sage}20`, color: palette.charcoal }}>
          <p className="font-semibold mb-1">🔒 Your privacy matters</p>
          <p className="text-xs" style={{ color: "#6b7b6a" }}>Your information is kept strictly confidential and is never shared. This platform is HIPAA-aware and uses secure, encrypted communication.</p>
        </div>
      </div>
    </div>
  );
}

function ConfirmationStep({ service, selectedDate, selectedTime, form }) {
  const color = service.color ?? palette.teal;
  const chargeAmount = service.deposit > 0 ? service.deposit : service.price;
  const isFree = chargeAmount === 0;
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: palette.charcoal }}>Review & Confirm</h2>
      <p className="text-sm mb-8" style={{ color: palette.sage }}>Please check your booking details before confirming.</p>
      <div className="rounded-2xl border-2 overflow-hidden" style={{ borderColor: `${color}40` }}>
        <div className="p-5" style={{ background: `${color}15` }}>
          <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color }}>Session</p>
          <p className="text-xl font-bold" style={{ color: palette.charcoal }}>{service.name}</p>
          <p className="text-sm" style={{ color: "#6b7b6a" }}>{service.duration_minutes} min · {service.price === 0 ? "Free" : `$${service.price}`}</p>
        </div>
        <div className="p-5 space-y-3" style={{ background: palette.cream }}>
          {[
            { label: "Date", value: selectedDate?.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }) },
            { label: "Time", value: selectedTime },
            { label: "Name", value: form.clientName },
            { label: "Email", value: form.clientEmail },
            { label: "Phone", value: form.clientPhone || "Not provided" },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-start text-sm border-b pb-3 last:border-0 last:pb-0" style={{ borderColor: "#e8e4dd" }}>
              <span className="font-medium" style={{ color: palette.sage }}>{label}</span>
              <span className="font-semibold text-right ml-4" style={{ color: palette.charcoal }}>{value}</span>
            </div>
          ))}
        </div>
      </div>
      {!isFree && (
        <div className="mt-4 p-4 rounded-2xl text-sm" style={{ background: `${palette.lavender}30`, color: palette.charcoal }}>
          <p className="font-semibold">💳 {service.deposit > 0 ? `Deposit required: $${service.deposit}` : `Payment required: $${service.price}`}</p>
          <p className="text-xs mt-1" style={{ color: "#6b7b6a" }}>You'll enter your card details on the next step. Secure payment via Stripe.</p>
        </div>
      )}
      {isFree && (
        <div className="mt-4 p-4 rounded-2xl text-sm" style={{ background: `${palette.sage}20`, color: palette.charcoal }}>
          <p className="font-semibold">✅ No payment required</p>
          <p className="text-xs mt-1" style={{ color: "#6b7b6a" }}>This session is free. Click confirm to book your appointment.</p>
        </div>
      )}
    </div>
  );
}

function PaymentStep({ service, paymentError }) {
  const chargeAmount = service.deposit > 0 ? service.deposit : service.price;
  const isDeposit = service.deposit > 0;
  const cardElementOptions = {
    style: {
      base: { fontSize: "15px", color: palette.charcoal, fontFamily: "system-ui, sans-serif", "::placeholder": { color: "#b0b8b0" }, iconColor: palette.teal },
      invalid: { color: "#e05252", iconColor: "#e05252" },
    },
    hidePostalCode: false,
  };
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2" style={{ color: palette.charcoal }}>Secure Payment</h2>
      <p className="text-sm mb-8" style={{ color: palette.sage }}>{isDeposit ? `A deposit of $${chargeAmount} is required to confirm your booking.` : `Complete your $${chargeAmount} payment to confirm your session.`}</p>
      <div className="flex items-center justify-between p-4 rounded-2xl mb-6" style={{ background: `${palette.teal}10`, border: `1.5px solid ${palette.teal}30` }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${palette.teal}20` }}>
            <CreditCard className="w-5 h-5" style={{ color: palette.teal }} />
          </div>
          <div>
            <p className="font-bold text-sm" style={{ color: palette.charcoal }}>{service.name}</p>
            <p className="text-xs" style={{ color: palette.sage }}>{isDeposit ? "Deposit" : "Full payment"}</p>
          </div>
        </div>
        <p className="text-2xl font-bold" style={{ color: palette.teal }}>${chargeAmount}</p>
      </div>
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: palette.charcoal }}>Card Details</label>
        <div className="px-4 py-4 rounded-xl border-2 transition-all" style={{ borderColor: paymentError ? "#e05252" : "#e0ddd6", background: "white" }}>
          <CardElement options={cardElementOptions} />
        </div>
        {paymentError && <div className="p-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">⚠️ {paymentError}</div>}
      </div>
      <div className="mt-5 flex items-center gap-2 text-xs" style={{ color: "#8a9490" }}>
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>Your payment is encrypted and processed securely by Stripe. We never store your card details.</span>
      </div>
    </div>
  );
}

// ─── Main Booking Page ────────────────────────────────────────────────────────
export default function BookingPage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [step, setStep] = useState(serviceId ? 2 : 1);
  const [selectedServiceId, setSelectedServiceId] = useState(serviceId || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", clientPhone: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [paymentError, setPaymentError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(true);
  const [servicesError, setServicesError] = useState(null);

  useEffect(() => {
    async function fetchServices() {
      setLoadingServices(true);
      const { data, error } = await supabase.from("services").select("*").order("price", { ascending: true });
      if (error) setServicesError(error.message);
      else setServices(data);
      setLoadingServices(false);
    }
    fetchServices();
  }, []);

  const service = services.find(s => s.id === selectedServiceId);
  const chargeAmount = service ? service.deposit > 0 ? service.deposit : service.price : 0;
  const requiresPayment = chargeAmount > 0;

  const steps = [
    { n: 1, label: "Service" },
    { n: 2, label: "Date & Time" },
    { n: 3, label: "Details" },
    { n: 4, label: "Confirm" },
    ...(requiresPayment ? [{ n: 5, label: "Payment" }] : []),
  ];
  const totalSteps = steps.length;

  const canNext = () => {
    if (step === 1) return !!selectedServiceId;
    if (step === 2) return !!selectedDate && !!selectedTime;
    if (step === 3) return form.clientName.trim() && form.clientEmail.trim();
    if (step === 4) return true;
    if (step === 5) return !!stripe && !!elements;
    return true;
  };

  // ── Free booking ──────────────────────────────────────────────────────────
  const handleFreeBooking = async () => {
    if (!service || !selectedDate || !selectedTime) return;
    setSubmitting(true);
    setSubmitError(null);

    const [timePart, meridiem] = selectedTime.split(" ");
    const [hStr, mStr] = timePart.split(":");
    let h = parseInt(hStr);
    if (meridiem === "PM" && h !== 12) h += 12;
    if (meridiem === "AM" && h === 12) h = 0;
    const start = new Date(selectedDate);
    start.setHours(h, parseInt(mStr), 0, 0);
    const end = new Date(start.getTime() + service.duration_minutes * 60000);

    const { error } = await supabase.from("appointments").insert({
      service_id: service.id,
      scheduled_at: start.toISOString(),       // ← FIXED
      client_name: form.clientName,
      client_email: form.clientEmail,
      client_phone: form.clientPhone || null,
      start_time: start.toISOString(),
      end_time: end.toISOString(),
      status: "confirmed",
      notes: null,
    });

    if (error) setSubmitError(error.message);
    else setSubmitted(true);
    setSubmitting(false);
  };

  // ── Paid booking ──────────────────────────────────────────────────────────
  const handlePaidBooking = async () => {
    if (!stripe || !elements || !service) return;
    setSubmitting(true);
    setPaymentError(null);
    setSubmitError(null);

    try {
      const [timePart, meridiem] = selectedTime.split(" ");
      const [hStr, mStr] = timePart.split(":");
      let h = parseInt(hStr);
      if (meridiem === "PM" && h !== 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      const start = new Date(selectedDate);
      start.setHours(h, parseInt(mStr), 0, 0);
      const end = new Date(start.getTime() + service.duration_minutes * 60000);

      const { data: apptData, error: apptError } = await supabase
        .from("appointments")
        .insert({
          service_id: service.id,
          scheduled_at: start.toISOString(),   // ← FIXED
          client_name: form.clientName,
          client_email: form.clientEmail,
          client_phone: form.clientPhone || null,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
          status: "pending",
          notes: null,
        })
        .select("id")
        .single();

      if (apptError) throw new Error(apptError.message);
      const appointmentId = apptData.id;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ amount: chargeAmount, currency: "usd", metadata: { appointment_id: appointmentId, service_name: service.name } }),
        },
      );

      const { clientSecret, error: intentError } = await response.json();
      if (intentError) throw new Error(intentError);

      const cardElement = elements.getElement(CardElement);
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement, billing_details: { name: form.clientName, email: form.clientEmail } },
      });

      if (stripeError) { setPaymentError(stripeError.message); setSubmitting(false); return; }

      await supabase.from("appointments").update({ stripe_payment_intent_id: paymentIntent.id }).eq("id", appointmentId);

      // ── Fallback confirmation email ────────────────────────────────────────
      try {
        const scheduledAt = start.toLocaleString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
        await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({
            to: form.clientEmail,
            subject: "Your Appointment is Confirmed 🌿",
            html: `
              <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
                <div style="background:#4a7c59;padding:32px;text-align:center;">
                  <h1 style="color:#fff;margin:0;">🌿 Valerie's Psychological Wellness</h1>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#2d2d2d;">Booking Confirmed ✅</h2>
                  <p style="color:#555;">Hi <strong>${form.clientName}</strong>, your appointment has been booked!</p>
                  <table style="width:100%;background:#f0f7f1;border-radius:6px;padding:20px;margin:20px 0;">
                    <tr><td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                      <span style="color:#777;font-size:13px;">SERVICE</span><br/>
                      <strong>${service.name}</strong>
                    </td></tr>
                    <tr><td style="padding:8px 0;border-bottom:1px solid #d4e8d9;">
                      <span style="color:#777;font-size:13px;">DATE & TIME</span><br/>
                      <strong>${scheduledAt}</strong>
                    </td></tr>
                    <tr><td style="padding:8px 0;">
                      <span style="color:#777;font-size:13px;">AMOUNT PAID</span><br/>
                      <strong style="color:#4a7c59;font-size:18px;">$${chargeAmount}</strong>
                    </td></tr>
                  </table>
                  <p style="color:#555;font-size:14px;">You'll receive a reminder 24 hours before your appointment.</p>
                </div>
                <div style="background:#f9f9f9;padding:20px;text-align:center;border-top:1px solid #eee;">
                  <p style="color:#aaa;font-size:12px;margin:0;">© 2025 Valerie's Psychological Wellness</p>
                </div>
              </div>
            `,
          }),
        });
      } catch (emailErr) {
        console.warn("[FALLBACK EMAIL FAILED]", emailErr.message);
      }

      navigate(`/booking/confirmation?appointment_id=${appointmentId}`);
    } catch (err) {
      setSubmitError(err.message);
      setSubmitting(false);
    }
  };

  const handleSubmit = () => { if (requiresPayment) handlePaidBooking(); else handleFreeBooking(); };

  const reset = () => {
    setStep(1); setSelectedServiceId(null); setSelectedDate(null); setSelectedTime(null);
    setForm({ clientName: "", clientEmail: "", clientPhone: "" });
    setSubmitted(false); setSubmitError(null); setPaymentError(null);
  };

  if (submitted && service) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: `linear-gradient(135deg, ${palette.cream} 0%, #eef4ee 100%)` }}>
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg" style={{ background: `linear-gradient(135deg, ${palette.teal}, ${palette.sage})` }}>
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ color: palette.charcoal }}>You're booked!</h1>
          <p className="text-sm mb-6" style={{ color: palette.sage }}>A confirmation has been sent to <strong style={{ color: palette.teal }}>{form.clientEmail}</strong></p>
          <div className="rounded-2xl p-6 mb-6 text-left shadow-sm" style={{ background: "white" }}>
            <p className="font-bold text-lg mb-3" style={{ color: palette.teal }}>{service.name}</p>
            <p className="text-sm mb-1" style={{ color: palette.charcoal }}>📅 {selectedDate?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
            <p className="text-sm" style={{ color: palette.charcoal }}>🕐 {selectedTime}</p>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={reset} className="px-6 py-3 rounded-xl text-sm font-bold border-2 transition-all hover:shadow-md" style={{ borderColor: palette.teal, color: palette.teal }}>Book Another</button>
            <Link to="/" className="px-6 py-3 rounded-xl text-sm font-bold text-white transition-all hover:shadow-md hover:opacity-90" style={{ background: palette.teal }}>Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: `linear-gradient(180deg, ${palette.cream} 0%, white 100%)` }}>
      <div className="max-w-3xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm mb-8 hover:opacity-70 transition-opacity" style={{ color: palette.sage }}>
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => (
            <div key={s.n} className="flex items-center gap-2">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all"
                  style={{ background: step > s.n ? palette.sage : step === s.n ? palette.teal : "#e8e4dd", color: step >= s.n ? "white" : "#aaa" }}>
                  {step > s.n ? <Check className="w-4 h-4" /> : s.n}
                </div>
                <span className="text-xs mt-1 hidden sm:block" style={{ color: step === s.n ? palette.teal : palette.sage }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className="w-12 h-0.5 -mt-5 transition-all" style={{ background: step > s.n ? palette.sage : "#e8e4dd" }} />}
            </div>
          ))}
        </div>
        <div className="rounded-3xl shadow-sm border p-8" style={{ background: "white", borderColor: "#e8e4dd" }}>
          {step === 1 && loadingServices && (
            <div className="text-center py-16" style={{ color: palette.sage }}>
              <div className="w-8 h-8 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm">Loading services…</p>
            </div>
          )}
          {step === 1 && servicesError && <div className="text-center py-16"><p className="text-sm text-red-500">Failed to load services: {servicesError}</p></div>}
          {step === 1 && !loadingServices && !servicesError && <ServiceStep services={services} selectedId={selectedServiceId} onSelect={id => setSelectedServiceId(id)} />}
          {step === 2 && service && <CalendarStep service={service} selectedDate={selectedDate} selectedTime={selectedTime} onSelect={({ date, time }) => { setSelectedDate(date); setSelectedTime(time); }} />}
          {step === 3 && service && <DetailsStep service={service} form={form} onChange={(key, val) => setForm(f => ({ ...f, [key]: val }))} />}
          {step === 4 && service && <ConfirmationStep service={service} selectedDate={selectedDate} selectedTime={selectedTime} form={form} />}
          {step === 5 && service && <PaymentStep service={service} paymentError={paymentError} />}
          {submitError && <div className="mt-4 p-3 rounded-xl text-sm text-red-600 bg-red-50 border border-red-200">⚠️ Booking failed: {submitError}</div>}
          <div className="flex justify-between mt-8 pt-6 border-t" style={{ borderColor: "#e8e4dd" }}>
            <button onClick={() => setStep(s => s - 1)} disabled={step === 1}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all disabled:opacity-30"
              style={{ borderColor: "#e0ddd6", color: palette.charcoal }}>
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            {step < totalSteps ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: palette.teal }}>
                Continue →
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={!canNext() || submitting}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 hover:shadow-md disabled:opacity-60"
                style={{ background: `linear-gradient(135deg, ${palette.teal}, ${palette.sage})` }}>
                {submitting ? "Processing…" : requiresPayment ? `Pay $${chargeAmount} & Confirm ✓` : "Confirm Booking ✓"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}