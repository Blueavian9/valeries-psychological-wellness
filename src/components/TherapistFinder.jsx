import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Heart,
  Brain,
  Users,
  DollarSign,
  Video,
  Phone,
  MessageCircle,
  MapPin,
  Star,
  Calendar,
  Sparkles,
  CheckCircle,
} from "lucide-react";

// Color palette
const P = {
  teal: "#3a6d77",
  sage: "#a8b5a2",
  green: "#16a34a",
  lavender: "#c4b5e2",
  charcoal: "#333645",
  cream: "#fdfcf7",
};

// Quiz steps data
const QUIZ_STEPS = [
  {
    id: "concerns",
    title: "What brings you to therapy?",
    subtitle: "Select all that resonate with you",
    multiSelect: true,
    options: [
      {
        id: "anxiety",
        label: "Anxiety & Stress",
        emoji: "😰",
        color: "#3a6d77",
      },
      { id: "depression", label: "Depression", emoji: "🌧️", color: "#7c5cbf" },
      { id: "trauma", label: "Trauma / PTSD", emoji: "💔", color: "#dc2626" },
      {
        id: "relationships",
        label: "Relationships",
        emoji: "💑",
        color: "#c4b5e2",
      },
      {
        id: "transitions",
        label: "Life Transitions",
        emoji: "🔄",
        color: "#b8a88f",
      },
      {
        id: "identity",
        label: "Identity & Self-Exploration",
        emoji: "🪞",
        color: "#16a34a",
      },
      { id: "grief", label: "Grief & Loss", emoji: "🕊️", color: "#6b7280" },
      { id: "other", label: "Something Else", emoji: "✨", color: "#a8b5a2" },
    ],
  },
  {
    id: "approach",
    title: "What therapeutic approach interests you?",
    subtitle: "Choose your preferred style",
    multiSelect: false,
    options: [
      {
        id: "traditional",
        label: "Traditional Talk Therapy",
        desc: "CBT, DBT, psychodynamic approaches",
        icon: Brain,
      },
      {
        id: "holistic",
        label: "Holistic / Integrative",
        desc: "Mind-body-spirit connection, somatic practices",
        icon: Heart,
      },
      {
        id: "mindbody",
        label: "Mind-Body Practices",
        desc: "Yoga therapy, breathwork, somatic experiencing",
        icon: Sparkles,
      },
      {
        id: "spiritual",
        label: "Spiritual Counseling",
        desc: "Meaning-making, existential exploration",
        icon: Users,
      },
    ],
  },
  {
    id: "sessionType",
    title: "What session format works best for you?",
    subtitle: "Select all that you are open to",
    multiSelect: true,
    options: [
      {
        id: "video",
        label: "Video Sessions",
        desc: "Live face-to-face over video",
        icon: Video,
      },
      {
        id: "phone",
        label: "Phone Sessions",
        desc: "Audio-only calls",
        icon: Phone,
      },
      {
        id: "chat",
        label: "Text / Messaging",
        desc: "Asynchronous written therapy",
        icon: MessageCircle,
      },
      {
        id: "inperson",
        label: "In-Person (if available)",
        desc: "Traditional office visits",
        icon: MapPin,
      },
    ],
  },
  {
    id: "budget",
    title: "What is your budget range per session?",
    subtitle: "Select the range that fits your situation",
    multiSelect: false,
    options: [
      {
        id: "low",
        label: "$0 – $50",
        desc: "Looking for affordable or sliding scale options",
        icon: DollarSign,
      },
      {
        id: "mid",
        label: "$50 – $100",
        desc: "Standard therapy session rates",
        icon: DollarSign,
      },
      {
        id: "high",
        label: "$100 – $150",
        desc: "Premium services",
        icon: DollarSign,
      },
      {
        id: "premium",
        label: "$150+",
        desc: "Specialized or high-touch care",
        icon: DollarSign,
      },
    ],
  },
  {
    id: "preferences",
    title: "Any special preferences?",
    subtitle: "Optional — helps us find your perfect match",
    multiSelect: true,
    options: [
      { id: "lgbtq", label: "LGBTQ+ Friendly", emoji: "🏳️‍🌈" },
      { id: "poc", label: "Therapist of Color", emoji: "✊🏽" },
      { id: "female", label: "Female Therapist", emoji: "♀️" },
      { id: "male", label: "Male Therapist", emoji: "♂️" },
      { id: "bilingual", label: "Bilingual (Spanish)", emoji: "🌍" },
      { id: "religious", label: "Faith-Based Approach", emoji: "🙏" },
    ],
  },
];

// Mock therapist data
const THERAPISTS = [
  {
    id: "t1",
    name: "Dr. Maya Rodriguez",
    credentials: "PhD, LMFT",
    specialty: "Holistic Trauma Therapy",
    photo: "MR",
    rating: 4.9,
    reviews: 127,
    price: 120,
    sessionTypes: ["video", "phone"],
    approaches: ["holistic", "mindbody"],
    concerns: ["trauma", "anxiety", "depression"],
    preferences: ["lgbtq", "poc", "female", "bilingual"],
    bio: "I blend EMDR with somatic experiencing and nervous system regulation to help clients heal from trauma at the body level.",
    nextAvailable: "Tomorrow, 2pm",
    tags: ["Trauma-Informed", "Somatic", "EMDR Certified"],
    color: "#3a6d77",
  },
  {
    id: "t2",
    name: "James Chen",
    credentials: "LCSW",
    specialty: "Mindfulness & CBT",
    photo: "JC",
    rating: 4.8,
    reviews: 94,
    price: 90,
    sessionTypes: ["video", "chat"],
    approaches: ["traditional", "mindbody"],
    concerns: ["anxiety", "depression", "transitions"],
    preferences: ["lgbtq", "male"],
    bio: "I combine evidence-based CBT with mindfulness practices to help you build practical tools for lasting change.",
    nextAvailable: "Friday, 10am",
    tags: ["CBT", "Mindfulness", "Work Stress"],
    color: "#16a34a",
  },
  {
    id: "t3",
    name: "Priya Sharma",
    credentials: "PsyD",
    specialty: "Integrative Wellness",
    photo: "PS",
    rating: 5.0,
    reviews: 156,
    price: 140,
    sessionTypes: ["video", "phone", "inperson"],
    approaches: ["holistic", "spiritual"],
    concerns: ["identity", "relationships", "transitions"],
    preferences: ["lgbtq", "poc", "female", "religious"],
    bio: "My approach honors the whole person — integrating psychology, yoga philosophy, and spiritual exploration for deep healing.",
    nextAvailable: "Today, 4pm",
    tags: ["Yoga Therapy", "Spiritual", "South Asian"],
    color: "#c4b5e2",
  },
  {
    id: "t4",
    name: "Dr. Michael Torres",
    credentials: "PhD, LP",
    specialty: "Couples & Relationships",
    photo: "MT",
    rating: 4.7,
    reviews: 88,
    price: 160,
    sessionTypes: ["video", "inperson"],
    approaches: ["traditional"],
    concerns: ["relationships", "anxiety"],
    preferences: ["lgbtq", "male", "bilingual"],
    bio: "Gottman-trained couples therapist specializing in communication, attachment, and rebuilding trust after betrayal.",
    nextAvailable: "Mon, 6pm",
    tags: ["Gottman Method", "Couples", "Attachment"],
    color: "#b8a88f",
  },
  {
    id: "t5",
    name: "Sarah Kim",
    credentials: "LMHC",
    specialty: "Anxiety & Depression",
    photo: "SK",
    rating: 4.9,
    reviews: 112,
    price: 85,
    sessionTypes: ["video", "phone", "chat"],
    approaches: ["traditional", "mindbody"],
    concerns: ["anxiety", "depression", "other"],
    preferences: ["lgbtq", "female", "poc"],
    bio: "I use a warm, collaborative approach combining CBT, ACT, and breathwork to help you reclaim peace and confidence.",
    nextAvailable: "Wed, 11am",
    tags: ["ACT", "Anxiety Specialist", "Affordable"],
    color: "#7c5cbf",
  },
  {
    id: "t6",
    name: "David Okonkwo",
    credentials: "MSW, LICSW",
    specialty: "Grief & Life Transitions",
    photo: "DO",
    rating: 4.8,
    reviews: 67,
    price: 95,
    sessionTypes: ["video", "phone"],
    approaches: ["holistic", "spiritual"],
    concerns: ["grief", "transitions", "identity"],
    preferences: ["lgbtq", "male", "poc", "religious"],
    bio: "I help clients navigate loss and life changes with compassion, cultural sensitivity, and a blend of narrative and existential therapy.",
    nextAvailable: "Thu, 3pm",
    tags: ["Grief Specialist", "Cultural Humility", "Narrative Therapy"],
    color: "#6b7280",
  },
];

// Quiz Option Card
function QuizOption({ option, selected, onToggle }) {
  const Icon = option.icon;
  const hasIcon = !!Icon;
  const hasEmoji = !!option.emoji;

  return (
    <button
      onClick={onToggle}
      className="group relative rounded-2xl p-5 text-left transition-all duration-200 hover:scale-[1.02] hover:shadow-lg"
      style={{
        border: `2px solid ${selected ? option.color || P.green : "#e8e4dd"}`,
        background: selected ? `${option.color || P.green}08` : "white",
        boxShadow: selected
          ? `0 4px 20px ${option.color || P.green}25`
          : "0 2px 8px rgba(0,0,0,0.04)",
      }}
    >
      {selected && (
        <div
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md"
          style={{ background: option.color || P.green }}
        >
          <Check className="w-3.5 h-3.5 text-white" />
        </div>
      )}

      <div className="flex items-start gap-3">
        {hasIcon ? (
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${option.color || P.sage}20` }}
          >
            <Icon
              className="w-5 h-5"
              style={{ color: option.color || P.sage }}
            />
          </div>
        ) : hasEmoji ? (
          <span className="text-2xl shrink-0">{option.emoji}</span>
        ) : null}

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm mb-0.5" style={{ color: P.charcoal }}>
            {option.label}
          </p>
          {option.desc && (
            <p className="text-xs leading-relaxed" style={{ color: P.sage }}>
              {option.desc}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

// Therapist Result Card
function TherapistCard({ therapist }) {
  return (
    <div
      className="group rounded-3xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "white",
        border: "1.5px solid #f0ede8",
        boxShadow: "0 2px 12px rgba(51,54,69,0.06)",
      }}
    >
      <div className="h-1.5" style={{ background: therapist.color }} />

      <div className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-xl text-white shrink-0"
            style={{
              background: `linear-gradient(135deg, ${therapist.color}, ${therapist.color}cc)`,
            }}
          >
            {therapist.photo}
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-bold text-base mb-0.5 leading-snug"
              style={{ color: P.charcoal }}
            >
              {therapist.name}
            </h3>
            <p className="text-xs mb-2" style={{ color: P.sage }}>
              {therapist.credentials} · {therapist.specialty}
            </p>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span
                  className="text-xs font-bold"
                  style={{ color: P.charcoal }}
                >
                  {therapist.rating}
                </span>
              </div>
              <span className="text-xs" style={{ color: P.sage }}>
                ({therapist.reviews} reviews)
              </span>
              {therapist.rating >= 4.9 && (
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: "#fef3c7", color: "#b45309" }}
                >
                  Top Rated
                </span>
              )}
            </div>
          </div>
        </div>

        <p
          className="text-sm leading-relaxed mb-4"
          style={{ color: "#6b7b6a" }}
        >
          {therapist.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {therapist.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${therapist.color}15`,
                color: therapist.color,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between mb-5 text-xs"
          style={{ color: P.sage }}
        >
          <span className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5" />${therapist.price}/session
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {therapist.nextAvailable}
          </span>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/book?therapist=${therapist.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-bold text-xs text-white transition-all hover:shadow-md hover:opacity-90"
            style={{
              background: `linear-gradient(135deg, ${therapist.color}, ${therapist.color}cc)`,
            }}
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Session
          </Link>
          <button
            className="px-4 py-2.5 rounded-xl font-semibold text-xs border-2 transition-all hover:shadow-sm"
            style={{
              borderColor: `${therapist.color}40`,
              color: therapist.color,
              background: `${therapist.color}08`,
            }}
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function TherapistFinder() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  const step = QUIZ_STEPS[currentStep];
  const totalSteps = QUIZ_STEPS.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleSelect = (stepId, optionId) => {
    if (step.multiSelect) {
      const current = answers[stepId] || [];
      const newValue = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers((a) => ({ ...a, [stepId]: newValue }));
    } else {
      setAnswers((a) => ({ ...a, [stepId]: optionId }));
    }
  };

  const canProceed = () => {
    const ans = answers[step.id];
    if (step.id === "preferences") return true;
    return step.multiSelect ? ans?.length > 0 : !!ans;
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep((s) => s - 1);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResults(false);
  };

  const matchedTherapists = showResults
    ? THERAPISTS.map((t) => {
        let score = 0;
        const concernsMatch = (answers.concerns || []).some((c) =>
          t.concerns.includes(c),
        );
        const approachMatch = t.approaches.includes(answers.approach);
        const sessionMatch = (answers.sessionType || []).some((s) =>
          t.sessionTypes.includes(s),
        );
        const budgetFits = (() => {
          if (answers.budget === "low") return t.price <= 50;
          if (answers.budget === "mid") return t.price > 50 && t.price <= 100;
          if (answers.budget === "high") return t.price > 100 && t.price <= 150;
          if (answers.budget === "premium") return t.price > 150;
          return true;
        })();
        const prefsMatch = (answers.preferences || []).every((p) =>
          t.preferences.includes(p),
        );

        if (concernsMatch) score += 3;
        if (approachMatch) score += 2;
        if (sessionMatch) score += 1;
        if (budgetFits) score += 1;
        if (prefsMatch) score += 2;

        return { ...t, score };
      })
        .filter((t) => t.score >= 3)
        .sort((a, b) => b.score - a.score)
    : [];

  if (showResults) {
    return (
      <div
        className="min-h-screen py-16"
        style={{
          background: "linear-gradient(180deg, #f0f7f0 0%, #fdfcf7 100%)",
        }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-5"
              style={{ background: "#f0fdf4", border: "1.5px solid #d1fae5" }}
            >
              <CheckCircle className="w-4 h-4" style={{ color: P.green }} />
              <span className="text-sm font-bold" style={{ color: P.green }}>
                Quiz Complete
              </span>
            </div>

            <h1
              className="text-3xl sm:text-4xl font-extrabold mb-4"
              style={{ color: P.charcoal }}
            >
              We found {matchedTherapists.length} great matches for you 🌿
            </h1>
            <p
              className="max-w-xl mx-auto text-base mb-6"
              style={{ color: P.sage }}
            >
              Based on your preferences, here are therapists who align with your
              needs and goals. All are licensed, vetted, and ready to support
              your journey.
            </p>

            <button
              onClick={handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border-2 font-semibold text-sm transition-all hover:shadow-md"
              style={{ borderColor: "#e8e4dd", color: P.charcoal }}
            >
              <ArrowLeft className="w-4 h-4" />
              Retake Quiz
            </button>
          </div>

          {matchedTherapists.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm" style={{ color: P.sage }}>
                No exact matches found. Try adjusting your preferences or{" "}
                <button
                  onClick={handleReset}
                  className="underline font-semibold"
                  style={{ color: P.green }}
                >
                  retake the quiz
                </button>
                .
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {matchedTherapists.map((t) => (
                <TherapistCard key={t.id} therapist={t} />
              ))}
            </div>
          )}

          <div className="mt-16 rounded-3xl overflow-hidden">
            <div
              className="px-8 py-10 text-center"
              style={{
                background: `linear-gradient(135deg, ${P.teal}, ${P.green})`,
              }}
            >
              <h3 className="text-white font-bold text-xl mb-2">
                Not sure which therapist is right?
              </h3>
              <p
                className="text-sm mb-6"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                Our intake coordinators can help you choose based on a brief
                phone call.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-xl hover:scale-105"
                style={{ background: "white", color: P.teal }}
              >
                Talk to a Coordinator
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen py-16"
      style={{
        background: "linear-gradient(180deg, #fdfcf7 0%, #f0f7f0 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {currentStep > 0 && (
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 mb-8 text-sm font-semibold transition-colors hover:opacity-70"
            style={{ color: P.sage }}
          >
            <ArrowLeft className="w-4 h-4" />
            Previous Question
          </button>
        )}

        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: P.sage }}
            >
              Question {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-xs font-bold" style={{ color: P.green }}>
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div
            className="h-2 rounded-full overflow-hidden"
            style={{ background: "#e8e4dd" }}
          >
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${progress}%`,
                background: `linear-gradient(90deg, ${P.teal}, ${P.green})`,
              }}
            />
          </div>
        </div>

        <div
          className="rounded-3xl p-8 sm:p-10 mb-8"
          style={{
            background: "white",
            border: "1.5px solid #f0ede8",
            boxShadow: "0 4px 24px rgba(51,54,69,0.08)",
          }}
        >
          <div className="mb-8 text-center">
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-3 leading-snug"
              style={{ color: P.charcoal }}
            >
              {step.title}
            </h2>
            <p className="text-sm" style={{ color: P.sage }}>
              {step.subtitle}
            </p>
          </div>

          <div
            className={`grid gap-3 ${step.options.length > 4 ? "sm:grid-cols-2" : "grid-cols-1"}`}
          >
            {step.options.map((option) => {
              const isSelected = step.multiSelect
                ? (answers[step.id] || []).includes(option.id)
                : answers[step.id] === option.id;

              return (
                <QuizOption
                  key={option.id}
                  option={option}
                  selected={isSelected}
                  onToggle={() => handleSelect(step.id, option.id)}
                />
              );
            })}
          </div>

          {step.multiSelect && (
            <p
              className="text-center text-xs mt-5"
              style={{ color: "#c4bdb3" }}
            >
              💡 Select as many as apply — this helps us find your best match
            </p>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed()}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white shadow-md hover:shadow-lg hover:scale-[1.01] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style={{
            background: `linear-gradient(135deg, ${P.green}, ${P.teal})`,
          }}
        >
          {currentStep === totalSteps - 1 ? "See My Matches" : "Continue"}
          <ArrowRight className="w-4 h-4" />
        </button>

        <p className="text-center text-xs mt-6" style={{ color: "#c4bdb3" }}>
          🔒 Your responses are private and only used to match you with the
          right therapist
        </p>
      </div>
    </div>
  );
}
