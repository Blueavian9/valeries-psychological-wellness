import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const categories = [
  {
    id: "about",
    emoji: "🌿",
    title: "About Holistic Therapy",
    color: "#3a6d77",
    items: [
      {
        q: "What is holistic therapy?",
        a: "Holistic therapy is an integrative approach to mental health that treats the whole person — mind, body, and spirit — rather than focusing only on symptoms. It combines evidence-based psychological methods like CBT and DBT with complementary practices such as mindfulness, somatic experiencing, breathwork, yoga therapy, and energy work to address root causes and support lasting wellness.",
      },
      {
        q: "How does holistic therapy differ from traditional therapy?",
        a: "Traditional therapy typically focuses on thought patterns and behaviors. Holistic therapy expands this to include the physical body (nervous system regulation, somatic work), lifestyle factors (sleep, nutrition, movement), spiritual or existential wellbeing, and community connection. The goal is whole-person healing rather than symptom management alone.",
      },
      {
        q: "What modalities are typically included?",
        a: "Holistic therapy platforms may offer: Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), Somatic Experiencing, EMDR (Eye Movement Desensitization and Reprocessing), Mindfulness-Based Stress Reduction (MBSR), Yoga Therapy, Breathwork, Narrative Therapy, and Acceptance & Commitment Therapy (ACT). Your therapist will tailor the approach to your specific needs.",
      },
    ],
  },
  {
    id: "platform",
    emoji: "💻",
    title: "Platform Usage",
    color: "#a8b5a2",
    items: [
      {
        q: "How does online holistic therapy work?",
        a: "Online therapy works through secure video calls, phone sessions, or asynchronous messaging depending on the platform and your preferences. After matching with a therapist, you'll schedule sessions, complete any intake forms, and connect at your chosen time — from the comfort and privacy of your own space. Many clients find the home environment actually enhances the holistic experience.",
      },
      {
        q: "What technology do I need?",
        a: "Any modern device with a camera and microphone works — smartphone, tablet, or laptop. You'll need a reliable internet connection and a private space for sessions. No special software downloads are typically required; most platforms run entirely in your browser. We recommend a quiet space with good lighting for the best experience.",
      },
      {
        q: "Is my information secure and private?",
        a: "Yes. All platforms we compare use end-to-end encryption for video sessions and HIPAA-compliant data storage for your personal and health information. Your therapist is bound by professional confidentiality (with limited legal exceptions). We never sell or share your personal data. You can also choose audio-only sessions if you prefer not to be on camera.",
      },
    ],
  },
  {
    id: "pricing",
    emoji: "💳",
    title: "Pricing & Insurance",
    color: "#b8a88f",
    items: [
      {
        q: "How much does holistic therapy cost?",
        a: "Costs vary by platform and service type. Individual sessions typically range from $65–$150 per session, with subscription plans starting around $79/month for unlimited messaging and weekly video sessions. A free 15-minute consultation is available on most platforms to ensure it's the right fit before you commit.",
      },
      {
        q: "Do the platforms accept insurance?",
        a: "Many platforms accept major insurance plans including Aetna, Cigna, United Healthcare, and Blue Cross Blue Shield. Insurance coverage for holistic or integrative therapy is expanding. We recommend using the insurance checker tool during signup to verify your specific coverage before your first session. Flexible Spending Accounts (FSA) and Health Savings Accounts (HSA) are also accepted.",
      },
      {
        q: "Are there affordable options for those on a budget?",
        a: "Yes — several options exist: (1) Sliding scale fees based on income are available on most platforms; (2) Group therapy sessions are significantly less expensive than individual sessions; (3) Some platforms offer financial assistance programs; (4) Many employers offer EAP (Employee Assistance Programs) that include free therapy sessions. Our free consultation helps identify the most cost-effective option for your situation.",
      },
    ],
  },
  {
    id: "started",
    emoji: "🚀",
    title: "Getting Started",
    color: "#c4b5e2",
    items: [
      {
        q: "How do I choose the right platform?",
        a: "Use our comparison table to evaluate platforms based on: the therapy modalities offered (especially holistic/integrative), price range, insurance compatibility, therapist qualifications, session format (video/phone/text), and user reviews. We recommend prioritizing therapist-client fit over platform features — the relationship matters most.",
      },
      {
        q: "What's the therapist matching process like?",
        a: "Most platforms start with a brief intake questionnaire covering your concerns, goals, preferred therapy style, scheduling needs, and any preferences about therapist background. You're then matched with 1–3 compatible therapists. You can often preview their profiles and choose before your first session. Our upcoming Therapist Finder tool will make this even easier.",
      },
      {
        q: "Can I switch therapists if we're not a good fit?",
        a: "Absolutely — and you should. Therapeutic fit is one of the strongest predictors of outcomes. Every major platform allows you to switch therapists at any time, often within 24–48 hours, with no penalty or awkwardness. Finding the right match may take 1–2 attempts and that's completely normal. Your wellbeing matters more than avoiding a conversation.",
      },
    ],
  },
];

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  return (
    <div
      className="rounded-2xl overflow-hidden transition-all duration-200"
      style={{
        border: "1.5px solid",
        borderColor: isOpen ? "#d1fae5" : "#f0ede8",
        background: isOpen ? "#fafffe" : "white",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start justify-between gap-4 px-5 py-4 text-left transition-colors"
        aria-expanded={isOpen}
        style={{ background: "transparent" }}
      >
        <span
          className="font-semibold text-sm leading-relaxed"
          style={{ color: "#333645" }}
        >
          {question}
        </span>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300"
          style={{
            background: isOpen ? "#16a34a" : "#f0ede8",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
          }}
        >
          <ChevronDown
            className="w-3.5 h-3.5"
            style={{ color: isOpen ? "white" : "#a8b5a2" }}
          />
        </div>
      </button>

      {/* Answer — CSS max-height transition for smooth expand */}
      <div
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isOpen ? "400px" : "0px" }}
      >
        <div
          className="px-5 pb-5 pt-1 text-sm leading-relaxed"
          style={{ color: "#6b7b6a", borderTop: "1px solid #f0ede8" }}
        >
          {answer}
        </div>
      </div>
    </div>
  );
}

function FAQCategory({ category, openId, setOpenId }) {
  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-2.5 mb-4">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
          style={{ background: `${category.color}20` }}
        >
          {category.emoji}
        </div>
        <h3
          className="font-bold text-sm uppercase tracking-wider"
          style={{ color: category.color }}
        >
          {category.title}
        </h3>
      </div>

      <div className="space-y-2.5">
        {category.items.map((item, i) => {
          const id = `${category.id}-${i}`;
          return (
            <FAQItem
              key={id}
              question={item.q}
              answer={item.a}
              isOpen={openId === id}
              onToggle={() => setOpenId(openId === id ? null : id)}
            />
          );
        })}
      </div>
    </div>
  );
}

function FAQ() {
  const [openId, setOpenId] = useState("about-0"); // first item open by default

  const totalQuestions = categories.reduce((sum, c) => sum + c.items.length, 0);

  return (
    <section
      className="py-20"
      style={{ background: "white" }}
      // SEO: FAQ schema markup
      itemScope
      itemType="https://schema.org/FAQPage"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: "#f0fdf4", color: "#16a34a" }}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            Have Questions?
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
            style={{ color: "#333645" }}
          >
            Frequently Asked Questions
          </h2>
          <p
            className="max-w-xl mx-auto text-base"
            style={{ color: "#a8b5a2" }}
          >
            Everything you need to know before starting your holistic wellness
            journey. {totalQuestions} answers below.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-10">
          {categories.map((category) => (
            <FAQCategory
              key={category.id}
              category={category}
              openId={openId}
              setOpenId={setOpenId}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="mt-14 rounded-3xl p-7 text-center"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
            border: "1.5px solid #d1fae5",
          }}
        >
          <p className="font-bold text-base mb-2" style={{ color: "#333645" }}>
            Still have questions?
          </p>
          <p className="text-sm mb-5" style={{ color: "#a8b5a2" }}>
            Our team responds within 2 hours during business hours.
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all"
            style={{ background: "linear-gradient(135deg, #16a34a, #3a6d77)" }}
          >
            Ask Us Anything →
          </a>
        </div>
      </div>
    </section>
  );
}
