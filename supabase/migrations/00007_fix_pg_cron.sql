-- Fix pg_cron setup for daily deductions.
--
-- IMPORTANT: pg_cron must be enabled manually in Supabase Dashboard:
--   Database → Extensions → search "pg_cron" → Enable
-- This migration is a no-op if pg_cron is not enabled.
--
-- Safely (re)register the cron job, replacing any existing job with the same name.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    -- Remove existing job if it exists, then recreate
    PERFORM cron.unschedule('daily-med-deductions');
  END IF;
EXCEPTION
  WHEN others THEN
    NULL; -- pg_cron not enabled, skip silently
END;
$$;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_extension WHERE extname = 'pg_cron'
  ) THEN
    PERFORM cron.schedule(
      'daily-med-deductions',
      '0 * * * *',
      'SELECT perform_daily_deductions()'
    );
  END IF;
EXCEPTION
  WHEN others THEN
    NULL;
END;
$$;
