-- 0001_initial.sql
-- Core booking schema (MVP)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS practitioners (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  public_slug TEXT NOT NULL UNIQUE,
  timezone TEXT NOT NULL DEFAULT 'America/Los_Angeles',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS service_types (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER NOT NULL,
  price_cents INTEGER,
  currency TEXT NOT NULL DEFAULT 'USD',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_service_types_practitioner_id
  ON service_types(practitioner_id);

CREATE TABLE IF NOT EXISTS availability_rules (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  -- 0=Sun..6=Sat
  day_of_week INTEGER NOT NULL CHECK(day_of_week BETWEEN 0 AND 6),
  start_time TEXT NOT NULL, -- "09:00"
  end_time TEXT NOT NULL,   -- "17:00"
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_availability_rules_practitioner_id
  ON availability_rules(practitioner_id);

CREATE TABLE IF NOT EXISTS bookings (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  service_type_id TEXT NOT NULL,
  client_name TEXT NOT NULL,
  client_email TEXT NOT NULL,
  start_at TEXT NOT NULL, -- ISO string UTC
  end_at TEXT NOT NULL,   -- ISO string UTC
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK(status IN ('pending','confirmed','cancelled')),
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE,
  FOREIGN KEY (service_type_id) REFERENCES service_types(id) ON DELETE RESTRICT
);

CREATE INDEX IF NOT EXISTS idx_bookings_practitioner_start_at
  ON bookings(practitioner_id, start_at);

CREATE INDEX IF NOT EXISTS idx_bookings_client_email
  ON bookings(client_email);

-- Minimal audit log for HIPAA-adjacent traceability (no PHI in logs beyond ids)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_type TEXT NOT NULL CHECK(actor_type IN ('system','practitioner')),
  actor_id TEXT,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at
  ON audit_logs(created_at);
