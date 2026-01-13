-- Test seed data for local verification

INSERT INTO practitioners (
  id, display_name, public_slug, timezone, email, is_active
) VALUES (
  'pract-001', 'Dr. Valerie Wellness', 'valerie-wellness', 'America/Los_Angeles',
  'valerie@example.com', 1
);

INSERT INTO service_types (
  id, practitioner_id, name, description, duration_minutes, price_cents, is_active
) VALUES (
  'serv-001', 'pract-001', 'Initial Consultation', 'Holistic intake session', 60, 15000, 1
);

INSERT INTO availability_rules (
  id, practitioner_id, day_of_week, start_time, end_time, is_active
) VALUES (
  'rule-001', 'pract-001', 1, '09:00:00', '12:00:00', 1  -- Mondays 9am-12pm
);

INSERT INTO bookings (
  id, practitioner_id, service_type_id, client_name, client_email,
  start_at, end_at, status, notes
) VALUES (
  'book-001', 'pract-001', 'serv-001', 'Jane Doe', 'jane@example.com',
  '2026-01-20T10:00:00Z', '2026-01-20T11:00:00Z', 'confirmed', 'First session anxiety focus'
);