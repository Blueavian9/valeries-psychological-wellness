-- Migration: 0005 - Add concrete availability slots table
-- Created: 2026-01-12
-- Purpose: Store individual bookable time slots (generated from rules or manual)

PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS availability_slots (
  id TEXT PRIMARY KEY,
  practitioner_id TEXT NOT NULL,
  rule_id TEXT,                               -- optional link to recurring rule
  start_at TEXT NOT NULL,                     -- ISO 8601 full datetime
  end_at TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' 
    CHECK(status IN ('available', 'booked', 'cancelled', 'unavailable')),
  created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  FOREIGN KEY (practitioner_id) REFERENCES practitioners(id) ON DELETE CASCADE,
  FOREIGN KEY (rule_id) REFERENCES availability_rules(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_availability_slots_practitioner_start
  ON availability_slots(practitioner_id, start_at);

CREATE INDEX IF NOT EXISTS idx_availability_slots_status
  ON availability_slots(status);