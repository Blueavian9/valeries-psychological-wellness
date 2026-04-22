Valerie Wellness — 9-Agent Swarm Architecture
PRD tasks and launch command

cat > docs/PRD.md << 'EOF'
# 🏥 Holistic Therapy Platform — PRD Migration Tracker

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ❌ | Not Started |
| ⬜ | Pending Test |

---

## PHASE SUMMARY

| Phase | Status |
|-------|--------|
| PHASE 1: Backend Setup | ✅ COMPLETED |
| PHASE 2: Authentication | ✅ COMPLETED |
| PHASE 3: Data Migration | ✅ COMPLETED |
| PHASE 4: Stripe Payments | ✅ COMPLETED |
| PHASE 5: Email Notifications | 🔄 IN PROGRESS |
| PHASE 6: Production Deployment | 🔄 IN PROGRESS |
| PHASE 7: QA Testing (Enterprise Level) | ❌ NOT STARTED |
| PHASE 8: Security Hardening (New Agents) | ❌ NOT STARTED |

---

## PHASE 1: Backend Setup ✅ COMPLETED

✅ src/lib/supabase.js created & pushed
✅ src/hooks/useAuth.jsx created & pushed
✅ src/hooks/useAppointments.jsx created & pushed
✅ .env.local exists in project root
✅ .env.local confirmed in .gitignore
✅ Node v22.13.1 installed
✅ Supabase project created & healthy
✅ @supabase/supabase-js@2.97.0 installed
✅ API keys added to .env.local
✅ supabase/schema.sql deployed

---

## PHASE 2: Authentication ✅ COMPLETED

✅ useAuth.jsx with role fetching hook built
✅ AuthProvider wrapping App
✅ ProtectedRoute component with role-based redirects built
✅ LoginPage.jsx built & verified
✅ SignUpPage.jsx built & verified — email confirmation from Supabase working
✅ ResetPasswordPage.jsx built & verified
✅ Auth routes added to App.jsx
✅ Login page verified in browser
✅ Signup flow tested end-to-end
✅ Password reset tested
✅ Protected routes tested and working (/dashboard redirects to /login)
✅ Role-based access built and deployed (client / therapist / admin)

---

## PHASE 3: Data Migration ✅ COMPLETED

✅ Seed therapist data
✅ Seed services data
✅ Connect BookingPage to Supabase
✅ Connect Dashboard to Supabase
✅ Connect TherapistFinder to Supabase
✅ Connect ContactCTA to Supabase

---

## PHASE 4: Stripe Payments ✅ COMPLETED

✅ Stripe account setup
✅ Install Stripe SDK (@stripe/react-stripe-js, stripe)
✅ Stripe keys added to .env.local
✅ Stripe secret key added to Supabase secrets
✅ Supabase Edge Function: create-payment-intent deployed
✅ Supabase Edge Function: stripe-webhook deployed
✅ Wrap App with Stripe Elements provider (main.jsx)
✅ BookingPage — CardElement + 5-step flow
✅ App.jsx — routing fixed, guest booking open
✅ FAQ.jsx — id="faq" anchor fixed
✅ BookingConfirmation.jsx created & pushed
✅ App.jsx — route added
✅ BookingPage.jsx — handlePaidBooking update completed

---

## PHASE 5: Email Notifications 🔄 IN PROGRESS

### 📧 Task 1: Booking Confirmation Email ✅ COMPLETE
✅ 1.1  Create Resend account at resend.com
✅ 1.2  Get Resend API key from dashboard
✅ 1.3  Add RESEND_API_KEY to Supabase secrets
✅ 1.4  Create supabase/functions/send-email/index.ts
✅ 1.5  Write booking confirmation HTML email template
✅ 1.6  Deploy send-email Edge Function
✅ 1.7  Update stripe-webhook to call send-email on payment_intent.succeeded
✅ 1.8  Add fallback call to send-email in BookingPage.jsx handlePaidBooking()
✅ 1.9  Test end-to-end: book → pay → confirm email received
✅ 1.10 Push to repo + mark ✅

### ⏰ Task 2: Appointment Reminder Email 🔄 IN PROGRESS
✅ 2.1  Create supabase/functions/send-reminder/index.ts
✅ 2.2  Write reminder HTML email template (24hr before appointment)
✅ 2.3  Set up Supabase pg_cron job to query upcoming appointments
✅ 2.4  Cron triggers send-reminder for appointments in next 24hrs
✅ 2.5  Deploy send-reminder Edge Function
✅ 2.5a HIPAA: no client email/PHI in Edge Function logs
✅ 2.5b Register send_reminder_hourly cron + config.toml
⬜ 2.6  Test: create appointment → verify reminder fires correctly
⬜ 2.7  Push to repo + mark ✅

### 📬 Task 3: Contact Form Auto-Reply 🔄 IN PROGRESS
✅ 3.1  Audit existing ContactCTA.jsx — confirm form fields
✅ 3.2  Create supabase/functions/send-contact-reply/index.ts
✅ 3.3  Write auto-reply HTML template
✅ 3.4  Write admin notification template
✅ 3.5  Wire ContactCTA.jsx form submit to call send-contact-reply
✅ 3.5a Map either → preferred_contact text (schema CHECK)
⬜ 3.6  Deploy send-contact-reply Edge Function
⬜ 3.7  Test: submit form → verify auto-reply + admin email received
⬜ 3.8  Push to repo + mark ✅

### 🔔 Task 4: Admin Notification Emails 🔄 IN PROGRESS
✅ 4.1  Identify all admin trigger events
✅ 4.2  Add ADMIN_EMAIL to Supabase secrets
✅ 4.3  Add admin notification calls to stripe-webhook
✅ 4.4  Add admin notification call to send-contact-reply
✅ 4.4a New booking: pg_net trigger → admin-notify (booking_created)
✅ 4.4b New signup: handle_new_user migration → admin-notify (signup)
✅ 4.4c Deploy notify-admin-booking Edge Function (signature fix applied)
✅ 4.4d Deploy notify-admin-signup Edge Function (created & deployed)
⬜ 4.5  Test all admin notification triggers
⬜ 4.6  Push to repo + mark ✅

---

## PHASE 6: Production Deployment 🔄 IN PROGRESS

### ☁️ Task 1: Vercel Environment Variables ✅ COMPLETE
✅ 1.1  Audit all .env.local variables
✅ 1.2  Add VITE_SUPABASE_URL to Vercel dashboard
✅ 1.3  Add VITE_SUPABASE_ANON_KEY to Vercel dashboard
✅ 1.4  Add VITE_STRIPE_PUBLISHABLE_KEY to Vercel dashboard
✅ 1.5  Add STRIPE_SECRET_KEY (sensitive) to Vercel dashboard
✅ 1.6  Verify VITE_ prefix on all frontend-facing vars
✅ 1.7  Redeploy — Status: Ready ✅

### 🌐 Task 2: Custom Domain ✅ COMPLETE
✅ 2.1  Domain purchased: valeriemunozpsyc.com (Namecheap, expires Dec 2026)
✅ 2.2  Domain added in Vercel → valeries-psychological-wellness-app
✅ 2.3  www.valeriemunozpsyc.com connected and resolving
✅ 2.4  Duplicate Vercel project deleted (valeries-psychological-wellness)
✅ 2.5  Single source of truth: valeries-psychological-wellness-app

### 🔒 Task 3: SSL Certificate ✅ COMPLETE
✅ 3.1  Vercel auto-provisioned SSL confirmed
✅ 3.2  https://www.valeriemunozpsyc.com loads correctly
⬜ 3.3  Check for mixed content warnings in browser console
⬜ 3.4  Push to repo + mark ✅

### 🔐 Task 4: Account Security ✅ COMPLETE
✅ 4.1  Vercel 2FA enabled (Authenticator App)
✅ 4.2  Passkey saved for Vercel account
⬜ 4.3  Enable 2FA on Namecheap account
⬜ 4.4  Enable 2FA on Supabase account
⬜ 4.5  Enable 2FA on GitHub account

### 🔗 Task 5: Social Media Icons ❌ NOT STARTED
❌ 5.1  Confirm Valerie's social media account URLs
❌ 5.2  Update footer social icons with real URLs
❌ 5.3  Hide any icons where account does not yet exist
❌ 5.4  Verify all links open in new tab with rel="noopener"
❌ 5.5  Push to repo + mark ✅

### 📊 Task 6: Analytics (PostHog) ❌ NOT STARTED
❌ 6.1  Create PostHog account at posthog.com
❌ 6.2  Select HIPAA-compliant plan + sign BAA
❌ 6.3  Install posthog-js in project
❌ 6.4  Add VITE_POSTHOG_KEY to .env.local + Vercel
❌ 6.5  Initialize PostHog in main.jsx
❌ 6.6  Verify events firing in PostHog dashboard
❌ 6.7  Push to repo + mark ✅

### ⚡ Task 7: Performance Audit ❌ NOT STARTED
❌ 7.1  Run Lighthouse audit in Chrome DevTools
❌ 7.2  Run PageSpeed Insights on live URL
❌ 7.3  Fix Vite deprecation warnings (esbuild → oxc)
❌ 7.4  Fix image optimization issues
❌ 7.5  Add lazy loading to heavy components
❌ 7.6  Reduce JS bundle size (code split)
❌ 7.7  Re-run Lighthouse — target 90+ score
❌ 7.8  Push to repo + mark ✅

### 🔍 Task 8: SEO Audit ❌ NOT STARTED
❌ 8.1  Audit index.html — title, description, OG tags, Schema.org
❌ 8.2  Add per-page meta tags (BookingPage, TherapistFinder)
❌ 8.3  Verify Open Graph preview with opengraph.xyz
❌ 8.4  Generate sitemap.xml
❌ 8.5  Submit sitemap to Google Search Console
❌ 8.6  Add Schema.org JSON-LD to key pages
❌ 8.7  Push to repo + mark ✅

### 🚀 Task 9: Smoke Test ✅ COMPLETE
✅ 9.1  https://www.valeriemunozpsyc.com — loads correctly
✅ 9.2  https://www.valeriemunozpsyc.com/booking — loads correctly
✅ 9.3  https://www.valeriemunozpsyc.com/login — loads correctly
✅ 9.4  https://www.valeriemunozpsyc.com/dashboard — redirects to login
✅ 9.5  https://www.valeriemunozpsyc.com/contact — loads correctly

---

## PHASE 7: QA Testing (Enterprise Level) ❌ NOT STARTED

### Agent 3 — Unit Test Agent (Vitest)
❌ 1.1  Install Vitest + @testing-library/react
❌ 1.2  Configure vitest.config.js
❌ 1.3  Write tests for utility functions
❌ 1.4  Write tests for useAuth hook
❌ 1.5  Write tests for useAppointments hook
❌ 1.6  Write tests for LoginPage
❌ 1.7  Write tests for SignUpPage
❌ 1.8  Write tests for BookingPage step flow
❌ 1.9  Write tests for BookingConfirmation
❌ 1.10 Run + pass all unit/component tests
❌ 1.11 Push to repo + mark ✅

### Agent 4 — E2E Agent (Playwright)
❌ 2.1  Install Playwright + configure playwright.config.ts
❌ 2.2  Write auth flow test (signup → login → logout)
❌ 2.3  Write booking flow test (select service → pay → confirm)
❌ 2.4  Write contact form test
❌ 2.5  Write protected route test (unauth redirect)
❌ 2.6  Run + pass all E2E tests
❌ 2.7  Push to repo + mark ✅

### Agent 5 — Security Agent (RLS + XSS + CSRF)
❌ 3.1  Audit all Supabase RLS policies
❌ 3.2  Verify no API keys in client bundle
❌ 3.3  Test XSS: inject script tags into form inputs
❌ 3.4  Test CSRF: verify Edge Functions reject unauthorized origins
❌ 3.5  Run npm audit — fix critical CVEs
❌ 3.6  Confirm HIPAA: no PHI in any logs
❌ 3.7  Push security audit report

### Agent 6 — Error Agent (Boundaries + 404)
❌ 4.1  Add React ErrorBoundary component
❌ 4.2  Test Stripe failure → graceful error UI
❌ 4.3  Test Supabase offline → graceful error UI
❌ 4.4  Create NotFound.jsx (404 page)
❌ 4.5  Add catch-all route in App.jsx
❌ 4.6  Test expired session behavior
❌ 4.7  Test booking with no services available
❌ 4.8  Push to repo + mark ✅

### Agent 7 — SEO Agent
❌ 5.1  Audit index.html title + description
❌ 5.2  Add per-page meta for BookingPage
❌ 5.3  Add per-page meta for TherapistFinder
❌ 5.4  Verify Open Graph at opengraph.xyz
❌ 5.5  Generate sitemap.xml
❌ 5.6  Submit sitemap to Google Search Console
❌ 5.7  Add Schema.org JSON-LD to key pages
❌ 5.8  Push SEO complete

### Agent 8 — QA Agent (Mobile + a11y + cross-browser)
❌ 6.1  Test all pages on iPhone SE (375px)
❌ 6.2  Test all pages on iPhone 14 (390px)
❌ 6.3  Test all pages on iPad (768px)
❌ 6.4  Fix any layout breaks
❌ 6.5  Run axe DevTools on all key pages
❌ 6.6  Fix critical a11y violations
❌ 6.7  Test keyboard navigation everywhere
❌ 6.8  Test with VoiceOver / NVDA
❌ 6.9  Test Chrome, Firefox, Safari, Edge
❌ 6.10 Push QA report + fixes

### Agent 9 — Perf Agent (Lighthouse + load testing)
❌ 7.1  Run Lighthouse audit in Chrome
❌ 7.2  Run PageSpeed Insights on prod URL
❌ 7.3  Fix image optimization issues
❌ 7.4  Add lazy loading to heavy components
❌ 7.5  Reduce JS bundle size (code split)
❌ 7.6  Re-run Lighthouse — target 90+
❌ 7.7  Set up k6 load test script
❌ 7.8  Simulate 100 concurrent users
❌ 7.9  Review Supabase query performance
❌ 7.10 Push performance report

---

## PHASE 8: Security Hardening ❌ NOT STARTED

### Agent 10 — Rate Limiting
❌ 1.1  Implement rate limiting on login route (max 5 attempts / 15 min)
❌ 1.2  Implement rate limiting on booking endpoint
❌ 1.3  Implement rate limiting on contact form endpoint
❌ 1.4  Implement rate limiting on all Edge Functions
❌ 1.5  Test rate limiting triggers correctly
❌ 1.6  Push to repo + mark ✅

### Agent 11 — Secrets Scanner
❌ 2.1  Scan entire codebase for hardcoded API keys
❌ 2.2  Scan for hardcoded tokens or passwords
❌ 2.3  Scan git history for accidentally committed secrets
❌ 2.4  Install git-secrets or trufflehog for ongoing protection
❌ 2.5  Push report + mark ✅

### Agent 12 — Env Var Hardening
❌ 3.1  Audit all env vars — confirm none exposed in frontend bundle
❌ 3.2  Confirm nothing sensitive committed to Git
❌ 3.3  Verify Vercel env vars marked Sensitive where needed
❌ 3.4  Verify Supabase secrets all set correctly
❌ 3.5  Push report + mark ✅

### Agent 13 — Input Sanitization
❌ 4.1  Sanitize all user inputs on contact form
❌ 4.2  Sanitize all user inputs on booking form
❌ 4.3  Sanitize all user inputs on login + signup forms
❌ 4.4  Reject oversized payloads on all Edge Functions
❌ 4.5  Reject malformed JSON on all Edge Functions
❌ 4.6  Push to repo + mark ✅

### Agent 14 — Full Security Audit + Report
❌ 5.1  Run full OWASP Top 10 check against the app
❌ 5.2  Review all RLS policies one final time
❌ 5.3  Verify HIPAA compliance across all data flows
❌ 5.4  Document all findings in security-audit.md
❌ 5.5  Fix any remaining critical vulnerabilities
❌ 5.6  Push final security report + mark ✅

-------------------------------------------------------------------

## SWARM AGENT QUEUE

| Agent | Phase | Status |
|-------|-------|--------|
| Agent 1 — Email Agent | Phase 5 | 🔄 IN PROGRESS |
| Agent 2 — Deploy Agent | Phase 6 | 🔄 IN PROGRESS |
| Agent 3 — Unit Test Agent | Phase 7.1-2 | ❌ QUEUED |
| Agent 4 — E2E Agent | Phase 7.3 | ❌ QUEUED |
| Agent 5 — Security Agent | Phase 7.10 | ❌ QUEUED |
| Agent 6 — Error Agent | Phase 7.11-12 | ❌ QUEUED |
| Agent 7 — SEO Agent | Phase 6.5 | ❌ QUEUED |
| Agent 8 — QA Agent | Phase 7.6-8 | ❌ QUEUED |
| Agent 9 — Perf Agent | Phase 6.4 + 7.9 | ❌ QUEUED |
| Agent 10 — Rate Limiting Agent | Phase 8 | ❌ QUEUED |
| Agent 11 — Secrets Scanner Agent | Phase 8 | ❌ QUEUED |
| Agent 12 — Env Var Hardening Agent | Phase 8 | ❌ QUEUED |
| Agent 13 — Input Sanitization Agent | Phase 8 | ❌ QUEUED |
| Agent 14 — Full Security Audit Agent | Phase 8 | ❌ QUEUED |




------------------------------------------------------------------------------------------


*Last updated: Phase 6 smoke test passed. Next: finish Phase 5 pending tasks, then Phase 6 remaining tasks.*
EOF
Then commit:
bashgit add docs/PRD.md
git commit -m "docs: update PRD — Phase 6 progress, add Agents 10-14, PostHog, social media tasks."
git push origin main
Paste the output, and we move to the next task.


On your new agents — all 5 are solid additions. Here's how they map to your existing phases:

Agent 10 — Rate Limiting (login + all endpoints)
Agent 11 — Secrets Scanner (hardcoded keys audit)
Agent 12 — Env Var Hardening (frontend exposure check)
Agent 13 — Input Sanitization (all form inputs)
Agent 14 — Full Security Audit + Report

PostHog is a great call for a startup — it's open source, HIPAA-capable with a Business Associate Agreement, and tracks users without selling their data, unlike Google Analytics. We'll add it to the SEO Agent phase.
