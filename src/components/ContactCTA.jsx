import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  AlertCircle,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Heart,
} from "lucide-react";

// Simple email validation
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const CONTACT_METHODS = [
  { id: "email", label: "Email" },
  { id: "phone", label: "Phone" },
  { id: "either", label: "Either" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Twitter, href: "#", label: "Twitter" },
];

const TRUST_BADGES = [
  { emoji: "🔒", text: "HIPAA Aware" },
  { emoji: "⭐", text: "4.9 / 5 Rating" },
  { emoji: "✅", text: "Licensed Therapists" },
  { emoji: "💬", text: "Reply in < 2 hrs" },
];

function FieldError({ message }) {
  if (!message) return null;
  return (
    <p
      className="flex items-center gap-1 text-xs mt-1.5"
      style={{ color: "#dc2626" }}
    >
      <AlertCircle className="w-3 h-3" />
      {message}
    </p>
  );
}

function Input({ label, required, error, children, ...props }) {
  return (
    <div>
      <label
        className="block text-xs font-bold uppercase tracking-wide mb-1.5"
        style={{ color: "#333645" }}
      >
        {label} {required && <span style={{ color: "#16a34a" }}>*</span>}
      </label>
      {children || (
        <input
          className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
          style={{
            borderColor: error ? "#fca5a5" : "#e0ddd6",
            background: error ? "#fff7f7" : "white",
            color: "#333645",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
          onBlur={(e) =>
            (e.target.style.borderColor = error ? "#fca5a5" : "#e0ddd6")
          }
          {...props}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}

export default function ContactCTA() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    contactMethod: "email",
    newsletter: false,
    privacy: false,
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Your name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!isValidEmail(form.email))
      e.email = "Please enter a valid email address";
    if (!form.message.trim())
      e.message = "Please share your question or message";
    else if (form.message.trim().length < 10)
      e.message = "Message must be at least 10 characters";
    if (!form.privacy)
      e.privacy = "Please accept the privacy policy to continue";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    // Simulate API call — Future: replace with real fetch()
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <section
      id="contact"
      className="py-20"
      style={{
        background: "linear-gradient(180deg, #fdfcf7 0%, #f0f7f0 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#f0fdf4", color: "#16a34a" }}
          >
            Start Your Journey
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
            style={{ color: "#333645" }}
          >
            Ready to Begin Healing?
          </h2>
          <p
            className="max-w-xl mx-auto text-base"
            style={{ color: "#a8b5a2" }}
          >
            Take the first step. Our team will match you with the right
            therapist and platform within 24 hours — no pressure, no commitment.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── Left: info panel ─────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {/* CTA card */}
            <div
              className="rounded-3xl p-7 text-white"
              style={{
                background: "linear-gradient(135deg, #3a6d77 0%, #16a34a 100%)",
              }}
            >
              <Heart className="w-8 h-8 mb-4 opacity-80" />
              <h3 className="text-xl font-bold mb-3 leading-snug">
                Your first consultation is always free
              </h3>
              <p className="text-sm opacity-80 leading-relaxed mb-5">
                No credit card required. No commitment. Just a 15-minute
                conversation to see if holistic therapy is right for you.
              </p>
              <div className="space-y-3 text-sm">
                {[
                  { icon: Phone, text: "+1 (800) 555-0100" },
                  { icon: Mail, text: "hello@valeriemunozpsyc.com" },
                  {
                    icon: MapPin,
                    text: "Los Angeles, CA (Telehealth Nationwide)",
                  },
                ].map(({ icon: Icon, text }) => (
                  <div
                    key={text}
                    className="flex items-start gap-2.5 opacity-90"
                  >
                    <Icon className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3">
              {TRUST_BADGES.map(({ emoji, text }) => (
                <div
                  key={text}
                  className="rounded-2xl p-4 text-center shadow-sm"
                  style={{ background: "white", border: "1.5px solid #f0ede8" }}
                >
                  <div className="text-2xl mb-1">{emoji}</div>
                  <p
                    className="text-xs font-semibold"
                    style={{ color: "#333645" }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div
              className="rounded-2xl p-5 shadow-sm"
              style={{ background: "white", border: "1.5px solid #f0ede8" }}
            >
              <p
                className="text-xs font-bold uppercase tracking-wide mb-4"
                style={{ color: "#a8b5a2" }}
              >
                Follow Our Wellness Journey
              </p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    aria-label={label}
                    className="w-10 h-10 rounded-xl flex items-center justify-center border-2 hover:shadow-md transition-all"
                    style={{ borderColor: "#e0ddd6", color: "#a8b5a2" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#16a34a";
                      e.currentTarget.style.color = "#16a34a";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e0ddd6";
                      e.currentTarget.style.color = "#a8b5a2";
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: contact form ───────────────────────────────────── */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl shadow-sm p-8"
              style={{ background: "white", border: "1.5px solid #f0ede8" }}
            >
              {submitted ? (
                /* ── Success state ── */
                <div className="py-10 text-center">
                  <div
                    className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg"
                    style={{
                      background: "linear-gradient(135deg, #16a34a, #3a6d77)",
                    }}
                  >
                    <Check className="w-10 h-10 text-white" />
                  </div>
                  <h3
                    className="text-2xl font-bold mb-3"
                    style={{ color: "#333645" }}
                  >
                    Message sent! 🌿
                  </h3>
                  <p className="text-sm mb-2" style={{ color: "#a8b5a2" }}>
                    We'll be in touch within 2 hours at{" "}
                    <strong style={{ color: "#16a34a" }}>{form.email}</strong>
                  </p>
                  <p className="text-xs mb-8" style={{ color: "#c4bdb3" }}>
                    {form.newsletter
                      ? "You're also subscribed to our wellness newsletter."
                      : ""}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm({
                        name: "",
                        email: "",
                        phone: "",
                        message: "",
                        contactMethod: "email",
                        newsletter: false,
                        privacy: false,
                      });
                      setErrors({});
                    }}
                    className="px-6 py-3 rounded-2xl border-2 font-semibold text-sm transition-all hover:shadow-md"
                    style={{ borderColor: "#16a34a", color: "#16a34a" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                /* ── Form ── */
                <div className="space-y-5">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#333645" }}
                  >
                    Send Us a Message
                  </h3>

                  {/* Name + Phone row */}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <Input label="Full Name" required error={errors.name}>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                        style={{
                          borderColor: errors.name ? "#fca5a5" : "#e0ddd6",
                          color: "#333645",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#16a34a")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = errors.name
                            ? "#fca5a5"
                            : "#e0ddd6")
                        }
                      />
                    </Input>
                    <div>
                      <label
                        className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                        style={{ color: "#333645" }}
                      >
                        Phone{" "}
                        <span
                          className="font-normal normal-case"
                          style={{ color: "#c4bdb3" }}
                        >
                          (optional)
                        </span>
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={form.phone}
                        onChange={(e) => set("phone", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                        style={{ borderColor: "#e0ddd6", color: "#333645" }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#16a34a")
                        }
                        onBlur={(e) => (e.target.style.borderColor = "#e0ddd6")}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <Input label="Email Address" required error={errors.email}>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{
                        borderColor: errors.email ? "#fca5a5" : "#e0ddd6",
                        color: "#333645",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = errors.email
                          ? "#fca5a5"
                          : "#e0ddd6")
                      }
                    />
                    <FieldError message={errors.email} />
                  </Input>

                  {/* Preferred Contact Method */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wide mb-2"
                      style={{ color: "#333645" }}
                    >
                      Preferred Contact Method
                    </label>
                    <div className="flex gap-2">
                      {CONTACT_METHODS.map(({ id, label }) => (
                        <button
                          key={id}
                          type="button"
                          onClick={() => set("contactMethod", id)}
                          className="flex-1 py-2.5 rounded-xl border-2 text-xs font-semibold transition-all"
                          style={{
                            borderColor:
                              form.contactMethod === id ? "#16a34a" : "#e0ddd6",
                            background:
                              form.contactMethod === id ? "#f0fdf4" : "white",
                            color:
                              form.contactMethod === id ? "#16a34a" : "#a8b5a2",
                          }}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                      style={{ color: "#333645" }}
                    >
                      Message / Question{" "}
                      <span style={{ color: "#16a34a" }}>*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Tell us a little about what you're looking for, or ask us anything..."
                      value={form.message}
                      onChange={(e) => set("message", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all resize-none"
                      style={{
                        borderColor: errors.message ? "#fca5a5" : "#e0ddd6",
                        background: errors.message ? "#fff7f7" : "white",
                        color: "#333645",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = errors.message
                          ? "#fca5a5"
                          : "#e0ddd6")
                      }
                    />
                    <div className="flex justify-between items-start">
                      <FieldError message={errors.message} />
                      <span
                        className="text-xs mt-1 ml-auto"
                        style={{ color: "#c4bdb3" }}
                      >
                        {form.message.length}/500
                      </span>
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="space-y-3">
                    {/* Newsletter */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={{
                          borderColor: form.newsletter ? "#16a34a" : "#e0ddd6",
                          background: form.newsletter ? "#16a34a" : "white",
                        }}
                        onClick={() => set("newsletter", !form.newsletter)}
                      >
                        {form.newsletter && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm" style={{ color: "#6b7b6a" }}>
                        Subscribe to our weekly wellness newsletter — tips,
                        resources, and mindfulness practices.
                      </span>
                    </label>

                    {/* Privacy */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <div
                        className="w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all"
                        style={{
                          borderColor: errors.privacy
                            ? "#fca5a5"
                            : form.privacy
                              ? "#16a34a"
                              : "#e0ddd6",
                          background: form.privacy ? "#16a34a" : "white",
                        }}
                        onClick={() => set("privacy", !form.privacy)}
                      >
                        {form.privacy && (
                          <Check className="w-3 h-3 text-white" />
                        )}
                      </div>
                      <span className="text-sm" style={{ color: "#6b7b6a" }}>
                        I agree to the{" "}
                        <a
                          href="#"
                          style={{ color: "#16a34a" }}
                          className="underline hover:opacity-70"
                        >
                          Privacy Policy
                        </a>{" "}
                        and understand my information will be handled with care.{" "}
                        <span style={{ color: "#16a34a" }}>*</span>
                      </span>
                    </label>
                    <FieldError message={errors.privacy} />
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-4 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #16a34a, #3a6d77)",
                    }}
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>

                  <p
                    className="text-center text-xs"
                    style={{ color: "#c4bdb3" }}
                  >
                    🔒 Your message is encrypted and confidential
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
