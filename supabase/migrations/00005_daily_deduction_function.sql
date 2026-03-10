-- Daily deduction function: runs hourly via pg_cron to deduct medications
-- for all users whose timezone "today" hasn't been processed yet.
-- Uses SECURITY DEFINER to bypass RLS since this runs as a system job.

CREATE OR REPLACE FUNCTION perform_daily_deductions()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  rec RECORD;
  v_daily_deduction NUMERIC;
  v_new_quantity NUMERIC;
BEGIN
  -- Process each medication that is due for deduction today.
  -- Joins through profiles → auth.users to get each user's timezone,
  -- then checks all conditions:
  --   1. quantity > 0
  --   2. last_deduction_date < today in user's tz (or IS NULL)
  --   3. today's day-of-week is in schedule_days
  FOR rec IN
    SELECT
      m.id AS medication_id,
      m.quantity,
      m.dosage_amount,
      m.frequency,
      (now() AT TIME ZONE COALESCE(u.raw_user_meta_data->>'timezone', 'UTC'))::date AS today_in_tz
    FROM medications m
    JOIN profiles p ON m.profile_id = p.id
    JOIN auth.users u ON p.user_id = u.id
    WHERE m.quantity > 0
      AND (
        m.last_deduction_date IS NULL
        OR m.last_deduction_date < (now() AT TIME ZONE COALESCE(u.raw_user_meta_data->>'timezone', 'UTC'))::date
      )
      AND lower(to_char(
        (now() AT TIME ZONE COALESCE(u.raw_user_meta_data->>'timezone', 'UTC'))::date, 'FMDay'
      )) = ANY(m.schedule_days)
  LOOP
    -- Calculate the daily deduction amount
    v_daily_deduction := rec.dosage_amount * (
      CASE rec.frequency
        WHEN 'once_daily' THEN 1
        WHEN 'twice_daily' THEN 2
        WHEN 'three_times_daily' THEN 3
        ELSE 1
      END
    );

    -- If quantity < daily_deduction, only deduct what's available
    IF rec.quantity < v_daily_deduction THEN
      v_daily_deduction := rec.quantity;
    END IF;

    -- Calculate new quantity, capped at 0
    v_new_quantity := GREATEST(rec.quantity - v_daily_deduction, 0);

    -- Update the medication quantity and last_deduction_date
    UPDATE medications
    SET quantity = v_new_quantity,
        last_deduction_date = rec.today_in_tz,
        updated_at = now()
    WHERE id = rec.medication_id;

    -- Insert deduction log entry
    INSERT INTO deduction_logs (
      medication_id,
      deduction_date,
      amount_deducted,
      quantity_after,
      type
    ) VALUES (
      rec.medication_id,
      rec.today_in_tz,
      v_daily_deduction,
      v_new_quantity,
      'auto'
    );
  END LOOP;
END;
$$;
