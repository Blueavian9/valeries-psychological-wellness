🏥 Holistic Therapy Platform — PRD Tracker

# 🏥 Holistic Therapy Platform — PRD Tracker
**Project:** valeries-psychological-wellness  
**Live URL:** https://www.valeriemunozpsyc.com  
**Goal:** Ship production-ready client platform + get hired within 30–90 days  
**Stack:** React 19 · Vite 7 · Tailwind v4 · Supabase · Stripe · Vercel · Node 22

---

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ⬜ | Pending |
| 🚫 | Cut — not needed to get hired |

---

## PHASE SUMMARY

| Phase | Status |
|-------|--------|
| PHASE 1: Backend Setup | ✅ COMPLETED |
| PHASE 2: Authentication | ✅ COMPLETED |
| PHASE 3: Data Migration | ✅ COMPLETED |
| PHASE 4: Stripe Payments | ✅ COMPLETED |
| PHASE 5: Email Notifications | ✅ COMPLETED |
| PHASE 6: Production Deployment | ✅ COMPLETED |
| PHASE 7: QA Testing | 🚫 REDUCED SCOPE |
| PHASE 8: Security Hardening | 🚫 REDUCED SCOPE |
| PHASE 9: Job Search Execution | 🔄 IN PROGRESS |

---

## PHASE 1: Backend Setup ✅ COMPLETED
- ✅ src/lib/supabase.js created
- ✅ src/hooks/useAuth.jsx created
- ✅ src/hooks/useAppointments.jsx created
- ✅ .env.local exists and is in .gitignore
- ✅ Node v22.x installed
- ✅ Supabase project created and healthy
- ✅ @supabase/supabase-js installed
- ✅ supabase/schema.sql deployed

---

## PHASE 2: Authentication ✅ COMPLETED
- ✅ useAuth.jsx with role fetching hook
- ✅ AuthProvider wrapping App
- ✅ ProtectedRoute with role-based redirects
- ✅ LoginPage.jsx, SignUpPage.jsx, ResetPasswordPage.jsx built
- ✅ UpdatePasswordPage.jsx — fixed auth bug (removed verifyOtp, uses onAuthStateChange PASSWORD_RECOVERY)
- ✅ Supabase URL Configuration verified (Site URL + Redirect URLs)
- ✅ Role-based access: client / therapist / admin
- ✅ All auth flows tested end-to-end

---

## PHASE 3: Data Migration ✅ COMPLETED
- ✅ Seed therapist data
- ✅ Seed services data
- ✅ BookingPage connected to Supabase
- ✅ Dashboard connected to Supabase
- ✅ TherapistFinder connected to Supabase
- ✅ ContactCTA connected to Supabase

---

## PHASE 4: Stripe Payments ✅ COMPLETED
- ✅ Stripe account set up (test mode active — live keys pending Valerie)
- ✅ @stripe/react-stripe-js, @stripe/stripe-js installed
- ✅ Stripe keys in .env.local + Vercel env vars
- ✅ Stripe secret key in Supabase secrets
- ✅ Edge Function: create-payment-intent deployed
- ✅ Edge Function: stripe-webhook deployed
- ✅ BookingPage — CardElement + 5-step flow
- ✅ BookingConfirmation.jsx created
- ✅ Stripe server SDK removed from client bundle (security fix)

---

## PHASE 5: Email Notifications ✅ COMPLETED
- ✅ Resend account + API key configured
- ✅ send-email Edge Function deployed
- ✅ Booking confirmation email — end-to-end tested
- ✅ send-reminder Edge Function deployed (24hr appointment reminders)
- ✅ pg_cron job registered for send_reminder_hourly
- ✅ send-contact-reply Edge Function deployed
- ✅ notify-admin-booking Edge Function deployed
- ✅ notify-admin-signup Edge Function deployed
- ✅ HIPAA: no PHI in Edge Function logs

---

## PHASE 6: Production Deployment ✅ COMPLETED
- ✅ Vercel env vars configured (4 keys)
- ✅ Custom domain: valeriemunozpsyc.com
- ✅ SSL certificate active
- ✅ Smoke test passed (5 routes)
- ✅ vercel.json SPA rewrite confirmed
- ✅ Vercel 2FA enabled
- ✅ Namecheap 2FA enabled (Support PIN rotated)
- ✅ Supabase 2FA enabled
- ✅ GitHub 2FA enabled
- ✅ GitHub repo made public
- ✅ Repo description + topics + URL updated
- ✅ Production README pushed
- ✅ Full color rebrand — lavender/purple/fuchsia (21 files)
- ✅ Hero section redesigned — gradient text, fixed CTAs
- ✅ BlogPage.jsx created — 6 wellness articles
- ✅ BlogPreview.jsx created — homepage preview section
- ✅ Valerie photo added — public/valerie-munoz.jpg
- ✅ Blog routes added to App.jsx (/blog, /blog/:slug)
- ✅ Blog nav link added to Header
- ✅ npm audit clean — 0 vulnerabilities
- ✅ Stripe Activation Guide delivered to Valerie
- ✅ Client contract drafted ($6,500 + royalty structure)
- ✅ Platform costs communicated to Valerie

### 🚫 Deferred Post-Employment
- 🚫 Social media icons (Valerie has no accounts yet)
- 🚫 PostHog Analytics (requires HIPAA BAA)
- 🚫 Full Performance Audit (Lighthouse 90+)
- 🚫 Full SEO Audit (sitemap, Schema.org, per-page meta)

---

## PHASE 7: QA — REDUCED SCOPE 🚫
> Enterprise QA (14 agents, Playwright, k6) not needed to get hired.

### Minimum Viable QA
- ✅ npm audit — 0 vulnerabilities
- ⬜ Test booking flow end-to-end
- ⬜ Verify Stripe test payment works
- ⬜ Confirm confirmation email arrives
- ⬜ Mobile check (375px + 768px in DevTools)

---

## PHASE 8: Security — REDUCED SCOPE 🚫
> Supabase RLS handles core data security. Full OWASP audit post-employment.

### Minimum Viable Security
- ✅ npm audit — no critical CVEs
- ✅ STRIPE_SECRET_KEY absent from client bundle (grep confirmed)
- ✅ .env.local in .gitignore
- ⬜ Confirm no API keys in built bundle (npm run build → check dist/)

---

## PHASE 9: Job Search Execution 🔄 IN PROGRESS

### ✅ Completed
- ✅ Resume rewritten — clean 1-page, honest, accurate
- ✅ Headline: "Full Stack Engineer | React · Node.js · Supabase · Stripe · AI Integration"
- ✅ LinkedIn About Me + Services updated
- ✅ Inflated/false claims removed
- ✅ Therapy app as hero project on resume
- ✅ Portfolio site live and public
- ✅ Therapy app added to LinkedIn Featured section

### ⬜ This Week — Critical Path to Interviews
- ⬜ Record 2-minute demo video of therapy app
- ⬜ Write README for React-Tailwind-Portfolio repo
- ⬜ Begin 5 job applications per day

### ⬜ Job Application Targets
- ⬜ Mid-Senior Full Stack Engineer roles
- ⬜ React Developer roles
- ⬜ Frontend Engineer with backend experience
- ⬜ Companies using: React, Node.js, Supabase/PostgreSQL
- ⬜ Target: Healthcare tech, SaaS, startups (1–50 people)

---

## BLOCKING — CLIENT ACTIONS REQUIRED

| Item | Owner | Status |
|------|-------|--------|
| Stripe live mode activation | Valerie | ⏳ Waiting |
| Stripe live keys sent to developer | Valerie | ⏳ Waiting |
| Supabase Pro upgrade ($25/mo) | Valerie | ⏳ Waiting — project auto-pauses on free tier |
| Contract signed | Both | ⏳ Printed, awaiting signature |

> ⚠️ Supabase free tier auto-pauses after 7 days inactive.
> The `/booking` page will show "Failed to load services" until Valerie upgrades to Pro.

---

## CRITICAL PATH — NEXT 7 DAYS

| Day | Task | Status |
|-----|------|--------|
| Today | Rotate GitHub PAT (old one exposed) | 🔄 |
| Today | Verify Vercel env vars still intact | ⬜ |
| Today | Resume Supabase project (if paused) | ⬜ |
| Day 2 | Receive Stripe live keys from Valerie | ⏳ |
| Day 2 | Swap Stripe keys in Vercel + Supabase | ⬜ |
| Day 2 | End-to-end booking flow test | ⬜ |
| Day 2 | Mobile check (375px + 768px) | ⬜ |
| Day 3 | Contract signed | ⏳ |
| Day 3 | Start 5 applications/day | ⬜ |
| Day 7 | Review — any callbacks? | ⬜ |

---

## AGENT QUEUE

| Agent | Task | Status |
|-------|------|--------|
| ✅ Done | Phases 1–6 + UI rebrand + Blog | COMPLETE |
| ⏳ Blocked | Stripe live mode switch | WAITING ON VALERIE |
| 🔄 Active | Phase 9 — job applications | IN PROGRESS |
| ⬜ Next | End-to-end QA + mobile test | QUEUED |
| 🚫 Parked | Enterprise QA (14 agents) | POST-EMPLOYMENT |
| 🚫 Parked | Full security hardening | POST-EMPLOYMENT |
| 🚫 Parked | Microservices-mall visualization portal | POST-EMPLOYMENT |

---

## AUDIT LOG

| Date | Action | Result |
|------|--------|--------|
| Apr 27 | Set ADMIN_EMAIL + RESEND_FROM_EMAIL | ✅ |
| Apr 27 | Updated contact info | ✅ |
| Apr 28 | Phase 5 complete — all emails tested | ✅ |
| Apr 28 | Full 14-agent PRD restored and pushed | ✅ |
| May 7 | Namecheap 2FA restored and verified | ✅ |
| May 7 | GitHub repo made public | ✅ |
| May 7 | Resume rewritten — clean 1-page | ✅ |
| May 7 | Repo description + topics + URL updated | ✅ |
| May 7 | README written and pushed to repo | ✅ |
| May 7 | PRD reduced to hire-focused scope | ✅ |
| May 11 | GitHub 2FA enabled | ✅ |
| May 11 | LinkedIn Headline + About Me + Services updated | ✅ |
| May 11 | Phase 6 marked COMPLETE | ✅ |
| May 12 | Diagnosed password reset token bug (verifyOtp) | ✅ |
| May 12 | UpdatePasswordPage.jsx refactored — fixed auth flow | ✅ |
| May 12 | Supabase URL Configuration audited and verified | ✅ |
| May 28 | npm audit fix — ws vulnerability patched | ✅ |
| May 28 | Stripe server SDK removed from client bundle | ✅ |
| May 28 | Full color rebrand — lavender/purple/fuchsia (21 files) | ✅ |
| May 28 | Hero section redesigned — gradient text, fixed CTAs | ✅ |
| May 28 | BlogPage.jsx + BlogPreview.jsx created | ✅ |
| May 28 | Valerie photo added — public/valerie-munoz.jpg | ✅ |
| May 28 | Blog routes + nav link added | ✅ |
| May 28 | Stripe Activation Guide delivered to Valerie | ✅ |
| May 28 | Client contract drafted | ✅ |
| May 28 | Platform costs communicated to Valerie | ✅ |
| Jun 9 | Diagnosed Supabase auto-pause — /booking broken | ✅ |
| Jun 9 | Confirmed blog links working (Edge/tracking false alarm) | ✅ |
| Jun 9 | GitHub PAT (ghp_*) revoked — was exposed in chat | ✅ |
| Jun 9 | New GitHub PAT generated with 90-day expiry | ⬜ |
| Jun 9 | PRD consolidated and sanitized — no credentials | ✅ |

---

## PROJECT STRUCTURE
```
src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── BlogPreview.jsx
│   └── ... (Stats, Features, FAQ, Footer, etc.)
├── hooks/
│   ├── useAuth.jsx
│   └── useAppointments.jsx
├── pages/
│   ├── BookingPage.jsx
│   ├── BookingConfirmation.jsx
│   ├── BlogPage.jsx
│   ├── Dashboard.jsx
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── ResetPasswordPage.jsx
│   └── UpdatePasswordPage.jsx
└── lib/
    └── supabase.js

supabase/
├── functions/
│   ├── create-payment-intent/
│   ├── stripe-webhook/
│   ├── send-email/
│   ├── send-reminder/
│   ├── send-contact-reply/
│   ├── notify-admin-booking/
│   └── notify-admin-signup/
└── schema.sql
```

---

## SECURITY NOTES (No Credentials Here)
- All API keys stored in .env.local (gitignored) and Vercel environment variables
- Supabase anon key is safe to be client-side — RLS policies enforce data access
- STRIPE_SECRET_KEY is server-side only — confirmed absent from client bundle
- GitHub PATs use 90-day expiry and minimum required scopes
- All accounts protected with 2FA (Vercel, Namecheap, Supabase, GitHub)

---

*Rule: Ship beats perfect. Finish beats impressive.*  
*Last updated: Jun 9 — Supabase pause diagnosed. GitHub PAT rotated. PRD sanitized.*