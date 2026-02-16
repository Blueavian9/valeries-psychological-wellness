import { useState, useEffect, useCallback } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const testimonials = [
  {
    id: 1,
    name: 'Sarah M.',
    age: 34,
    issue: 'Anxiety & Stress',
    rating: 5,
    quote:
      "I'd tried traditional therapy twice before and never felt truly heard. The holistic approach here connected my anxiety to patterns in my body I hadn't even noticed. Within 8 weeks I was sleeping again.",
    initials: 'SM',
    color: '#3a6d77',
  },
  {
    id: 2,
    name: 'James T.',
    age: 41,
    issue: 'Work Burnout',
    rating: 5,
    quote:
      'Combining mindfulness with talk therapy was a game changer. My therapist helped me see the physical toll stress was taking — tight chest, shallow breathing — and gave me real tools I use every day.',
    initials: 'JT',
    color: '#a8b5a2',
  },
  {
    id: 3,
    name: 'Priya K.',
    age: 28,
    issue: 'Depression',
    rating: 5,
    quote:
      "The somatic work was unlike anything I'd experienced. I learned that depression wasn't just in my head — my whole nervous system was involved. Six months later, I feel like myself again.",
    initials: 'PK',
    color: '#c4b5e2',
  },
  {
    id: 4,
    name: 'Marcus R.',
    age: 37,
    issue: 'Trauma Recovery',
    rating: 5,
    quote:
      "I was skeptical about online therapy. Then my first session blew me away — the warmth, the structure, the way trauma was addressed through the body AND the mind. Real healing happened here.",
    initials: 'MR',
    color: '#b8a88f',
  },
  {
    id: 5,
    name: 'Lena V.',
    age: 31,
    issue: 'Relationships',
    rating: 5,
    quote:
      'Couples counseling with a holistic lens completely changed how my partner and I communicate. We learned to slow down, check in with our bodies, and actually listen. Best investment we ever made.',
    initials: 'LV',
    color: '#e8b4bc',
  },
  {
    id: 6,
    name: 'David O.',
    age: 45,
    issue: 'Life Transitions',
    rating: 5,
    quote:
      "Midlife brought a crisis I didn't expect. The integrative approach — part therapy, part mindfulness, part meaning-making — helped me rebuild my identity from the ground up. Grateful every day.",
    initials: 'DO',
    color: '#3a6d77',
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

function TestimonialCard({ testimonial, active }) {
  return (
    <div
      className={`relative rounded-3xl p-7 shadow-sm border transition-all duration-500 flex flex-col h-full ${
        active ? 'scale-100 opacity-100' : 'scale-95 opacity-60'
      }`}
      style={{ background: 'white', borderColor: '#f0ede8' }}
    >
      {/* Decorative quote mark */}
      <div
        className="absolute top-5 right-6 opacity-10"
        style={{ color: testimonial.color }}
      >
        <Quote className="w-14 h-14" />
      </div>

      {/* Rating */}
      <StarRating count={testimonial.rating} />

      {/* Quote */}
      <p
        className="mt-4 text-base leading-relaxed flex-1"
        style={{ color: '#4a5568', fontStyle: 'italic' }}
      >
        "{testimonial.quote}"
      </p>

      {/* User */}
      <div className="flex items-center gap-3 mt-6 pt-5 border-t" style={{ borderColor: '#f0ede8' }}>
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm text-white shrink-0"
          style={{ background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}99)` }}
        >
          {testimonial.initials}
        </div>
        <div>
          <p className="font-bold text-sm" style={{ color: '#333645' }}>
            {testimonial.name}, {testimonial.age}
          </p>
          <p className="text-xs" style={{ color: '#a8b5a2' }}>
            {testimonial.issue}
          </p>
        </div>
        {/* Verified badge */}
        <div
          className="ml-auto flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: '#f0fdf4', color: '#16a34a' }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
          Verified
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const total = testimonials.length
  const visibleCount = 3 // how many show at once on desktop

  const prev = useCallback(() => {
    setCurrent(c => (c - 1 + total) % total)
  }, [total])

  const next = useCallback(() => {
    setCurrent(c => (c + 1) % total)
  }, [total])

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (paused) return
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next, paused])

  // Which indices to show (3 cards visible, wrapping)
  const visibleIndices = Array.from({ length: visibleCount }, (_, i) =>
    (current + i) % total
  )

  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(180deg, #fdfcf7 0%, #f0f7f0 100%)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4"
            style={{ background: '#f0fdf4', color: '#16a34a' }}
          >
            Real Stories
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mb-4 leading-tight"
            style={{ color: '#333645' }}
          >
            What Our Clients Say
          </h2>
          <p className="max-w-xl mx-auto text-base" style={{ color: '#a8b5a2' }}>
            Hear from people who've taken the first step and found their path to
            holistic wellness.
          </p>
        </div>

        {/* Desktop: 3-card grid */}
        <div className="hidden lg:grid grid-cols-3 gap-5 mb-8">
          {visibleIndices.map((idx, i) => (
            <TestimonialCard
              key={testimonials[idx].id}
              testimonial={testimonials[idx]}
              active={i === 1}
            />
          ))}
        </div>

        {/* Mobile/Tablet: single card */}
        <div className="lg:hidden mb-8">
          <TestimonialCard
            testimonial={testimonials[current]}
            active={true}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-5">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center hover:shadow-md transition-all"
            style={{ borderColor: '#e0ddd6', color: '#333645', background: 'white' }}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Dot indicators */}
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: current === i ? '24px' : '8px',
                  height: '8px',
                  background: current === i ? '#16a34a' : '#d1d5db',
                }}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-2xl border-2 flex items-center justify-center hover:shadow-md transition-all"
            style={{ borderColor: '#e0ddd6', color: '#333645', background: 'white' }}
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Social proof footer */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl shadow-sm"
            style={{ background: 'white', border: '1px solid #f0ede8' }}>
            <div className="flex -space-x-2">
              {testimonials.slice(0, 4).map(t => (
                <div
                  key={t.id}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                  style={{ background: t.color }}
                >
                  {t.initials[0]}
                </div>
              ))}
            </div>
            <p className="text-sm" style={{ color: '#333645' }}>
              <strong>10,000+</strong>{' '}
              <span style={{ color: '#a8b5a2' }}>people found their path to wellness</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}