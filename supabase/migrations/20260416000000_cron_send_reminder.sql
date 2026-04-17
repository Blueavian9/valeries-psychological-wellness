-- Hourly pg_cron job: invoke send-reminder Edge Function via pg_net.
-- Before applying: replace YOUR_PROJECT_REF with your Supabase project ref (Settings → API → Project URL)
-- and YOUR_SERVICE_ROLE_JWT with the service_role key (Settings → API). Do not commit real secrets.

DO $$
DECLARE
  jid bigint;
BEGIN
  SELECT jobid INTO jid FROM cron.job WHERE jobname = 'invoke-send-reminder-hourly' LIMIT 1;
  IF jid IS NOT NULL THEN
    PERFORM cron.unschedule(jid);
  END IF;
END;
$$;

SELECT cron.schedule(
  'invoke-send-reminder-hourly',
  '0 * * * *',
  $cron$
  SELECT net.http_post(
    url := 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-reminder',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer YOUR_SERVICE_ROLE_JWT'
    ),
    body := '{}'::jsonb
  ) AS request_id;
  $cron$
);
