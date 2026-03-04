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
import { supabase } from "../lib/supabase";

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

const INITIAL_FORM = {
  name: "",
  email: "",
  phone: "",
  message: "",
  contactMethod: "email",
  newsletter: false,
  privacy: false,
};

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

export default function ContactCTA() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
    if (submitError) setSubmitError(null);
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

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setSubmitting(true);
    setSubmitError(null);

    // ✅ Column names match schema.sql exactly
    const { error } = await supabase.from("contact_submissions").insert([
      {
        full_name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.trim() || null,
        message: form.message.trim(),
        preferred_contact: form.contactMethod, // schema: preferred_contact
        newsletter_opt_in: form.newsletter, // schema: newsletter_opt_in
      },
    ]);

    setSubmitting(false);
    if (error) {
      setSubmitError(
        "Couldn't send your message. Please email us directly at hello@valeriemunozpsyc.com.",
      );
    } else {
      setSubmitted(true);
    }
  };

  const borderColor = (hasErr) => (hasErr ? "#fca5a5" : "#e0ddd6");
  const bgColor = (hasErr) => (hasErr ? "#fff7f7" : "white");

  return (
    <section
      id="contact"
      className="py-20"
      style={{
        background: "linear-gradient(180deg, #fdfcf7 0%, #f0f7f0 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            therapist within 24 hours — no pressure, no commitment.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── Left panel ── */}
          <div className="lg:col-span-2 space-y-6">
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

          {/* ── Right: form ── */}
          <div className="lg:col-span-3">
            <div
              className="rounded-3xl shadow-sm p-8"
              style={{ background: "white", border: "1.5px solid #f0ede8" }}
            >
              {submitted ? (
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
                  {form.newsletter && (
                    <p className="text-xs mb-8" style={{ color: "#c4bdb3" }}>
                      You're also subscribed to our wellness newsletter.
                    </p>
                  )}
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setForm(INITIAL_FORM);
                      setErrors({});
                      setSubmitError(null);
                    }}
                    className="px-6 py-3 rounded-2xl border-2 font-semibold text-sm hover:shadow-md transition-all"
                    style={{ borderColor: "#16a34a", color: "#16a34a" }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <div className="space-y-5">
                  <h3
                    className="text-xl font-bold"
                    style={{ color: "#333645" }}
                  >
                    Send Us a Message
                  </h3>

                  {submitError && (
                    <div
                      className="px-4 py-3 rounded-xl flex items-start gap-2.5 text-sm"
                      style={{
                        background: "#fff7f7",
                        border: "1.5px solid #fca5a5",
                        color: "#dc2626",
                      }}
                    >
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      {submitError}
                    </div>
                  )}

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label
                        className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                        style={{ color: "#333645" }}
                      >
                        Full Name <span style={{ color: "#16a34a" }}>*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Jane Doe"
                        value={form.name}
                        onChange={(e) => set("name", e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                        style={{
                          borderColor: borderColor(errors.name),
                          background: bgColor(errors.name),
                          color: "#333645",
                        }}
                        onFocus={(e) =>
                          (e.target.style.borderColor = "#16a34a")
                        }
                        onBlur={(e) =>
                          (e.target.style.borderColor = borderColor(
                            errors.name,
                          ))
                        }
                      />
                      <FieldError message={errors.name} />
                    </div>
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

                  <div>
                    <label
                      className="block text-xs font-bold uppercase tracking-wide mb-1.5"
                      style={{ color: "#333645" }}
                    >
                      Email Address <span style={{ color: "#16a34a" }}>*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => set("email", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                      style={{
                        borderColor: borderColor(errors.email),
                        background: bgColor(errors.email),
                        color: "#333645",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = borderColor(errors.email))
                      }
                    />
                    <FieldError message={errors.email} />
                  </div>

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
                      value={form.message}
                      placeholder="Tell us a little about what you're looking for, or ask us anything..."
                      onChange={(e) => set("message", e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all resize-none"
                      style={{
                        borderColor: borderColor(errors.message),
                        background: bgColor(errors.message),
                        color: "#333645",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#16a34a")}
                      onBlur={(e) =>
                        (e.target.style.borderColor = borderColor(
                          errors.message,
                        ))
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

                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
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
                        Sending…
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
