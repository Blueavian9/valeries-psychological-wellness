-- 0004_practitioner_columns.sql
-- Production fix: add missing practitioner columns

PRAGMA foreign_keys = ON;

ALTER TABLE practitioners ADD COLUMN email TEXT;
ALTER TABLE practitioners ADD COLUMN is_active INTEGER NOT NULL DEFAULT 1;

CREATE UNIQUE INDEX IF NOT EXISTS idx_practitioners_email
  ON practitioners(email)
  WHERE email IS NOT NULL;
