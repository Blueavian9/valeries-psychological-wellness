import { useState } from "react";
import {
  Wind,
  Flower2,
  Apple,
  Moon,
  Zap,
  Download,
  ExternalLink,
  Clock,
  BookOpen,
  Play,
  FileText,
  CheckSquare,
  X,
  ArrowRight,
  Sparkles,
} from "lucide-react";

// ─── Design tokens (matching site palette) ───────────────────────────────────
const P = {
  cream: "#fdfcf7",
  sage: "#a8b5a2",
  teal: "#3a6d77",
  lavender: "#c4b5e2",
  taupe: "#b8a88f",
  charcoal: "#333645",
  green: "#16a34a",
};

// ─── Category definitions ─────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Resources", emoji: "✨", color: P.teal },
  {
    id: "meditation",
    label: "Meditation",
    emoji: "🧘",
    color: "#3a6d77",
    icon: Wind,
  },
  { id: "yoga", label: "Yoga", emoji: "🌸", color: "#a8b5a2", icon: Flower2 },
  {
    id: "nutrition",
    label: "Nutrition",
    emoji: "🥗",
    color: "#16a34a",
    icon: Apple,
  },
  { id: "sleep", label: "Sleep", emoji: "🌙", color: "#7c5cbf", icon: Moon },
  {
    id: "stress",
    label: "Stress Relief",
    emoji: "⚡",
    color: "#b8a88f",
    icon: Zap,
  },
];

// ─── Resource content ─────────────────────────────────────────────────────────
const RESOURCES = [
  // ── Meditation ──────────────────────────────────────────────────────────────
  {
    id: "r1",
    category: "meditation",
    type: "audio", // audio | guide | checklist | video
    title: "5-Minute Breathing Reset",
    description:
      "A quick box-breathing exercise to calm your nervous system anywhere, anytime. Ideal before stressful meetings or anxious moments.",
    duration: "5 min",
    level: "Beginner",
    color: "#3a6d77",
    tags: ["Anxiety", "Quick Relief", "Nervous System"],
    preview: [
      "Inhale for 4 counts — feel your belly expand",
      "Hold for 4 counts — let stillness settle in",
      "Exhale for 4 counts — release all tension",
      "Hold for 4 counts — rest in the pause",
      "Repeat 4–6 cycles for full reset effect",
    ],
    actionLabel: "Start Exercise",
    downloadLabel: null,
  },
  {
    id: "r2",
    category: "meditation",
    type: "guide",
    title: "Body Scan Meditation Guide",
    description:
      "A 20-minute guided body scan to release stored tension and reconnect with physical sensations. Deeply restorative for trauma and stress.",
    duration: "20 min",
    level: "All Levels",
    color: "#3a6d77",
    tags: ["Somatic", "Trauma", "Deep Relaxation"],
    preview: [
      "Lie down comfortably — close your eyes",
      "Begin at the crown of your head, move slowly downward",
      "Notice sensation without judgment — tension, warmth, numbness",
      "Breathe into each area before moving on",
      "End with a full-body awareness hold for 2 minutes",
    ],
    actionLabel: "Read Guide",
    downloadLabel: "Download PDF",
  },
  {
    id: "r3",
    category: "meditation",
    type: "guide",
    title: "Loving-Kindness Meditation",
    description:
      "Cultivate compassion for yourself and others with this classic Metta meditation practice. Shown to reduce depression and increase social connection.",
    duration: "15 min",
    level: "Intermediate",
    color: "#3a6d77",
    tags: ["Self-Compassion", "Depression", "Connection"],
    preview: [
      '"May I be happy. May I be healthy. May I be at peace."',
      "Extend this wish outward — to loved ones, neutral people, difficult people",
      "Finally extend to all beings everywhere",
      "Practice daily for 21 days for measurable mood shift",
    ],
    actionLabel: "Start Practice",
    downloadLabel: "Download PDF",
  },

  // ── Yoga ────────────────────────────────────────────────────────────────────
  {
    id: "r4",
    category: "yoga",
    type: "guide",
    title: "Morning Energizing Flow",
    description:
      "A 15-minute Sun Salutation sequence to awaken your body and set a positive intention for the day. No equipment needed.",
    duration: "15 min",
    level: "Beginner",
    color: "#a8b5a2",
    tags: ["Morning Routine", "Energy", "Sun Salutation"],
    preview: [
      "Mountain Pose → Forward Fold → Halfway Lift",
      "Plank → Low Cobra → Downward Dog",
      "Warrior I → Warrior II → Triangle Pose",
      "Finish with Child's Pose (2 minutes)",
      "Set intention: one word to carry through your day",
    ],
    actionLabel: "View Sequence",
    downloadLabel: "Download PDF",
  },
  {
    id: "r5",
    category: "yoga",
    type: "guide",
    title: "Evening Relaxation Sequence",
    description:
      "Gentle yin yoga poses held for 3–5 minutes each to decompress the spine, release hip tension, and prepare the body for deep sleep.",
    duration: "30 min",
    level: "All Levels",
    color: "#a8b5a2",
    tags: ["Sleep", "Yin Yoga", "Evening Routine"],
    preview: [
      "Supported Child's Pose — 3 min",
      "Reclined Butterfly — 4 min",
      "Legs Up the Wall — 5 min (nervous system reset)",
      "Supine Twist (both sides) — 3 min each",
      "Savasana with 4-7-8 breathing — 5 min",
    ],
    actionLabel: "View Sequence",
    downloadLabel: "Download PDF",
  },
  {
    id: "r6",
    category: "yoga",
    type: "guide",
    title: "Stress-Relief Poses",
    description:
      "Five key poses specifically chosen for their evidence-based stress-reduction effects on the vagus nerve and HPA axis.",
    duration: "10 min",
    level: "Beginner",
    color: "#a8b5a2",
    tags: ["Stress", "Vagus Nerve", "Quick Practice"],
    preview: [
      "Standing Forward Fold — activates parasympathetic response",
      "Cat-Cow — regulates breath and spinal mobility",
      "Seated Twist — massages digestive organs, reduces cortisol",
      "Bridge Pose — opens chest, counters desk posture",
      "Viparita Karani (Legs Up Wall) — lowers heart rate rapidly",
    ],
    actionLabel: "View Poses",
    downloadLabel: "Download PDF",
  },

  // ── Nutrition ────────────────────────────────────────────────────────────────
  {
    id: "r7",
    category: "nutrition",
    type: "guide",
    title: "Mood-Boosting Foods Guide",
    description:
      "Evidence-based nutrition guide covering the gut-brain axis, anti-inflammatory foods, and how specific nutrients directly affect serotonin and dopamine.",
    duration: "10 min read",
    level: "All Levels",
    color: "#16a34a",
    tags: ["Depression", "Gut-Brain", "Anti-inflammatory"],
    preview: [
      "Omega-3s (salmon, walnuts, flaxseed) → reduce neuroinflammation",
      "Fermented foods (kefir, kimchi) → support gut microbiome → mood",
      "Dark leafy greens → magnesium → anxiety reduction",
      "Dark chocolate (70%+) → phenylethylamine → natural mood lift",
      "Avoid: refined sugar, ultra-processed foods, alcohol (depressants)",
    ],
    actionLabel: "Read Guide",
    downloadLabel: "Download PDF",
  },
  {
    id: "r8",
    category: "nutrition",
    type: "checklist",
    title: "Weekly Wellness Meal Planner",
    description:
      "A printable 7-day meal planning template with a focus on brain-supportive foods, prep tips, and a grocery checklist.",
    duration: "Printable",
    level: "Practical Tool",
    color: "#16a34a",
    tags: ["Meal Prep", "Weekly Routine", "Practical"],
    preview: [
      "Mon: Overnight oats + walnuts + berries",
      "Wed: Salmon bowl with leafy greens + avocado",
      "Fri: Lentil soup + fermented vegetable side",
      "Weekend: Batch-cook grains and roast veggies",
      "Grocery list included for all 7 days",
    ],
    actionLabel: "View Planner",
    downloadLabel: "Download PDF",
  },

  // ── Sleep ────────────────────────────────────────────────────────────────────
  {
    id: "r9",
    category: "sleep",
    type: "checklist",
    title: "Sleep Hygiene Checklist",
    description:
      "A comprehensive 20-point evidence-based checklist to audit and improve your sleep environment, habits, and pre-bed routine.",
    duration: "Printable",
    level: "All Levels",
    color: "#7c5cbf",
    tags: ["Insomnia", "Sleep Quality", "Routine"],
    preview: [
      "✓ Keep a consistent wake time — even weekends",
      "✓ No screens 60 min before bed (blue light blocks melatonin)",
      "✓ Room temperature: 65–68°F (18–20°C) is optimal",
      "✓ Avoid caffeine after 2pm (half-life is 5–7 hours)",
      "✓ Use bed only for sleep and intimacy — no working in bed",
    ],
    actionLabel: "View Checklist",
    downloadLabel: "Download PDF",
  },
  {
    id: "r10",
    category: "sleep",
    type: "audio",
    title: "Progressive Muscle Relaxation",
    description:
      "Systematically tense and release each muscle group to achieve deep physical relaxation. Clinically shown to improve sleep onset by 30%.",
    duration: "12 min",
    level: "Beginner",
    color: "#7c5cbf",
    tags: ["Insomnia", "Anxiety", "Body-Based"],
    preview: [
      "Start with feet — tense tightly for 5 seconds, release",
      "Move up: calves → thighs → abdomen → chest",
      "Continue: hands → arms → shoulders → face",
      "Full release — feel the contrast between tension and ease",
      "Pairs well with 4-7-8 breathing for fastest results",
    ],
    actionLabel: "Start Exercise",
    downloadLabel: null,
  },

  // ── Stress ───────────────────────────────────────────────────────────────────
  {
    id: "r11",
    category: "stress",
    type: "checklist",
    title: "Mood Tracker Journal",
    description:
      "A structured daily journal template for tracking mood patterns, triggers, and energy levels. Includes weekly reflection prompts.",
    duration: "Daily Tool",
    level: "Practical Tool",
    color: "#b8a88f",
    tags: ["Self-Awareness", "Journaling", "Daily Practice"],
    preview: [
      "Morning: Rate mood 1–10 + one word to describe it",
      "Midday: Note any stress triggers encountered",
      "Evening: Three things that went well today",
      "Weekly: What patterns do you notice?",
      "Monthly: How have your baselines shifted?",
    ],
    actionLabel: "View Template",
    downloadLabel: "Download PDF",
  },
  {
    id: "r12",
    category: "stress",
    type: "guide",
    title: "Gratitude Practice Guide",
    description:
      "Research-backed gratitude journaling system shown to increase wellbeing by 25% in 6 weeks. Includes prompts, pitfalls, and how to make it stick.",
    duration: "5 min/day",
    level: "Beginner",
    color: "#b8a88f",
    tags: ["Positive Psychology", "Resilience", "Daily Habit"],
    preview: [
      "Write 3 specific things you're grateful for (not generic)",
      "Include WHY each one matters — depth over quantity",
      "Include one person who helped you this week",
      "Note one challenge you're grateful you navigated",
      "Review past entries monthly to see your growth",
    ],
    actionLabel: "Start Practice",
    downloadLabel: "Download PDF",
  },
  {
    id: "r13",
    category: "stress",
    type: "guide",
    title: "Building Resilience Guide",
    description:
      "A psychoeducation guide on the neuroscience of stress resilience, practical reframing techniques, and how to build your personal recovery toolkit.",
    duration: "15 min read",
    level: "Intermediate",
    color: "#b8a88f",
    tags: ["Resilience", "CBT Tools", "Psychoeducation"],
    preview: [
      "Understand your window of tolerance (Siegel, 1999)",
      "Identify your 3 primary stress responses (fight/flight/freeze)",
      "Build a personalized coping menu for each response",
      'Practice "stress inoculation" — small controlled exposures',
      "Track your bounce-back time over 30 days",
    ],
    actionLabel: "Read Guide",
    downloadLabel: "Download PDF",
  },
];

// ─── Type icon map ─────────────────────────────────────────────────────────────
const TYPE_ICON = {
  audio: Play,
  guide: BookOpen,
  checklist: CheckSquare,
  video: Play,
};
const TYPE_LABEL = {
  audio: "Audio Exercise",
  guide: "Written Guide",
  checklist: "Printable Checklist",
  video: "Video",
};

// ─── Resource Card ─────────────────────────────────────────────────────────────
function ResourceCard({ resource, onPreview }) {
  const TypeIcon = TYPE_ICON[resource.type] || BookOpen;
  const cat = CATEGORIES.find((c) => c.id === resource.category);

  return (
    <div
      className="group rounded-3xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "white",
        border: "1.5px solid #f0ede8",
        boxShadow: "0 2px 12px 0 rgba(51,54,69,0.04)",
      }}
    >
      {/* Color bar + category badge */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${resource.color}, ${resource.color}88)`,
        }}
      />

      <div className="p-6 flex flex-col flex-1">
        {/* Top row: category + type */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
            style={{ background: `${resource.color}18`, color: resource.color }}
          >
            {cat?.emoji} {cat?.label}
          </span>
          <span
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ background: "#f5f3ee", color: P.charcoal }}
          >
            <TypeIcon className="w-3 h-3" />
            {TYPE_LABEL[resource.type]}
          </span>
        </div>

        {/* Title */}
        <h3
          className="font-bold text-base mb-2 leading-snug"
          style={{ color: P.charcoal }}
        >
          {resource.title}
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed flex-1 mb-4"
          style={{ color: "#6b7b6a" }}
        >
          {resource.description}
        </p>

        {/* Meta row */}
        <div
          className="flex items-center gap-4 mb-5 text-xs"
          style={{ color: P.sage }}
        >
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {resource.duration}
          </span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ background: "#f5f3ee", color: P.charcoal }}
          >
            {resource.level}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {resource.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: `${resource.color}12`,
                color: resource.color,
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => onPreview(resource)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all hover:shadow-md"
            style={{
              background: `linear-gradient(135deg, ${resource.color}, ${resource.color}cc)`,
              color: "white",
            }}
          >
            <TypeIcon className="w-3.5 h-3.5" />
            {resource.actionLabel}
          </button>

          {resource.downloadLabel && (
            <button
              className="flex items-center gap-1 px-3 py-2.5 rounded-xl text-xs font-semibold border-2 transition-all hover:shadow-sm"
              style={{
                borderColor: `${resource.color}40`,
                color: resource.color,
                background: `${resource.color}08`,
              }}
              title={resource.downloadLabel}
              onClick={() => onPreview(resource)}
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Preview Modal ─────────────────────────────────────────────────────────────
function PreviewModal({ resource, onClose }) {
  if (!resource) return null;
  const TypeIcon = TYPE_ICON[resource.type] || BookOpen;
  const cat = CATEGORIES.find((c) => c.id === resource.category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(51,54,69,0.5)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
        style={{ background: "white" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-7 py-6"
          style={{
            background: `linear-gradient(135deg, ${resource.color}20, ${resource.color}08)`,
            borderBottom: "1.5px solid #f0ede8",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span
                className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full mb-3"
                style={{
                  background: `${resource.color}25`,
                  color: resource.color,
                }}
              >
                {cat?.emoji} {cat?.label} · {TYPE_LABEL[resource.type]}
              </span>
              <h2
                className="text-xl font-bold leading-snug"
                style={{ color: P.charcoal }}
              >
                {resource.title}
              </h2>
              <div
                className="flex items-center gap-3 mt-2 text-xs"
                style={{ color: P.sage }}
              >
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {resource.duration}
                </span>
                <span>{resource.level}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 hover:bg-white/80 transition-colors"
              style={{ color: P.sage }}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-7 py-6">
          <p
            className="text-sm leading-relaxed mb-5"
            style={{ color: "#6b7b6a" }}
          >
            {resource.description}
          </p>

          {/* Preview steps */}
          <div className="mb-6">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: P.sage }}
            >
              {resource.type === "checklist"
                ? "What's Inside"
                : resource.type === "audio"
                  ? "Practice Steps"
                  : "Key Content"}
            </p>
            <ul className="space-y-2.5">
              {resource.preview.map((step, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm"
                  style={{ color: P.charcoal }}
                >
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{
                      background: `${resource.color}20`,
                      color: resource.color,
                    }}
                  >
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {resource.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  background: `${resource.color}15`,
                  color: resource.color,
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm text-white shadow-sm hover:shadow-md hover:opacity-90 transition-all"
              style={{
                background: `linear-gradient(135deg, ${resource.color}, ${resource.color}bb)`,
              }}
              onClick={onClose}
            >
              <TypeIcon className="w-4 h-4" />
              {resource.actionLabel}
            </button>

            {resource.downloadLabel && (
              <button
                className="flex items-center gap-2 px-5 py-3.5 rounded-2xl font-bold text-sm border-2 hover:shadow-sm transition-all"
                style={{
                  borderColor: `${resource.color}50`,
                  color: resource.color,
                  background: `${resource.color}08`,
                }}
                onClick={onClose}
              >
                <Download className="w-4 h-4" />
                PDF
              </button>
            )}
          </div>

          <p className="text-center text-xs mt-4" style={{ color: "#c4bdb3" }}>
            Free for all registered clients · No login required for basic access
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function WellnessResources() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [previewResource, setPreviewResource] = useState(null);

  const filtered =
    activeCategory === "all"
      ? RESOURCES
      : RESOURCES.filter((r) => r.category === activeCategory);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory);

  return (
    <>
      <section
        className="py-20"
        style={{
          background: "linear-gradient(180deg, #f0f7f0 0%, #fdfcf7 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── Section header ─────────────────────────────────────────────── */}
          <div className="text-center mb-14">
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
              style={{ background: "#f0fdf4", color: P.green }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Free Wellness Library
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
              style={{ color: P.charcoal }}
            >
              Wellness Resources
            </h2>
            <p
              className="max-w-2xl mx-auto text-base"
              style={{ color: P.sage }}
            >
              Evidence-based guides, exercises, and tools across five pillars of
              holistic wellness — free to access, built with clinical expertise.
            </p>
          </div>

          {/* ── Category filter bar ─────────────────────────────────────────── */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {CATEGORIES.map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isActive
                      ? `linear-gradient(135deg, ${cat.color}, ${cat.color}cc)`
                      : "white",
                    color: isActive ? "white" : P.charcoal,
                    border: `1.5px solid ${isActive ? "transparent" : "#e8e4dd"}`,
                    boxShadow: isActive
                      ? `0 4px 14px ${cat.color}40`
                      : "0 1px 4px rgba(0,0,0,0.04)",
                    transform: isActive ? "scale(1.04)" : "scale(1)",
                  }}
                >
                  <span>{cat.emoji}</span>
                  {cat.label}
                  {cat.id !== "all" && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                      style={{
                        background: isActive
                          ? "rgba(255,255,255,0.25)"
                          : `${cat.color}15`,
                        color: isActive ? "white" : cat.color,
                      }}
                    >
                      {RESOURCES.filter((r) => r.category === cat.id).length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Active category headline ───────────────────────────────────── */}
          {activeCategory !== "all" && (
            <div className="text-center mb-8">
              <p className="text-sm" style={{ color: P.sage }}>
                Showing{" "}
                <strong style={{ color: activeCat?.color }}>
                  {filtered.length} {activeCat?.label} resource
                  {filtered.length !== 1 ? "s" : ""}
                </strong>
              </p>
            </div>
          )}

          {/* ── Resource grid ──────────────────────────────────────────────── */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((resource) => (
              <ResourceCard
                key={resource.id}
                resource={resource}
                onPreview={setPreviewResource}
              />
            ))}
          </div>

          {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
          <div className="mt-16 rounded-3xl overflow-hidden">
            <div
              className="px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{
                background: `linear-gradient(135deg, ${P.teal} 0%, ${P.green} 100%)`,
              }}
            >
              <div>
                <p className="text-white font-bold text-xl mb-1">
                  Want a personalized wellness plan?
                </p>
                <p
                  className="text-sm"
                  style={{ color: "rgba(255,255,255,0.75)" }}
                >
                  Our therapists create custom resource collections tailored to
                  your specific needs and goals.
                </p>
              </div>
              <a
                href="#contact"
                className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-bold text-sm transition-all hover:shadow-xl hover:scale-105"
                style={{ background: "white", color: P.teal }}
              >
                Get My Plan
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Preview Modal (portal-style) ──────────────────────────────────── */}
      {previewResource && (
        <PreviewModal
          resource={previewResource}
          onClose={() => setPreviewResource(null)}
        />
      )}
    </>
  );
}
