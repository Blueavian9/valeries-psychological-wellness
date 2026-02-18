# PRD Status Tracker — Holistic Therapy Platform
Updated: February 2026

## Files to copy into: `src/components/`

| File | Destination |
|------|-------------|
| `Testimonials.jsx` | `src/components/Testimonials.jsx` |
| `FAQ.jsx` | `src/components/FAQ.jsx` |
| `ContactCTA.jsx` | `src/components/ContactCTA.jsx` |

Your `App.jsx` already imports all three — no changes needed there.

---

## EPIC Status

| # | EPIC | Status | Component File |
|---|------|--------|----------------|
| 1 | Core Layout & Navigation | ✅ Done | `Header.jsx`, `Footer.jsx` |
| 2 | Hero Section | ✅ Done | `Hero.jsx` |
| 3 | Statistics Section | ✅ Done | `Stats.jsx` |
| 4 | Holistic Features Grid | ✅ Done | `Features.jsx` |
| 5 | Platform Comparison Table | ✅ Done | `PlatformComparison.jsx` |
| 6 | Testimonials Carousel | ✅ **Built now** | `Testimonials.jsx` ← copy this |
| 7 | FAQ Accordion | ✅ **Built now** | `FAQ.jsx` ← copy this |
| 8 | Contact / CTA Section | ✅ **Built now** | `ContactCTA.jsx` ← copy this |
| 9 | Wellness Resources Library | ✅ **Built now** | `WellnessResources.jsx` ← copy this |
| 10 | Therapist Finder / Matching Quiz | 📋 Backlog | Not started |
| 11 | Blog / Articles | 📋 Future | Not started |

**Booking System** | ✅ Built | `src/pages/BookingPage.jsx`
**Admin Dashboard** | ✅ Built | `src/pages/Dashboard.jsx`
**Data Store** | ✅ Built | `src/services/store.js`

---

## What each new component does

### Testimonials.jsx (EPIC 6)
- 6 client testimonials across Anxiety, Burnout, Depression, Trauma, Relationships, Life Transitions
- Auto-rotating carousel (5s interval, pauses on hover)
- 3-card desktop grid, single-card mobile
- Pill dot indicators + prev/next controls
- Verified badge + social proof footer row

### FAQ.jsx (EPIC 7)
- 12 questions across 4 color-coded categories: About Holistic Therapy, Platform Usage, Pricing & Insurance, Getting Started
- Smooth CSS max-height expand/collapse animation
- First item open by default
- SEO schema markup (`itemScope`, `itemType="FAQPage"`)
- "Ask Us Anything →" CTA anchors to #contact

### ContactCTA.jsx (EPIC 8)
- Full validated contact form: Name, Email, Phone, Preferred Contact Method, Message
- Inline field-level validation with error messages
- Newsletter opt-in checkbox
- Privacy policy acceptance (required)
- Loading spinner while "submitting"
- Success confirmation screen with personalized message
- Left panel: gradient info card, 4 trust badges, social media links
- Anchor ID: `id="contact"` — FAQ CTA links here

---

## Up Next: EPIC 9 (Wellness Resources)

When you're ready, run:
```
git add .
git commit -m "feat: EPICs 6-8 — Testimonials, FAQ, Contact"
git push origin main
```
Vercel auto-deploys to valeriemunozpsyc.com.

Then we build EPIC 9: Wellness Resources grid with categories
(Meditation, Yoga, Nutrition, Sleep, Stress) and download/access buttons.