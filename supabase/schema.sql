-- ============================================================
-- Holistic Therapy Platform — Supabase Schema
-- Created: February 2026
-- Updated: March 2026
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_net";
CREATE EXTENSION IF NOT EXISTS "pg_cron";
-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
  deposit NUMERIC(10,2) DEFAULT 0,      -- deposit amount required to book
  color TEXT,                            -- UI color for service card
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS appointments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Linked IDs (nullable — supports guest bookings)
  client_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  therapist_id UUID REFERENCES therapists(id) ON DELETE SET NULL,
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,

  -- Guest booking fields (no account required)
  client_name TEXT,
  client_email TEXT,
  client_phone TEXT,

  -- Scheduling
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,             -- nullable (legacy compat, NOT enforced)
  duration_minutes INTEGER DEFAULT 60,
  format TEXT CHECK (format IN ('video', 'phone', 'chat', 'in-person')),

  -- Status & Stripe
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
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Therapists: public read
CREATE POLICY "Anyone can view therapists" ON therapists
  FOR SELECT USING (TRUE);

-- Services: public read
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (is_active = TRUE);

-- Appointments
CREATE POLICY "Clients can view own appointments" ON appointments
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Anyone can create appointments" ON appointments  -- allows guest bookings
  FOR INSERT WITH CHECK (TRUE);

-- Contact submissions: insert only
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (TRUE);

-- Quiz results
CREATE POLICY "Users can insert quiz results" ON quiz_results
  FOR INSERT WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can view own quiz results" ON quiz_results
  FOR SELECT USING (auth.uid() = client_id);

-- Payments
CREATE POLICY "Clients can view own payments" ON payments
  FOR SELECT USING (auth.uid() = client_id);

-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
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
-- AUTO-CREATE PROFILE ON SIGNUP
-- Production: migration 20260416120000_phase5_cron_and_admin_triggers.sql
-- replaces this function to add pg_net admin signup notification (keep in sync when editing).
-- ============================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
