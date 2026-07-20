🏥 Holistic Therapy Platform — PRD Tracker

# 🏥 Holistic Therapy Platform — PRD Tracker
**Project:** valeries-psychological-wellness  
**Live URL:** https://www.valeriemunozpsyc.com  
**Goal:** Ship production-ready client platform + get hired within 30–90 days  
**Stack:** React 19 · Vite 7 · Tailwind v4 · **Neon (Postgres + Auth) · Vercel Functions** · Stripe · Vercel · Node 22
**Stack change (Jul 13, 2026):** Migrating off Supabase entirely — Postgres/Auth → Neon, Edge Functions → Vercel Functions. See MIGRATION PLAN below. Old stack (Supabase) kept read-only as fallback until cutover is verified.

---

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ⬜ | Pending |
| 🚫 | Cut — not needed to get hired |
| 🚨 | Urgent / Blocking |

---

## PHASE SUMMARY

| Phase | Status |
|-------|--------|
| PHASE 1: Backend Setup | ✅ COMPLETED (Supabase) |
| PHASE 2: Authentication | 🔄 REVISITING — login broken, **migrating to Neon Auth** |
| PHASE 3: Data Migration | ✅ COMPLETED (Supabase) — 🔄 re-migrating to Neon |
| PHASE 4: Stripe Payments | ✅ COMPLETED (Supabase Edge Fn) — 🔄 migrating to Vercel Functions |
| PHASE 5: Email Notifications | ✅ COMPLETED (Supabase Edge Fn) — 🔄 migrating to Vercel Functions |
| PHASE 6: Production Deployment | ✅ COMPLETED |
| PHASE 7: QA Testing | 🚫 REDUCED SCOPE |
| PHASE 8: Security Hardening | 🚫 REDUCED SCOPE |
| PHASE 9: Job Search Execution | 🔄 IN PROGRESS |
| **PHASE 10: Neon + Vercel Functions Migration** | 🔄 **NEW — IN PROGRESS** |

---

## 🚨 ACTIVE INCIDENT — Jul 13, 2026

**Symptom:** Client (Valerie) cannot log into her dashboard on the live app.

**Diagnosis:** ✅ CONFIRMED — Supabase free-tier project auto-paused from inactivity. Verified via `/booking` page showing "Failed to load services: TypeError: Failed to fetch".

**Compounding issue:** Cesar locked out of Supabase dashboard (2FA TOTP rejected repeatedly). Still unresolved as of this update — **not currently blocking**, since resolution path has changed (see below).

**Decision (Jul 13):** Rather than fight the 2FA lockout to resume the paused Supabase project, doing a **full backend cutover to Neon (Postgres + Auth) + Vercel Functions**, at zero additional cost. This resolves the immediate client-access issue and removes future auto-pause risk permanently, at the cost of a larger one-time migration (see PHASE 10 below).

**🚨 SECURITY — CREDENTIAL EXPOSURE (still unresolved, independent of migration):** 2FA backup codes, a TOTP secret, and a test account password were pasted into an LLM chat session in plaintext during troubleshooting. **All must be treated as compromised regardless of which backend is live.**
- [ ] Regenerate Supabase account TOTP secret + backup codes (once dashboard access recovered, or via account recovery flow)
- [ ] Rotate/delete the exposed test login credential if it's a real account on the live app
- [ ] Confirm GitHub PAT rotation (still pending from Jun 9)

**Repo hygiene flagged during migration audit:**
- [ ] `supabase.tar.gz` is committed to the repo — check contents for embedded credentials before deciding whether it needs removal from git history
- [ ] `supabase/.temp/pooler-url` and other `.temp/*` files are committed — verify no live connection string is embedded; add `supabase/.temp/` to `.gitignore` going forward

**Do not sign client contract until end-to-end login is manually verified working on the new Neon-backed stack.**

---

## PHASE 10: Neon + Vercel Functions Migration 🔄 NEW — IN PROGRESS

**Scope:** Full cutover. Neon replaces Supabase Postgres + Supabase Auth. Vercel Functions replace all 9 Supabase Edge Functions. Vercel Cron replaces `pg_cron`.

**Why full cutover (not hybrid):** avoids running production on two vendors simultaneously; consolidates to infra already in use (Vercel); removes Supabase free-tier auto-pause risk entirely, which is what caused this incident.

**Neon project created:** `valeries-psychological-wellness`, org `helix-high-neon` (Free tier), region AWS US East 1, Postgres 18, Neon Auth enabled at project creation.

### Corrected Edge Function inventory (PRD previously undercounted — 9, not 7)
| Function | Migrates to | Risk |
|---|---|---|
| `create-payment-intent` | Vercel Function | 🚨 High — payment critical |
| `stripe-webhook` | Vercel Function | 🚨 High — requires new Stripe webhook URL + signing secret |
| `send-email` | Vercel Function | Low |
| `send-booking-confirmation` | Vercel Function | Low |
| `send-reminder` | Vercel Function + Vercel Cron | Medium — was pg_cron, needs new scheduler |
| `send-contact-reply` | Vercel Function | Low |
| `notify-admin-booking` | Vercel Function | Low |
| `notify-admin-signup` | Vercel Function | Low |
| `admin-notify` (shared) | Vercel Function | Low |

### Migration order (lowest risk → highest risk)
1. ✅ Schema migration — **VERIFIED Jul 15, 2026 via live SQL Editor queries against Neon production branch.** Corrected mid-cycle: confirmed via `information_schema.tables` query that this project runs `neon_auth.user` (Better Auth model), not `neon_auth.users_sync` — schema.neon.sql updated accordingly before apply. Verification query confirmed: 7/7 tables present (`profiles`, `therapists`, `services`, `appointments`, `contact_submissions`, `quiz_results`, `payments`), RLS enabled (`rls_enabled = true`) on all 7, all 10 expected RLS policies present and correctly distributed. `playing_with_neon` demo table also present in `public` schema — harmless leftover from initial Neon onboarding, not part of our schema, no action needed.
2. ⬜ Auth swap — `useAuth.jsx`, `ProtectedRoute.jsx`, Login/SignUp/Reset/UpdatePassword pages → Neon Auth SDK. Profile-row creation moves from a DB trigger (not possible against `neon_auth.users_sync`) to app-level upsert on signup.
3. ⬜ Low-risk functions → Vercel Functions: `send-email`, `send-booking-confirmation`, `send-contact-reply`, `notify-admin-booking`, `notify-admin-signup`, `admin-notify`
4. ⬜ Reminder cron → Vercel Cron replacing `pg_cron` job (`20260416000000_cron_send_reminder.sql`)
5. ⬜ Payment-critical → `create-payment-intent` + `stripe-webhook` to Vercel Functions; **new Stripe webhook URL + signing secret**, fully tested in Stripe test mode before touching live keys
6. ⬜ Cutover — flip env vars/DNS in production, verify, then retire/archive Supabase project (do not delete immediately — keep as rollback for a defined window)

### Known structural differences to account for (Supabase → Neon)
- `auth.users` → `neon_auth.users_sync` — async-synced (~1s lag), **soft-deleted** (`deleted_at`), not directly insertable
- `auth.uid()` → `auth.user_id()` — requires Neon Data API enabled + `pg_session_jwt` extension + JWKS URL configured in Neon Console → Settings → RLS
- `pg_net` / `pg_cron` extensions — not available on Neon; replaced by Vercel Functions/Cron calling out directly
- ON DELETE CASCADE from `profiles` → `neon_auth.users_sync` will rarely fire (soft deletes) — flag for Valerie if hard-deletion of client data on account closure is a compliance requirement

---

## PHASE 1: Backend Setup ✅ COMPLETED (Supabase — being superseded by Phase 10)
- ✅ src/lib/supabase.js created
- ✅ src/hooks/useAuth.jsx created
- ✅ src/hooks/useAppointments.jsx created
- ✅ .env.local exists and is in .gitignore
- ✅ Node v22.x installed
- ✅ Supabase project created and healthy (now paused, see Active Incident)
- ✅ @supabase/supabase-js installed
- ✅ supabase/schema.sql deployed
- 🔄 **NEW:** Neon project created, schema drafted — see PHASE 10

---

## PHASE 2: Authentication 🔄 REVISITING — MIGRATING TO NEON AUTH
- ✅ useAuth.jsx with role fetching hook (Supabase version — being replaced)
- ✅ AuthProvider wrapping App
- ✅ ProtectedRoute with role-based redirects
- ✅ LoginPage.jsx, SignUpPage.jsx, ResetPasswordPage.jsx built
- ✅ UpdatePasswordPage.jsx — fixed auth bug (removed verifyOtp, uses onAuthStateChange PASSWORD_RECOVERY)
- ✅ Supabase URL Configuration verified (Site URL + Redirect URLs)
- ✅ Role-based access: client / therapist / admin
- ⬜ Rewrite `useAuth.jsx` against Neon Auth SDK
- ⬜ Rewrite `ProtectedRoute.jsx` for Neon Auth session shape
- ⬜ Move profile-row creation from DB trigger to app-level upsert on signup
- ⬜ Add magic link (passwordless) sign-in option (still planned, now against Neon Auth)
- 🚨 Login currently broken for client — resolved by completing Phase 10, not by fixing Supabase access

---

## PHASE 3: Data Migration ✅ COMPLETED (Supabase) — 🔄 RE-MIGRATING TO NEON
- ✅ Seed therapist data (Supabase)
- ✅ Seed services data (Supabase)
- ✅ BookingPage connected to Supabase
- ✅ Dashboard connected to Supabase
- ✅ TherapistFinder connected to Supabase
- ✅ ContactCTA connected to Supabase
- ⬜ Re-point all of the above at Neon once schema + auth migration land
- ⬜ Re-seed therapist/services data into Neon

---

## PHASE 4: Stripe Payments ✅ COMPLETED (Supabase) — 🔄 MIGRATING TO VERCEL FUNCTIONS
- ✅ Stripe account set up (test mode active — live keys pending Valerie)
- ✅ @stripe/react-stripe-js, @stripe/stripe-js installed
- ✅ Stripe keys in .env.local + Vercel env vars
- ✅ Stripe secret key in Supabase secrets (needs re-storing as Vercel env var)
- ✅ Edge Function: create-payment-intent deployed (Supabase — migrating)
- ✅ Edge Function: stripe-webhook deployed (Supabase — migrating)
- ✅ BookingPage — CardElement + 5-step flow
- ✅ BookingConfirmation.jsx created
- ✅ Stripe server SDK removed from client bundle (security fix)
- ⬜ `create-payment-intent` → Vercel Function
- ⬜ `stripe-webhook` → Vercel Function, new URL + signing secret registered in Stripe dashboard

---

## PHASE 5: Email Notifications ✅ COMPLETED (Supabase) — 🔄 MIGRATING TO VERCEL FUNCTIONS
- ✅ Resend account + API key configured
- ✅ send-email Edge Function deployed (Supabase — migrating)
- ✅ Booking confirmation email — end-to-end tested
- ✅ send-reminder Edge Function deployed (Supabase — migrating)
- ✅ pg_cron job registered for send_reminder_hourly (migrating to Vercel Cron)
- ✅ send-contact-reply Edge Function deployed (Supabase — migrating)
- ✅ notify-admin-booking Edge Function deployed (Supabase — migrating)
- ✅ notify-admin-signup Edge Function deployed (Supabase — migrating)
- ✅ admin-notify shared function deployed (Supabase — migrating) — **was missing from this PRD until Jul 13 audit**
- ✅ HIPAA: no PHI in Edge Function logs — re-verify once on Vercel Functions
- ⬜ All 9 functions redeployed as Vercel Functions
- ⬜ Vercel Cron configured for reminder job

---

## PHASE 6: Production Deployment ✅ COMPLETED
- ✅ Vercel env vars configured (4 keys) — will need Neon connection string + Neon Auth keys added
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
- ✅ Platform costs communicated to Valerie — **needs update: Neon free tier removes the $25/mo Supabase Pro line item**

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
- ⬜ Test booking flow end-to-end (blocked on Phase 10)
- ⬜ Verify Stripe test payment works (blocked on Phase 10)
- ⬜ Confirm confirmation email arrives (blocked on Phase 10)
- ⬜ Mobile check (375px + 768px in DevTools)
- 🚨 **BLOCKED:** Neon + Vercel Functions migration must complete before any of the above can be tested

---

## PHASE 8: Security — REDUCED SCOPE 🚫
> Neon RLS handles core data security (replaces Supabase RLS). Full OWASP audit post-employment.

### Minimum Viable Security
- ✅ npm audit — no critical CVEs
- ✅ STRIPE_SECRET_KEY absent from client bundle (grep confirmed)
- ✅ .env.local in .gitignore
- ⬜ Confirm no API keys in built bundle (npm run build → check dist/)
- 🚨 Rotate Supabase 2FA TOTP/backup codes + any exposed test credentials (see Active Incident) — independent of migration, still required
- ⬜ Confirm new GitHub PAT was actually generated (Jun 9 item still unchecked)
- ⬜ **NEW:** Check `supabase.tar.gz` and `supabase/.temp/*` committed files for embedded credentials
- ⬜ **NEW:** Verify Neon RLS policies enforce the same isolation as the old Supabase policies (test with two distinct client accounts — confirm client A cannot see client B's appointments/payments)

---

## PHASE 9: Job Search Execution 🔄 IN PROGRESS

### ✅ Completed
- ✅ Resume rewritten — clean 1-page, honest, accurate
- ✅ Headline: "Full Stack Engineer | React · Node.js · Supabase · Stripe · AI Integration" — **update to reflect Neon post-migration**
- ✅ LinkedIn About Me + Services updated
- ✅ Inflated/false claims removed
- ✅ Therapy app as hero project on resume
- ✅ Portfolio site live and public
- ✅ Therapy app added to LinkedIn Featured section

### ⬜ This Week — Critical Path to Interviews
- ⬜ Record 2-minute demo video of therapy app (blocked until Phase 10 login works end-to-end)
- ⬜ Write README for React-Tailwind-Portfolio repo
- ⬜ Begin 5 job applications per day

### ⬜ Job Application Targets
- ⬜ Mid-Senior Full Stack Engineer roles
- ⬜ React Developer roles
- ⬜ Frontend Engineer with backend experience
- ⬜ Companies using: React, Node.js, Postgres (Neon/Supabase)
- ⬜ Target: Healthcare tech, SaaS, startups (1–50 people)

---

## BLOCKING — CLIENT ACTIONS REQUIRED

| Item | Owner | Status |
|------|-------|--------|
| Stripe live mode activation | Valerie | ⏳ Waiting |
| Stripe live keys sent to developer | Valerie | ⏳ Waiting |
| ~~Supabase Pro upgrade ($25/mo)~~ | ~~Valerie~~ | 🚫 **No longer needed — migrating to Neon (free tier)** |
| Contract signed | Both | 🚨 **HOLD — do not sign until login verified working on new Neon stack** |

> Neon free tier: 0.5 GB storage, autoscaling, 10 branches per project. Scales to zero when inactive but **does not hard-pause the project** the way Supabase free tier did — confirm this holds under real usage before fully relying on it long-term for a paying client's production app.

---

## CRITICAL PATH — NEXT SESSION

| Task | Status |
|-----|--------|
| ~~Check `/booking` page for "Failed to load services"~~ | ✅ done, confirmed |
| Apply Neon-compatible schema to Neon project | ⬜ |
| Rewrite `useAuth.jsx` + `ProtectedRoute.jsx` for Neon Auth | ⬜ |
| Move profile creation to app-level upsert | ⬜ |
| Migrate low-risk email functions to Vercel Functions | ⬜ |
| Migrate reminder job to Vercel Cron | ⬜ |
| Migrate `create-payment-intent` + `stripe-webhook` to Vercel Functions | ⬜ |
| Register new Stripe webhook URL + signing secret | ⬜ |
| Rotate exposed 2FA backup codes / TOTP secret (independent track) | ⬜ |
| Rotate/remove exposed test credential if real | ⬜ |
| Confirm new GitHub PAT generated (90-day expiry) | ⬜ |
| Check `supabase.tar.gz` / `.temp/*` for embedded credentials | ⬜ |
| Full end-to-end login retest (client + staff + admin roles) on Neon | ⬜ |
| End-to-end booking flow test on new stack | ⬜ |
| Mobile check (375px + 768px) | ⬜ |
| Contract signed — only after above verified | ⏳ |

---

## AGENT QUEUE

| Agent | Task | Status |
|-------|------|--------|
| ✅ Done | Phases 1–6 + UI rebrand + Blog | COMPLETE |
| 🚨 Active | Phase 10 — Neon + Vercel Functions migration | IN PROGRESS |
| ⏳ Blocked | Stripe live mode switch | WAITING ON VALERIE |
| 🔄 Active | Phase 9 — job applications | IN PROGRESS (paused pending Phase 10) |
| ⬜ Next | End-to-end QA + mobile test | QUEUED — blocked on Phase 10 |
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
| Jun 9 | New GitHub PAT generated with 90-day expiry | ⬜ still pending |
| Jun 9 | PRD consolidated and sanitized — no credentials | ✅ |
| Jul 13 | Local dev env broken — missing `autoprefixer` devDependency | ✅ fixed via `npm install -D autoprefixer postcss` |
| Jul 13 | Client (Valerie) reported unable to log into dashboard | ✅ diagnosed |
| Jul 13 | Confirmed via live /booking page: "Failed to load services: TypeError: Failed to fetch" | ✅ auto-pause hypothesis CONFIRMED |
| Jul 13 | Cesar locked out of Supabase dashboard — 2FA TOTP rejected repeatedly | 🔄 unresolved, no longer on critical path |
| Jul 13 | 🚨 2FA backup codes, TOTP secret, and test password pasted into LLM chat | 🚨 must rotate all — independent of migration |
| Jul 13 | Decision: full cutover to Neon (Postgres + Auth) + Vercel Functions instead of resuming Supabase | ✅ decision locked |
| Jul 13 | Neon project `valeries-psychological-wellness` created (org helix-high-neon, Free tier, AWS US East 1, Postgres 18, Neon Auth enabled) | ✅ |
| Jul 13 | Full repo file inventory reviewed — corrected Edge Function count from 7 to 9 (added `admin-notify`, `send-booking-confirmation`) | ✅ |
| Jul 13 | Flagged `supabase.tar.gz` and `supabase/.temp/*` as committed files needing a credential check | ⬜ pending |
| Jul 13 | Neon-compatible `schema.sql` drafted — `neon_auth.users_sync` + `auth.user_id()`, profile creation moved from DB trigger to app-level upsert | ✅ drafted, ⬜ not yet applied |
| Jul 13 | Migration order defined (schema → auth → low-risk functions → cron → payment-critical → cutover) | ✅ |
| Jul 13 | Contract signing put on hold pending verified working login on new stack | 🔄 policy set |
| Jul 15 | Loop Engineering Cycle 1 (schema migration) — corrected `neon_auth.users_sync` → `neon_auth.user` after live query confirmed this project's Better Auth model | ✅ |
| Jul 15 | `schema.neon.sql` applied to Neon production branch via SQL Editor — "Statement executed successfully" | ✅ |
| Jul 15 | Schema verified via live query: 7/7 tables, RLS enabled on all 7, all 10 policies present and correctly distributed | ✅ **CYCLE 1 COMPLETE — VERIFIED, NOT ASSUMED** |
| Jul 17 | Component-by-component mock-data audit — Dashboard.jsx and TherapistFinder.jsx confirmed 100% mock (store.js / hardcoded THERAPISTS array); BookingPage.jsx confirmed genuinely wired to Supabase but hitting dead Edge Function URLs; ContactCTA.jsx confirmed clean | ✅ audit complete, ⬜ rebuilds pending |
| Jul 18 | ProtectedRoute.jsx security bug fixed — dashboard was rendering even when magic-link token was invalid (?error=INVALID_TOKEN bypassed the auth guard). Added hasAuthError check alongside !user check. Verified via direct browser test: /dashboard?error=INVALID_TOKEN now correctly redirects to /login | ✅ fixed and verified |


---

## PROJECT STRUCTURE

src/
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── BlogPreview.jsx
│   ├── ContactCTA.jsx
│   ├── FAQ.jsx
│   ├── Features.jsx
│   ├── Footer.jsx
│   ├── PlatformComparison.jsx
│   ├── ProtectedRoute.jsx
│   ├── Stats.jsx
│   ├── Testimonials.jsx
│   ├── TherapistFinder.jsx
│   └── WellnessResources.jsx
├── hooks/
│   ├── useAuth.jsx
│   └── useAppointments.jsx
├── pages/
│   ├── BlogPage.jsx
│   ├── BookingConfirmation.jsx
│   ├── BookingPage.jsx
│   ├── Dashboard.jsx
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   ├── ResetPasswordPage.jsx
│   └── UpdatePasswordPage.jsx
├── services/
│   └── store.js
└── lib/
    └── supabase.js   ← to be replaced by lib/neon.js (or similar) during migration

supabase/  ← being phased out, retained as rollback during migration
├── functions/
│   ├── _shared/ (adminNotify.ts, emailTemplates.ts)
│   ├── admin-notify/
│   ├── create-payment-intent/
│   ├── notify-admin-booking/
│   ├── notify-admin-signup/
│   ├── send-booking-confirmation/
│   ├── send-contact-reply/
│   ├── send-email/
│   ├── send-reminder/
│   └── stripe-webhook/
├── migrations/
│   ├── 20260416000000_cron_send_reminder.sql
│   └── 20260416120000_phase5_cron_and_admin_triggers.sql
└── schema.sql

schema.neon.sql  ← NEW, migrated schema for Neon (drafted Jul 13)

api/  ← NEW, will hold Vercel Functions replacing supabase/functions/*
(not yet created)

---

## SECURITY NOTES (No Credentials Here)
- All API keys stored in .env.local (gitignored) and Vercel environment variables
- Neon Auth session JWTs validated via Neon Data API; RLS enforces data access using `auth.user_id()`
- STRIPE_SECRET_KEY is server-side only — confirmed absent from client bundle; will move from Supabase secrets to Vercel env vars during migration
- GitHub PATs use 90-day expiry and minimum required scopes
- All accounts protected with 2FA (Vercel, Namecheap, Supabase, GitHub, Neon — add Neon 2FA during migration)
- 🚨 **Jul 13:** Supabase 2FA backup codes, TOTP secret, and a test credential were exposed in an LLM chat session. Treat as compromised — rotate regardless of migration status. This file intentionally contains no actual credentials.
- 🚨 **Jul 13:** `supabase.tar.gz` and `supabase/.temp/*` are committed to the repo — pending review for embedded credentials.

---

*Rule: Ship beats perfect. Finish beats impressive.*  
*Last updated: Jul 13 — decision locked to migrate fully to Neon + Vercel Functions; Neon project created; schema drafted; migration order defined; credential rotation and repo hygiene items still outstanding independent of migration.*