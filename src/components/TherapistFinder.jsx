import { useState } from "react";
import {
  Heart,
  Brain,
  Users,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Star,
  Award,
  Video,
  MessageSquare,
  Clock,
  Languages,
  Shield,
} from "lucide-react";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const P = {
  cream: "#fdfcf7",
  sage: "#a8b5a2",
  teal: "#3a6d77",
  lavender: "#c4b5e2",
  taupe: "#b8a88f",
  charcoal: "#333645",
  green: "#16a34a",
};

// ─── Quiz Questions ───────────────────────────────────────────────────────────
const QUIZ_STEPS = [
  {
    id: "concerns",
    title: "What brings you to therapy?",
    subtitle: "Select all that apply",
    type: "multi-select",
    icon: Heart,
    color: P.teal,
    options: [
      { id: "anxiety", label: "Anxiety & Panic", emoji: "😰" },
      { id: "depression", label: "Depression & Mood", emoji: "😔" },
      { id: "trauma", label: "Trauma & PTSD", emoji: "💔" },
      { id: "stress", label: "Stress & Burnout", emoji: "😫" },
      { id: "relationships", label: "Relationship Issues", emoji: "💑" },
      { id: "transitions", label: "Life Transitions", emoji: "🌱" },
      { id: "identity", label: "Identity & Self-Esteem", emoji: "🪞" },
      { id: "grief", label: "Grief & Loss", emoji: "🕊️" },
    ],
  },
  {
    id: "approach",
    title: "What therapy approach resonates with you?",
    subtitle: "Choose your preferred style",
    type: "single-select",
    icon: Brain,
    color: P.lavender,
    options: [
      {
        id: "holistic",
        label: "Holistic & Integrative",
        desc: "Mind-body-spirit connection, mindfulness, somatic work",
      },
      {
        id: "cbt",
        label: "Cognitive Behavioral",
        desc: "Practical tools, thought patterns, goal-oriented",
      },
      {
        id: "psychodynamic",
        label: "Psychodynamic",
        desc: "Deep exploration, unconscious patterns, childhood roots",
      },
      {
        id: "humanistic",
        label: "Humanistic",
        desc: "Self-actualization, personal growth, client-centered",
      },
      {
        id: "eclectic",
        label: "Eclectic / Open",
        desc: "Flexible approach tailored to my needs",
      },
    ],
  },
  {
    id: "demographics",
    title: "Therapist background preferences",
    subtitle: "These help us match you better (optional)",
    type: "preferences",
    icon: Users,
    color: P.sage,
    fields: [
      {
        id: "gender",
        label: "Gender Preference",
        type: "select",
        options: ["No Preference", "Female", "Male", "Non-Binary"],
      },
      {
        id: "age",
        label: "Age Range Preference",
        type: "select",
        options: [
          "No Preference",
          "25-35 (Early Career)",
          "35-50 (Mid Career)",
          "50+ (Senior)",
        ],
      },
      {
        id: "cultural",
        label: "Cultural/Identity Match Important?",
        type: "select",
        options: [
          "Not Important",
          "Somewhat Important",
          "Very Important",
          "Essential",
        ],
      },
    ],
  },
  {
    id: "logistics",
    title: "Session preferences",
    subtitle: "How would you like to meet?",
    type: "logistics",
    icon: Calendar,
    color: P.taupe,
    fields: [
      {
        id: "format",
        label: "Session Format",
        type: "multi-select",
        options: ["Video Sessions", "Phone Sessions", "Messaging"],
      },
      {
        id: "frequency",
        label: "Preferred Frequency",
        type: "select",
        options: [
          "Once a week",
          "Twice a week",
          "Every 2 weeks",
          "Monthly / As needed",
        ],
      },
      {
        id: "time",
        label: "Preferred Time",
        type: "select",
        options: [
          "Morning (6am-12pm)",
          "Afternoon (12pm-5pm)",
          "Evening (5pm-9pm)",
          "Flexible",
        ],
      },
    ],
  },
  {
    id: "budget",
    title: "Budget & Insurance",
    subtitle: "Help us find affordable options",
    type: "budget",
    icon: DollarSign,
    color: P.green,
    fields: [
      {
        id: "insurance",
        label: "Do you have insurance?",
        type: "select",
        options: [
          "Yes - I want to use insurance",
          "Yes - But I prefer to pay out-of-pocket",
          "No insurance",
        ],
      },
      {
        id: "range",
        label: "Budget per Session",
        type: "select",
        options: [
          "Under $65",
          "$65-$100",
          "$100-$150",
          "$150-$200",
          "Over $200",
          "Flexible",
        ],
      },
    ],
  },
];

// ─── Mock Therapist Data ──────────────────────────────────────────────────────
const THERAPISTS = [
  {
    id: "t1",
    name: "Dr. Sarah Chen",
    credentials: "PhD, LMFT",
    photo: "👩🏻‍⚕️",
    rating: 4.9,
    reviews: 127,
    specialties: ["Anxiety", "Trauma", "EMDR", "Somatic Therapy"],
    approaches: ["holistic", "cbt"],
    concerns: ["anxiety", "trauma", "stress"],
    gender: "Female",
    age: "35-50",
    years: 12,
    languages: ["English", "Mandarin"],
    availability: "Immediate",
    rate: "$120-150",
    insurance: true,
    formats: ["Video", "Phone"],
    bio: "Specializing in trauma-informed care with a holistic mind-body approach. I integrate EMDR, somatic experiencing, and mindfulness to help clients heal from anxiety and past trauma.",
    match: 98,
  },
  {
    id: "t2",
    name: "Marcus Williams",
    credentials: "LCSW, CEDS",
    photo: "👨🏾‍⚕️",
    rating: 4.8,
    reviews: 89,
    specialties: [
      "Depression",
      "Life Transitions",
      "CBT",
      "Acceptance & Commitment",
    ],
    approaches: ["cbt", "humanistic"],
    concerns: ["depression", "transitions", "identity"],
    gender: "Male",
    age: "25-35",
    years: 7,
    languages: ["English", "Spanish"],
    availability: "2-3 weeks",
    rate: "$100-130",
    insurance: true,
    formats: ["Video", "Messaging"],
    bio: "I help young adults and professionals navigate life transitions, career stress, and identity exploration using practical CBT tools combined with compassionate humanistic therapy.",
    match: 94,
  },
  {
    id: "t3",
    name: "Dr. Priya Patel",
    credentials: "PsyD, LPCC",
    photo: "👩🏽‍⚕️",
    rating: 5.0,
    reviews: 156,
    specialties: [
      "Relationship Issues",
      "Cultural Identity",
      "Mindfulness",
      "Yoga Therapy",
    ],
    approaches: ["holistic", "psychodynamic"],
    concerns: ["relationships", "identity", "stress"],
    gender: "Female",
    age: "35-50",
    years: 15,
    languages: ["English", "Hindi", "Gujarati"],
    availability: "1 week",
    rate: "$140-170",
    insurance: false,
    formats: ["Video"],
    bio: "I blend depth psychology with Eastern mindfulness practices to help couples and individuals deepen self-awareness, heal relationship patterns, and find authentic connection.",
    match: 91,
  },
  {
    id: "t4",
    name: "Alex Rodriguez",
    credentials: "LMHC, NCC",
    photo: "🧑🏻‍⚕️",
    rating: 4.7,
    reviews: 64,
    specialties: ["LGBTQ+ Affirming", "Anxiety", "Self-Esteem", "DBT"],
    approaches: ["humanistic", "cbt"],
    concerns: ["anxiety", "identity", "relationships"],
    gender: "Non-Binary",
    age: "25-35",
    years: 5,
    languages: ["English"],
    availability: "Immediate",
    rate: "$80-110",
    insurance: true,
    formats: ["Video", "Phone", "Messaging"],
    bio: "LGBTQ+ affirming therapist specializing in identity exploration, coming out support, and building authentic self-esteem. I create a safe, validating space for all identities.",
    match: 89,
  },
  {
    id: "t5",
    name: "Dr. Emily Thompson",
    credentials: "PhD, LICSW",
    photo: "👩🏼‍⚕️",
    rating: 4.9,
    reviews: 203,
    specialties: [
      "Grief & Loss",
      "Chronic Illness",
      "Existential",
      "Art Therapy",
    ],
    approaches: ["psychodynamic", "holistic"],
    concerns: ["grief", "depression", "transitions"],
    gender: "Female",
    age: "50+",
    years: 22,
    languages: ["English", "French"],
    availability: "3-4 weeks",
    rate: "$160-200",
    insurance: false,
    formats: ["Video"],
    bio: "With over 20 years of experience, I guide clients through profound loss and existential questions using depth-oriented therapy, expressive arts, and compassionate presence.",
    match: 87,
  },
];

// ─── Helper Components ────────────────────────────────────────────────────────
function ProgressBar({ currentStep, totalSteps }) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        <span
          className="text-xs font-bold uppercase tracking-wide"
          style={{ color: P.sage }}
        >
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-xs font-bold" style={{ color: P.green }}>
          {Math.round(progress)}% Complete
        </span>
      </div>
      <div
        className="h-2 rounded-full overflow-hidden"
        style={{ background: "#f0ede8" }}
      >
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${P.green}, ${P.teal})`,
          }}
        />
      </div>
    </div>
  );
}

function MultiSelectOption({ option, selected, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="flex items-center justify-between gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all hover:shadow-md"
      style={{
        borderColor: selected ? P.green : "#e0ddd6",
        background: selected ? `${P.green}10` : "white",
      }}
    >
      <div className="flex items-center gap-3">
        <span className="text-2xl">{option.emoji || "✓"}</span>
        <div>
          <div className="font-semibold text-sm" style={{ color: P.charcoal }}>
            {option.label}
          </div>
          {option.desc && (
            <div className="text-xs mt-0.5" style={{ color: P.sage }}>
              {option.desc}
            </div>
          )}
        </div>
      </div>
      {selected && (
        <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: P.green }} />
      )}
    </button>
  );
}

function TherapistCard({ therapist, onSelect }) {
  return (
    <div
      className="rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
      style={{ background: "white", border: "1.5px solid #f0ede8" }}
    >
      {/* Match Score Badge */}
      <div className="relative">
        <div
          className="absolute top-4 right-4 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-sm"
          style={{ background: "rgba(22,163,74,0.95)" }}
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span className="text-white text-xs font-bold">
            {therapist.match}% Match
          </span>
        </div>
      </div>

      {/* Header */}
      <div
        className="p-6 pb-5"
        style={{
          background: `${therapist.approaches.includes("holistic") ? P.teal : P.lavender}15`,
        }}
      >
        <div className="flex items-start gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shrink-0"
            style={{ background: "white" }}
          >
            {therapist.photo}
          </div>
          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-lg mb-0.5"
              style={{ color: P.charcoal }}
            >
              {therapist.name}
            </h3>
            <p className="text-xs mb-2" style={{ color: P.sage }}>
              {therapist.credentials} • {therapist.years} years experience
            </p>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center gap-1">
                <Star
                  className="w-3.5 h-3.5 fill-current"
                  style={{ color: "#fbbf24" }}
                />
                <span className="font-bold" style={{ color: P.charcoal }}>
                  {therapist.rating}
                </span>
                <span style={{ color: P.sage }}>({therapist.reviews})</span>
              </div>
              <span style={{ color: P.sage }}>•</span>
              <div
                className="flex items-center gap-1"
                style={{ color: P.green }}
              >
                <Award className="w-3.5 h-3.5" />
                <span className="font-semibold">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 pt-5">
        {/* Bio */}
        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "#6b7b6a" }}
        >
          {therapist.bio}
        </p>

        {/* Specialties */}
        <div className="mb-4">
          <p
            className="text-xs font-bold uppercase tracking-wide mb-2"
            style={{ color: P.sage }}
          >
            Specialties
          </p>
          <div className="flex flex-wrap gap-1.5">
            {therapist.specialties.map((spec) => (
              <span
                key={spec}
                className="px-2.5 py-1 rounded-full text-xs font-medium"
                style={{ background: `${P.teal}15`, color: P.teal }}
              >
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Meta Grid */}
        <div className="grid grid-cols-2 gap-3 mb-5 text-xs">
          <div className="flex items-center gap-2" style={{ color: P.sage }}>
            <Languages className="w-3.5 h-3.5" />
            <span>{therapist.languages.join(", ")}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: P.sage }}>
            <Clock className="w-3.5 h-3.5" />
            <span>{therapist.availability}</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: P.sage }}>
            <DollarSign className="w-3.5 h-3.5" />
            <span>{therapist.rate}/session</span>
          </div>
          <div
            className="flex items-center gap-2"
            style={{ color: therapist.insurance ? P.green : P.sage }}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>
              {therapist.insurance ? "Insurance accepted" : "Private pay"}
            </span>
          </div>
        </div>

        {/* Formats */}
        <div className="flex gap-2 mb-5">
          {therapist.formats.map((format) => (
            <div
              key={format}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium"
              style={{ background: "#f5f3ee", color: P.charcoal }}
            >
              {format === "Video" && <Video className="w-3 h-3" />}
              {format === "Messaging" && <MessageSquare className="w-3 h-3" />}
              {format === "Phone" && <Calendar className="w-3 h-3" />}
              {format}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onSelect(therapist)}
          className="w-full py-3.5 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${P.green}, ${P.teal})`,
          }}
        >
          Schedule Free Consultation
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function TherapistFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(null);

  const step = QUIZ_STEPS[currentStep];
  const StepIcon = step.icon;

  const setAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMultiSelect = (key, optionId) => {
    const current = answers[key] || [];
    const updated = current.includes(optionId)
      ? current.filter((id) => id !== optionId)
      : [...current, optionId];
    setAnswer(key, updated);
  };

  const canProceed = () => {
    if (step.type === "multi-select") {
      const selected = answers[step.id] || [];
      return selected.length > 0;
    }
    if (step.type === "single-select") {
      return !!answers[step.id];
    }
    // Logistics and budget are optional
    return true;
  };

  const handleNext = () => {
    if (currentStep === QUIZ_STEPS.length - 1) {
      setShowResults(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSelectTherapist = (therapist) => {
    setSelectedTherapist(therapist);
    // In production: navigate to booking or save to state
    alert(`Great choice! Scheduling consultation with ${therapist.name}...`);
  };

  // Simple matching algorithm (in production, this would be server-side AI)
  const getMatchedTherapists = () => {
    return THERAPISTS.map((t) => {
      let score = 70; // base score

      // Match concerns
      const userConcerns = answers.concerns || [];
      const concernMatches = userConcerns.filter((c) =>
        t.concerns.includes(c),
      ).length;
      score += concernMatches * 5;

      // Match approach
      if (answers.approach && t.approaches.includes(answers.approach)) {
        score += 10;
      }

      // Demographics preferences
      if (answers.gender && answers.gender !== "No Preference") {
        if (t.gender === answers.gender) score += 5;
      }

      // Insurance
      if (answers.insurance?.includes("use insurance") && t.insurance) {
        score += 5;
      }

      return { ...t, match: Math.min(100, score) };
    }).sort((a, b) => b.match - a.match);
  };

  if (showResults) {
    const matches = getMatchedTherapists();

    return (
      <section
        className="py-20"
        style={{
          background: `linear-gradient(180deg, ${P.cream} 0%, #f0f7f0 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-4"
              style={{ background: `${P.green}20`, color: P.green }}
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                AI-Matched Results
              </span>
            </div>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ color: P.charcoal }}
            >
              Your Top {matches.length} Therapist Matches
            </h2>
            <p
              className="max-w-2xl mx-auto text-base mb-6"
              style={{ color: P.sage }}
            >
              Based on your preferences, we've matched you with these
              highly-rated holistic therapists. All offer free 15-minute
              consultations.
            </p>
            <button
              onClick={() => {
                setShowResults(false);
                setCurrentStep(0);
                setAnswers({});
              }}
              className="text-sm font-semibold flex items-center gap-2 mx-auto hover:opacity-70 transition-opacity"
              style={{ color: P.teal }}
            >
              <ArrowLeft className="w-4 h-4" />
              Start Over
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.slice(0, 6).map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onSelect={handleSelectTherapist}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <div
              className="inline-block rounded-3xl p-8 max-w-2xl"
              style={{
                background: "white",
                border: `1.5px solid #f0ede8`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}
            >
              <p
                className="text-lg font-bold mb-2"
                style={{ color: P.charcoal }}
              >
                Not seeing the perfect fit?
              </p>
              <p className="text-sm mb-5" style={{ color: P.sage }}>
                Our team can personally match you with a therapist from our
                extended network of 200+ providers.
              </p>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all"
                style={{
                  background: `linear-gradient(135deg, ${P.teal}, ${P.green})`,
                }}
              >
                Get Personalized Matching
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="py-20"
      style={{
        background: `linear-gradient(180deg, ${P.cream} 0%, white 100%)`,
      }}
      id="therapist-finder"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: `${P.green}15`, color: P.green }}
          >
            <Sparkles className="w-3.5 h-3.5 inline mr-1" />
            AI-Powered Matching
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4"
            style={{ color: P.charcoal }}
          >
            Find Your Perfect Therapist
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: P.sage }}>
            Answer a few questions and we'll match you with therapists who align
            with your needs, values, and preferences.
          </p>
        </div>

        {/* Quiz Card */}
        <div
          className="rounded-3xl p-8 sm:p-10 shadow-lg"
          style={{ background: "white", border: "1.5px solid #f0ede8" }}
        >
          <ProgressBar
            currentStep={currentStep}
            totalSteps={QUIZ_STEPS.length}
          />

          {/* Step Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: `${step.color}20` }}
            >
              <StepIcon className="w-7 h-7" style={{ color: step.color }} />
            </div>
            <div>
              <h3
                className="text-xl font-bold mb-1"
                style={{ color: P.charcoal }}
              >
                {step.title}
              </h3>
              <p className="text-sm" style={{ color: P.sage }}>
                {step.subtitle}
              </p>
            </div>
          </div>

          {/* Step Content */}
          <div className="mb-8">
            {/* Multi-Select */}
            {step.type === "multi-select" && (
              <div className="space-y-3">
                {step.options.map((option) => (
                  <MultiSelectOption
                    key={option.id}
                    option={option}
                    selected={(answers[step.id] || []).includes(option.id)}
                    onToggle={() => toggleMultiSelect(step.id, option.id)}
                  />
                ))}
              </div>
            )}

            {/* Single-Select */}
            {step.type === "single-select" && (
              <div className="space-y-3">
                {step.options.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setAnswer(step.id, option.id)}
                    className="w-full flex items-start justify-between gap-3 px-5 py-4 rounded-2xl border-2 text-left transition-all hover:shadow-md"
                    style={{
                      borderColor:
                        answers[step.id] === option.id ? P.green : "#e0ddd6",
                      background:
                        answers[step.id] === option.id
                          ? `${P.green}10`
                          : "white",
                    }}
                  >
                    <div>
                      <div
                        className="font-semibold text-sm mb-1"
                        style={{ color: P.charcoal }}
                      >
                        {option.label}
                      </div>
                      <div className="text-xs" style={{ color: P.sage }}>
                        {option.desc}
                      </div>
                    </div>
                    {answers[step.id] === option.id && (
                      <CheckCircle2
                        className="w-5 h-5 shrink-0 mt-0.5"
                        style={{ color: P.green }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Preferences / Logistics / Budget */}
            {(step.type === "preferences" ||
              step.type === "logistics" ||
              step.type === "budget") && (
              <div className="space-y-5">
                {step.fields.map((field) => (
                  <div key={field.id}>
                    <label
                      className="block text-xs font-bold uppercase tracking-wide mb-2"
                      style={{ color: P.charcoal }}
                    >
                      {field.label}
                    </label>
                    {field.type === "select" && (
                      <select
                        value={answers[field.id] || field.options[0]}
                        onChange={(e) => setAnswer(field.id, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border-2 text-sm outline-none transition-all"
                        style={{ borderColor: "#e0ddd6", color: P.charcoal }}
                      >
                        {field.options.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    )}
                    {field.type === "multi-select" && (
                      <div className="flex flex-wrap gap-2">
                        {field.options.map((opt) => {
                          const selected = (answers[field.id] || []).includes(
                            opt,
                          );
                          return (
                            <button
                              key={opt}
                              onClick={() => toggleMultiSelect(field.id, opt)}
                              className="px-4 py-2 rounded-xl border-2 text-xs font-semibold transition-all"
                              style={{
                                borderColor: selected ? P.green : "#e0ddd6",
                                background: selected ? `${P.green}15` : "white",
                                color: selected ? P.green : P.charcoal,
                              }}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3">
            {currentStep > 0 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-2xl border-2 font-semibold text-sm transition-all hover:shadow-md flex items-center gap-2"
                style={{ borderColor: "#e0ddd6", color: P.sage }}
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 py-3 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              style={{
                background: `linear-gradient(135deg, ${P.green}, ${P.teal})`,
              }}
            >
              {currentStep === QUIZ_STEPS.length - 1
                ? "Show My Matches"
                : "Continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Trust Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs" style={{ color: "#c4bdb3" }}>
            🔒 Your responses are confidential and used only for matching • Free
            15-min consultation with all matches
          </p>
        </div>
      </div>
    </section>
  );
}
