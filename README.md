# 🧠 Holistic Therapy Booking Platform

> A full-stack production web application built for a real therapist client.  
> Live at **[valeriemunozpsyc.com](https://www.valeriemunozpsyc.com)**

---

## 🔴 Live Demo

👉 **[www.valeriemunozpsyc.com](https://www.valeriemunozpsyc.com)**

**Test the full booking flow:**
1. Visit the site → click **Book Appointment**
2. Select a service and therapist
3. Enter details and pay with Stripe test card:
   ```
   Card: 4242 4242 4242 4242
   Exp:  Any future date
   CVC:  Any 3 digits
   ```
4. Receive a confirmation email instantly ✅

---

## 📸 Screenshots

> Homepage | Booking Flow | Confirmation Email

*(Add 2–3 screenshots here)*

---

## 🧩 What It Does

A production-ready therapy booking platform that lets patients:
- Browse available therapists and services
- Book appointments with a multi-step form
- Pay securely via Stripe
- Receive automated confirmation and reminder emails

And lets the therapist/admin:
- View and manage all appointments via a protected dashboard
- Receive admin notifications on every new booking and signup
- Manage role-based access (client / therapist / admin)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend | Supabase Edge Functions (Deno) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth — role-based (client / therapist / admin) |
| Payments | Stripe — card payments + webhooks |
| Email | Resend — transactional email |
| Deployment | Vercel (frontend) + Supabase (backend) |
| Domain | Namecheap — valeriemunozpsyc.com |

---

## ⚙️ Architecture

```
User → React Frontend (Vercel)
         ↓
      Supabase Auth (JWT + RBAC)
         ↓
      Supabase DB (PostgreSQL + RLS)
         ↓
      Edge Functions (Deno)
         ├── create-payment-intent → Stripe API
         ├── stripe-webhook → payment confirmed
         ├── send-email → Resend (booking confirmation)
         ├── send-reminder → pg_cron (24hr reminders)
         └── notify-admin → new bookings + signups
```

---

## ✅ Features Shipped

- [x] Multi-step booking form with service + therapist selection
- [x] Stripe payment integration with webhook confirmation
- [x] Automated booking confirmation email (Resend)
- [x] 24-hour appointment reminder emails (pg_cron)
- [x] Admin notification on every new booking and signup
- [x] Role-based auth — client / therapist / admin
- [x] Protected dashboard with session management
- [x] Contact form with auto-reply
- [x] Custom domain with SSL (valeriemunozpsyc.com)
- [x] Full CI/CD via Vercel (auto-deploy on push)

---

## 🚀 Running Locally

```bash
# Clone the repo
git clone https://github.com/Blueavian9/valeries-psychological-wellness.git
cd valeries-psychological-wellness

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase + Stripe + Resend keys

# Start dev server
npm run dev
```

### Required Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
├── hooks/
│   ├── useAuth.jsx          # Auth + role management
│   └── useAppointments.jsx  # Appointment data layer
├── pages/
│   ├── BookingPage.jsx      # 5-step booking flow
│   ├── Dashboard.jsx        # Protected admin/therapist view
│   ├── LoginPage.jsx
│   ├── SignUpPage.jsx
│   └── BookingConfirmation.jsx
└── lib/
    └── supabase.js          # Supabase client

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

## 👤 Built For

**Valerie Munoz, Psy.Doc.**  
Licensed Therapist — Los Angeles, CA  
[valeriemunozpsyc.com](https://www.valeriemunozpsyc.com)

---

## 👨‍💻 Built By

**Cesar A. Aguilar** — Full Stack Engineer  
[Portfolio](https://react-tailwind-portfolio-murex.vercel.app/) · [GitHub](https://github.com/Blueavian9) · [LinkedIn](https://www.linkedin.com/in/cesar-aguilar-blueavian9/)

---

## 📄 License

Private client project. Code shared for portfolio purposes.