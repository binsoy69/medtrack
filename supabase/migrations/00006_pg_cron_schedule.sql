-- Enable the pg_cron extension for scheduling recurring jobs.
-- Note: pg_cron is pre-installed on Supabase but needs to be enabled.
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule the daily deduction function to run every hour.
-- Running hourly ensures all timezones are covered as each timezone's
-- "today" rolls over at a different UTC hour.
-- Example: Asia/Manila (UTC+8) midnight = 16:00 UTC previous day.
SELECT cron.schedule(
  'daily-med-deductions',
  '0 * * * *',
  'SELECT perform_daily_deductions()'
);
