# # 🏥 Holistic Therapy Platform — PRD Migration Tracker

## Legend
| Symbol | Meaning |
|--------|---------|
| ✅ | Completed |
| 🔄 | In Progress |
| ❌ | Not Started |
| ⬜ | Empty / Skipped |

---

## PHASE SUMMARY

| Phase | Status |
|-------|--------|
| PHASE 1: Backend Setup | ✅ COMPLETED |
| PHASE 2: Authentication | ✅ COMPLETED |
| PHASE 3: Data Migration | ✅ COMPLETED |
| PHASE 4: Stripe Payments | ✅ COMPLETED |
| PHASE 5: Email Notifications | 🔄 IN PROGRESS |
| PHASE 6: Production Deployment | ❌ NOT STARTED |
| PHASE 7: QA Testing (Enterprise Level) | ❌ NOT STARTED |

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
✅ Supabase Edge Function: create-payment-intent ← deployed  
✅ Supabase Edge Function: stripe-webhook ← deployed  
✅ Wrap App with Stripe Elements provider (main.jsx)  
✅ BookingPage ← CardElement + 5-step flow  
✅ App.jsx ← routing fixed, guest booking open  
✅ FAQ.jsx ← id="faq" anchor fixed  

### Bug Fixes ✅ ALL CLEARED
✅ FAQ anchor scroll (#faq id)  
✅ Dashboard outside Header/Footer  
✅ Booking page open to guests  
✅ schema.sql ← all fields updated + committed  
✅ index.html ← SEO meta tags, Open Graph, Schema.org  
✅ Supabase CLI installed + logged in  
✅ Project linked + both Edge Functions deployed  
✅ Register webhook in Stripe Dashboard  
✅ Add STRIPE_WEBHOOK_SECRET to Supabase secrets  
✅ Rotate secret (security hygiene)  
✅ All setup tasks complete  
✅ Deploy updated stripe-webhook  
✅ Verify stripe-webhook Edge Function code fires 200  
✅ Payment confirmation UI  
✅ BookingConfirmation.jsx ← created & pushed  
✅ App.jsx — route added  
✅ BookingPage.jsx ← handlePaidBooking update completed  

---

## PHASE 5: Email Notifications 🔄 IN PROGRESS

### 📧 Task 1: Booking Confirmation Email ← NEXT
```
✅ 1.1  Create Resend account at resend.com
✅  1.2  Get Resend API key from dashboard
✅  1.3  Add RESEND_API_KEY to Supabase secrets
✅  1.4  Create supabase/functions/send-email/index.ts
❌ 1.5  Write booking confirmation HTML email template
❌ 1.6  Deploy send-email Edge Function
❌ 1.7  Update stripe-webhook to call send-email on payment_intent.succeeded
❌ 1.8  Add fallback call to send-email in BookingPage.jsx handlePaidBooking()
❌ 1.9  Test end-to-end: book → pay → confirm email received
❌ 1.10 Push to repo + mark ✅
```

### ⏰ Task 2: Appointment Reminder Email
```
❌ 2.1  Create supabase/functions/send-reminder/index.ts
❌ 2.2  Write reminder HTML email template (24hr before appointment)
❌ 2.3  Set up Supabase pg_cron job to query upcoming appointments
❌ 2.4  Cron triggers send-reminder for appointments in next 24hrs
❌ 2.5  Deploy send-reminder Edge Function
❌ 2.6  Test: create appointment → verify reminder fires correctly
❌ 2.7  Push to repo + mark ✅
```

### 📬 Task 3: Contact Form Auto-Reply
```
❌ 3.1  Audit existing ContactCTA.jsx — confirm form fields (name, email, message)
❌ 3.2  Create supabase/functions/send-contact-reply/index.ts
❌ 3.3  Write auto-reply HTML template (thank you + expected response time)
❌ 3.4  Write admin notification template (new contact form submission)
❌ 3.5  Wire ContactCTA.jsx form submit to call send-contact-reply
❌ 3.6  Deploy send-contact-reply Edge Function
❌ 3.7  Test: submit form → verify auto-reply + admin email received
❌ 3.8  Push to repo + mark ✅
```

### 🔔 Task 4: Admin Notification Emails
```
❌ 4.1  Identify all admin trigger events:
          - New booking created
          - Payment succeeded
          - Contact form submitted
          - New user signup
❌ 4.2  Add ADMIN_EMAIL to Supabase secrets
❌ 4.3  Add admin notification calls to stripe-webhook (payment events)
❌ 4.4  Add admin notification call to send-contact-reply (contact form)
❌ 4.5  Test all admin notification triggers
❌ 4.6  Push to repo + mark ✅
```

---

## PHASE 6: Production Deployment ❌ NOT STARTED

### ☁️ Task 1: Vercel Environment Variables
```
❌ 1.1  Audit all .env.local variables
❌ 1.2  Add each to Vercel dashboard → Settings → Environment Variables
❌ 1.3  Verify VITE_ prefix on all frontend-facing vars
❌ 1.4  Redeploy and smoke test
❌ 1.5  Push to repo + mark ✅
```

### 🌐 Task 2: Custom Domain
```
❌ 2.1  Purchase domain (if not already owned)
❌ 2.2  Add domain in Vercel → Settings → Domains
❌ 2.3  Update DNS records at registrar (A / CNAME)
❌ 2.4  Wait for propagation + verify green in Vercel
❌ 2.5  Push to repo + mark ✅
```

### 🔒 Task 3: SSL Certificate
```
❌ 3.1  Confirm Vercel auto-provisioned SSL (automatic)
❌ 3.2  Verify https:// loads correctly on custom domain
❌ 3.3  Check for mixed content warnings in browser console
❌ 3.4  Push to repo + mark ✅
```

### ⚡ Task 4: Performance Audit
```
❌ 4.1  Run Lighthouse audit in Chrome DevTools
❌ 4.2  Run PageSpeed Insights on live URL
❌ 4.3  Fix largest issues (image optimization, lazy loading, bundle size)
❌ 4.4  Re-run audit — target 90+ score
❌ 4.5  Push to repo + mark ✅
```

### 🔍 Task 5: SEO Meta Tags Audit
```
❌ 5.1  Audit index.html — title, description, OG tags, Schema.org (started ✅)
❌ 5.2  Add per-page meta tags for key routes (BookingPage, TherapistFinder)
❌ 5.3  Verify Open Graph preview with opengraph.xyz
❌ 5.4  Submit sitemap to Google Search Console
❌ 5.5  Push to repo + mark ✅
```

---

## PHASE 7: QA Testing (Enterprise Level) ❌ NOT STARTED

### 🧪 Task 1: Unit Tests (Vitest)
```
❌ 1.1  Install Vitest + @testing-library/react
❌ 1.2  Configure vitest.config.js
❌ 1.3  Write tests for utility functions (formatting, validation)
❌ 1.4  Write tests for custom hooks (useAuth, useAppointments)
❌ 1.5  Run + pass all unit tests
❌ 1.6  Push to repo + mark ✅
```

### 🧩 Task 2: Component Tests (React Testing Library)
```
❌ 2.1  Write tests for LoginPage (form submit, error states)
❌ 2.2  Write tests for SignUpPage
❌ 2.3  Write tests for BookingPage (step flow)
❌ 2.4  Write tests for BookingConfirmation
❌ 2.5  Run + pass all component tests
❌ 2.6  Push to repo + mark ✅
```

### 🎭 Task 3: E2E Tests (Playwright)
```
❌ 3.1  Install Playwright + configure playwright.config.ts
❌ 3.2  Write auth flow test (signup → login → logout)
❌ 3.3  Write booking flow test (select service → pay → confirm)
❌ 3.4  Write contact form test
❌ 3.5  Write protected route test (unauth redirect)
❌ 3.6  Run + pass all E2E tests
❌ 3.7  Push to repo + mark ✅
```

### 🔐 Task 4: Auth Flow Testing
```
❌ 4.1  Test login with valid credentials
❌ 4.2  Test login with invalid credentials (error handling)
❌ 4.3  Test email confirmation flow
❌ 4.4  Test password reset flow
❌ 4.5  Test role-based redirects (client / therapist / admin)
❌ 4.6  Push to repo + mark ✅
```

### 💳 Task 5: Payment Flow Testing
```
❌ 5.1  Test full booking → Stripe test card → confirmation
❌ 5.2  Test declined card handling
❌ 5.3  Test webhook fires + DB record created
❌ 5.4  Test BookingConfirmation.jsx renders correctly
❌ 5.5  Push to repo + mark ✅
```

### 📱 Task 6: Mobile Responsiveness
```
❌ 6.1  Test all pages on iPhone SE (375px)
❌ 6.2  Test all pages on iPhone 14 (390px)
❌ 6.3  Test all pages on iPad (768px)
❌ 6.4  Fix any layout breaks found
❌ 6.5  Push to repo + mark ✅
```

### 🌍 Task 7: Cross-Browser Testing
```
❌ 7.1  Test on Chrome
❌ 7.2  Test on Firefox
❌ 7.3  Test on Safari
❌ 7.4  Test on Edge
❌ 7.5  Fix any browser-specific issues
❌ 7.6  Push to repo + mark ✅
```

### ♿ Task 8: Accessibility Audit (WCAG 2.1 AA)
```
❌ 8.1  Install axe DevTools Chrome extension
❌ 8.2  Run audit on all key pages
❌ 8.3  Fix critical violations (color contrast, missing alt text, labels)
❌ 8.4  Test keyboard navigation on all interactive elements
❌ 8.5  Test with screen reader (VoiceOver / NVDA)
❌ 8.6  Re-run audit — zero critical violations
❌ 8.7  Push to repo + mark ✅
```

### 🏋️ Task 9: Load Testing
```
❌ 9.1  Set up k6 or Artillery load test script
❌ 9.2  Simulate 100 concurrent users
❌ 9.3  Test booking flow under load
❌ 9.4  Review Supabase dashboard for query performance
❌ 9.5  Fix any bottlenecks found
❌ 9.6  Push to repo + mark ✅
```

### 🛡️ Task 10: Security Audit
```
❌ 10.1  Audit all RLS policies in Supabase (appointments, profiles, services)
❌ 10.2  Verify no API keys exposed in client-side code
❌ 10.3  Check all env vars are server-side where needed
❌ 10.4  Test XSS: inject script tags into form inputs
❌ 10.5  Test CSRF: verify Edge Functions reject unauthorized origins
❌ 10.6  Run npm audit — fix critical vulnerabilities
❌ 10.7  Push to repo + mark ✅
```

### 🚨 Task 11: Error Boundary Testing
```
❌ 11.1  Add React ErrorBoundary component (if not already present)
❌ 11.2  Test Stripe failure → graceful error UI
❌ 11.3  Test Supabase offline → graceful error UI
❌ 11.4  Test invalid route → 404 page renders
❌ 11.5  Push to repo + mark ✅
```

### 🔄 Task 12: 404 / Edge Case Handling
```
❌ 12.1  Create NotFound.jsx (404 page)
❌ 12.2  Add catch-all route in App.jsx
❌ 12.3  Test direct URL access to protected routes
❌ 12.4  Test expired session behavior
❌ 12.5  Test booking with no services available
❌ 12.6  Push to repo + mark ✅
```

---

*Last updated: Phase 5 → Task 1 → Step 1.1 in progress*

---

```bash
git add .
git commit -m "feat: EPIC 10 — Therapist Finder matching quiz"
git push origin main
```

Access the quiz at: **valeriemunozpsyc.com/find-therapist**