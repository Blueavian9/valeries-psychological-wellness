-- ============================================================
-- Holistic Therapy Platform — Neon Schema (migrated from Supabase)
-- Migrated: July 2026
-- Auth provider: Neon Auth (neon_auth.users_sync, Stack Auth-backed)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- NOTE: pg_net and pg_cron are Supabase-specific extensions used for
-- webhook calls and the reminder cron job. Neon does not ship these.
-- Reminder scheduling moves to Vercel Cron; admin-notify webhook calls
-- move to being triggered from the Vercel Function itself (not pg_net).
-- Do NOT attempt to CREATE EXTENSION pg_net / pg_cron on Neon.

-- ============================================================
-- PROFILES (extends Neon Auth's neon_auth.user)
-- ============================================================
-- CONFIRMED Jul 13 via live query against this project:
--   SELECT table_name FROM information_schema.tables WHERE table_schema = 'neon_auth';
--   -> user, session, account, organization, invitation (+ others)
-- This project runs Neon Auth's current Better Auth-backed model
-- (neon_auth.user), NOT the older neon_auth.users_sync model some
-- Neon docs pages still reference. Do not swap this back without
-- re-verifying against this project's actual neon_auth schema.
--
-- Still true either way:
--   1. neon_auth.user is managed by the Neon Auth service (via its
--      REST API / SDK), not inserted into directly by our app code.
--      No DB trigger fires "on new user" the way Supabase's
--      `on_auth_user_created` did. Profile creation must happen in
--      application code instead (see useAuth.jsx note at bottom of
--      this file) — call the upsert right after a successful sign-up.
--   2. Deletion behavior for neon_auth.user should be re-verified
--      before relying on ON DELETE CASCADE for compliance purposes
--      (HIPAA data retention rules may apply — confirm with Valerie
--      before building automatic deletion on account closure).
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES neon_auth."user"(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT DEFAULT 'client' CHECK (role IN ('client', 'therapist', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THERAPISTS
-- ============================================================
CREATE TABLE IF NOT EXISTS therapists (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  bio TEXT,
  specialties TEXT[],
  approaches TEXT[],
  session_formats TEXT[],
  price_per_session NUMERIC(10,2),
  rating NUMERIC(3,2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  next_available TIMESTAMPTZ,
  is_lgbtq_affirming BOOLEAN DEFAULT FALSE,
  is_poc_specialist BOOLEAN DEFAULT FALSE,
  is_bilingual BOOLEAN DEFAULT FALSE,
  is_faith_based BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SERVICES
-- ============================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER DEFAULT 60,
  price NUMERIC(10,2) DEFAULT 0,
  deposit NUMERIC(10,2) DEFAULT 0,
  color TEXT,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,

  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  duration_minutes INTEGER DEFAULT 60,
  format TEXT CHECK (format IN ('video', 'phone', 'chat', 'in-person')),

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  stripe_payment_intent_id TEXT UNIQUE,
  notes TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CONTACT FORM SUBMISSIONS
-- ============================================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  preferred_contact TEXT CHECK (preferred_contact IN ('email', 'phone', 'text')),
  message TEXT NOT NULL,
  newsletter_opt_in BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- THERAPIST FINDER QUIZ RESULTS
-- ============================================================
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  concerns TEXT[],
  approach TEXT,
  session_formats TEXT[],
  budget_range TEXT,
  preferences TEXT[],
  matched_therapist_ids UUID[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'usd',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Neon Auth exposes auth.user_id() once the Data API is enabled with
-- "Use Neon Auth" checked (Project → Data API page). Since this is
-- Neon's own native Auth (not a third-party provider like Auth0/
-- Clerk), the JWKS wiring is handled by that checkbox — no manual
-- JWKS URL entry needed for this project.
-- Also check "Grant public schema access" on that same Data API page
-- before/after applying this schema — it runs the GRANT statements
-- that let the `authenticated`/`anonymous` roles touch these tables
-- at all. Without that grant, these RLS policies never even get
-- evaluated (no grant = no access, regardless of policy).
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE therapists ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.user_id() = id::text);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.user_id() = id::text);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.user_id() = id::text);

-- Therapists: public read
CREATE POLICY "Anyone can view therapists" ON therapists
  FOR SELECT USING (TRUE);

-- Services: public read
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (is_active = TRUE);

-- Appointments
CREATE POLICY "Clients can view own appointments" ON appointments
  FOR SELECT USING (auth.user_id() = client_id::text);

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (TRUE);

-- Contact submissions: insert only
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (TRUE);

-- Quiz results
CREATE POLICY "Users can insert quiz results" ON quiz_results
  FOR INSERT WITH CHECK (auth.user_id() = client_id::text);

CREATE POLICY "Users can view own quiz results" ON quiz_results
  FOR SELECT USING (auth.user_id() = client_id::text);

-- Payments
CREATE POLICY "Clients can view own payments" ON payments
  FOR SELECT USING (auth.user_id() = client_id::text);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER (unchanged — pure Postgres, no auth dependency)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_profiles
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_appointments
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- PROFILE CREATION — MOVED OUT OF THE DATABASE
-- ============================================================
-- The old `handle_new_user()` + `on_auth_user_created` trigger pair
-- is REMOVED. neon_auth.users_sync is not directly insertable and is
-- populated async by Neon Auth's own sync process, so a DB trigger
-- can't reliably fire "on signup" the way it did against auth.users.
--
-- Replacement: in useAuth.jsx, immediately after a successful signup
-- (or on first authenticated session if simpler), call an upsert like:
--
--   INSERT INTO profiles (id, email, full_name)
--   VALUES ($1, $2, $3)
--   ON CONFLICT (id) DO NOTHING;
--
-- Run this from the Vercel Function / server-side auth callback, not
-- client-side, since profiles writes should go through the owner role,
-- not the RLS-restricted authenticated role.
-- ============================================================