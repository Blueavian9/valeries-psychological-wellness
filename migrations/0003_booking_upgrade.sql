-- 0003_booking_upgrade.sql
PRAGMA foreign_keys = ON;

-- Add practitioner email and active flag
ALTER TABLE practitioners ADD COLUMN email TEXT;
ALTER TABLE practitioners ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_practitioners_email
  ON practitioners(email)
  WHERE email IS NOT NULL;

-- Ensure audit_logs has metadata_json default
ALTER TABLE audit_logs ADD COLUMN metadata_json TEXT NOT NULL DEFAULT '{}';
