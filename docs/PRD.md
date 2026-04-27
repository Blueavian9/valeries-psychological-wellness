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
| PHASE 7: QA Testing | ❌ NOT STARTED |
| PHASE 8: Security Hardening | ❌ NOT STARTED |

---

## PHASE 5: Email Notifications 🔄 IN PROGRESS

### Task 1: Booking Confirmation Email ✅ COMPLETE
✅ 1.1 Resend account created
✅ 1.2 Resend API key obtained
✅ 1.3 RESEND_API_KEY added to Supabase secrets
✅ 1.4 send-email Edge Function created
✅ 1.5 Booking confirmation HTML template written
✅ 1.6 send-email Edge Function deployed
✅ 1.7 stripe-webhook calls send-email on payment_intent.succeeded
✅ 1.8 Fallback call added to BookingPage.jsx handlePaidBooking()
✅ 1.9 End-to-end test passed — email received
✅ 1.10 Pushed to repo

### Task 2: Appointment Reminder Email ✅ COMPLETE
✅ 2.1 send-reminder Edge Function created
✅ 2.2 Reminder HTML template written (24hr before)
✅ 2.3 pg_cron job set up
✅ 2.4 Cron triggers send-reminder for next 24hr appointments
✅ 2.5 send-reminder Edge Function deployed
✅ 2.5a HIPAA: no PHI in Edge Function logs
✅ 2.5b send_reminder_hourly cron registered + config.toml
✅ 2.6 Test passed — reminder email received (blueavian9@gmail.com)
✅ 2.7 Pushed to repo

### Task 3: Contact Form Auto-Reply 🔄 IN PROGRESS
✅ 3.1 ContactCTA.jsx audited — form fields confirmed
✅ 3.2 send-contact-reply Edge Function created
✅ 3.3 Auto-reply HTML template written
✅ 3.4 Admin notification template written
✅ 3.5 ContactCTA.jsx wired to call send-contact-reply
✅ 3.5a Map either → preferred_contact text (schema CHECK)
✅ 3.6 send-contact-reply Edge Function deployed (confirmed in dashboard)
⬜ 3.7 Test: submit form → verify auto-reply + admin email received
⬜ 3.8 Push to repo + mark ✅

### Task 4: Admin Notification Emails 🔄 IN PROGRESS
✅ 4.1 Admin trigger events identified
✅ 4.2 ADMIN_EMAIL added to Supabase secrets (anewhopeFamilycnt@gmail.com)
✅ 4.3 Admin notification calls added to stripe-webhook
✅ 4.4 Admin notification call added to send-contact-reply
✅ 4.4a New booking: pg_net trigger → admin-notify (booking_created)
✅ 4.4b New signup: handle_new_user migration → admin-notify (signup)
✅ 4.4c notify-admin-booking Edge Function deployed
✅ 4.4d notify-admin-signup Edge Function deployed
✅ 4.4e RESEND_FROM_EMAIL set in Supabase secrets
✅ 4.4f Valerie contact info updated: anewhopeFamilycnt@gmail.com / 323-314-1592
⬜ 4.5 Test all admin notification triggers
⬜ 4.6 Push to repo + mark ✅

---

## PHASE 6: Production Deployment 🔄 IN PROGRESS

### Task 1: Vercel Environment Variables ✅ COMPLETE
✅ All VITE_ vars added and verified

### Task 2: Custom Domain ✅ COMPLETE
✅ valeriemunozpsyc.com live and resolving

### Task 3: SSL Certificate ✅ COMPLETE
✅ HTTPS confirmed on www.valeriemunozpsyc.com
⬜ 3.3 Check mixed content warnings in browser console
⬜ 3.4 Push + mark ✅

### Task 4: Account Security 🔄 IN PROGRESS
✅ 4.1 Vercel 2FA enabled
✅ 4.2 Passkey saved for Vercel
⬜ 4.3 Enable 2FA on Namecheap
⬜ 4.4 Enable 2FA on Supabase
⬜ 4.5 Enable 2FA on GitHub

### Task 5: Social Media Icons ❌ NOT STARTED
❌ 5.1 Confirm Valerie social media URLs
❌ 5.2 Update footer social icons with real URLs
❌ 5.3 Hide icons where account does not exist
❌ 5.4 Verify all links open in new tab with rel="noopener"
❌ 5.5 Push + mark ✅

### Task 6: Analytics (PostHog) ❌ NOT STARTED
❌ 6.1 Create PostHog account
❌ 6.2 Select HIPAA plan + sign BAA
❌ 6.3 Install posthog-js
❌ 6.4 Add VITE_POSTHOG_KEY to .env.local + Vercel
❌ 6.5 Initialize PostHog in main.jsx
❌ 6.6 Verify events firing
❌ 6.7 Push + mark ✅

### Task 7: Performance Audit ❌ NOT STARTED
❌ 7.1 Run Lighthouse in Chrome DevTools
❌ 7.2 Run PageSpeed Insights on live URL
❌ 7.3 Fix Vite deprecation warnings
❌ 7.4 Fix image optimization
❌ 7.5 Add lazy loading to heavy components
❌ 7.6 Reduce JS bundle size
❌ 7.7 Re-run Lighthouse — target 90+
❌ 7.8 Push + mark ✅

### Task 8: SEO Audit ❌ NOT STARTED
❌ 8.1 Audit index.html — title, description, OG tags
❌ 8.2 Add per-page meta tags
❌ 8.3 Verify Open Graph preview
❌ 8.4 Generate sitemap.xml
❌ 8.5 Submit sitemap to Google Search Console
❌ 8.6 Add Schema.org JSON-LD
❌ 8.7 Push + mark ✅

### Task 9: Smoke Test ✅ COMPLETE
✅ All 5 key routes verified on live domain

---

## PHASE 7: QA Testing ❌ NOT STARTED
❌ Agent 3 — Unit Tests (Vitest)
❌ Agent 4 — E2E Tests (Playwright)
❌ Agent 5 — Security (RLS + XSS + CSRF)
❌ Agent 6 — Error Boundaries + 404
❌ Agent 7 — SEO Agent
❌ Agent 8 — Mobile + a11y + cross-browser
❌ Agent 9 — Performance + load testing

---

## PHASE 8: Security Hardening ❌ NOT STARTED
❌ Agent 10 — Rate Limiting
❌ Agent 11 — Secrets Scanner
❌ Agent 12 — Env Var Hardening
❌ Agent 13 — Input Sanitization
❌ Agent 14 — Full Security Audit + Report

---

## AUDIT LOG
| Date | Action | Result |
|------|--------|--------|
| Apr 27 | Set ADMIN_EMAIL + RESEND_FROM_EMAIL in Supabase secrets | ✅ |
| Apr 27 | Updated contact email → anewhopeFamilycnt@gmail.com | ✅ |
| Apr 27 | Updated contact phone → 323-314-1592 | ✅ |
| Apr 27 | Vercel redeploy triggered | ⬜ Pending |
| Apr 27 | Contact form end-to-end test | ⬜ Pending |

---
*Rule: After every task → mark ✅ + push. After every phase → Chain of Prompt audit.*
*Last updated: Apr 27 — Phase 5 Task 3/4 testing in progress.*
