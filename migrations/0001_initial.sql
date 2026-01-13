-- 0001_initial.sql
-- Core schema for Holistic Psychology Booking Platform (D1 / SQLite)
-- Principles:
-- - No PHI columns
-- - No client passwords
-- - Auditable writes via audit_logs

PRAGMA foreign_keys = ON;

BEGIN TRANSACTION;

-- Practitioners
CREATE TABLE IF NOT EXISTS practitioners (
  id TEXT PRIMARY KEY,
  display_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  public_bio TEXT DEFAULT NULL,
  timezone TEXT NOT NULL DEFAULT 'UTC',
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Availability slots
CREATE TABLE IF NOT EXISTS availability (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  is_bookable INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE,
  CHECK (end_at > start_at)
);

-- Appointments (minimal contact fields only)
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  start_at TEXT NOT NULL,
  end_at TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'booked', -- booked|canceled|completed
  client_email TEXT NOT NULL,
  client_name TEXT DEFAULT NULL,
  client_timezone TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  canceled_at TEXT DEFAULT NULL,
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE,
  CHECK (end_at > start_at)
);

-- Audit logs (no PHI; keep metadata minimal)
CREATE TABLE IF NOT EXISTS audit_logs (
  id TEXT PRIMARY KEY,
  actor_type TEXT NOT NULL,          -- practitioner|system|client
  actor_id TEXT DEFAULT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  entity_id TEXT DEFAULT NULL,
  metadata_json TEXT DEFAULT NULL,
  request_id TEXT DEFAULT NULL,
  ip_hash TEXT DEFAULT NULL,
  user_agent_hash TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_availability_practitioner_start
  ON availability(practitioner_id, start_at);

CREATE INDEX IF NOT EXISTS idx_availability_practitioner_end
  ON availability(practitioner_id, end_at);

CREATE INDEX IF NOT EXISTS idx_appointments_practitioner_start
  ON appointments(practitioner_id, start_at);

CREATE INDEX IF NOT EXISTS idx_appointments_status
  ON appointments(status);

CREATE INDEX IF NOT EXISTS idx_audit_created_at
  ON audit_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_audit_entity
  ON audit_logs(entity, entity_id);

-- Prevent exact duplicate slot bookings (conflict checks handled in API later)
CREATE UNIQUE INDEX IF NOT EXISTS uq_appointments_practitioner_exact_slot
  ON appointments(practitioner_id, start_at, end_at);

COMMIT;
