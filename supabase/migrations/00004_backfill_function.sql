-- Backfill function: applies missed deductions for a single medication.
-- Called from the Next.js server action with pre-calculated deductions.
-- Runs in a single transaction: updates quantity + last_deduction_date,
-- inserts all deduction_log rows with type='auto-backfill'.

CREATE OR REPLACE FUNCTION perform_backfill(
  p_medication_id UUID,
  p_deductions JSONB
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_entry JSONB;
  v_last_date DATE;
  v_final_quantity NUMERIC;
BEGIN
  -- If no deductions to apply, exit early
  IF jsonb_array_length(p_deductions) = 0 THEN
    RETURN;
  END IF;

  -- Get the final state from the last entry
  v_last_date := (p_deductions->>(jsonb_array_length(p_deductions) - 1))::jsonb->>'date';
  v_final_quantity := ((p_deductions->>(jsonb_array_length(p_deductions) - 1))::jsonb->>'quantity_after')::NUMERIC;

  -- Update the medication with final quantity and last deduction date
  UPDATE medications
  SET quantity = v_final_quantity,
      last_deduction_date = v_last_date,
      updated_at = now()
  WHERE id = p_medication_id;

  -- Insert all deduction log entries
  FOR v_entry IN SELECT * FROM jsonb_array_elements(p_deductions)
  LOOP
    INSERT INTO deduction_logs (
      medication_id,
      deduction_date,
      amount_deducted,
      quantity_after,
      type
    ) VALUES (
      p_medication_id,
      (v_entry->>'date')::DATE,
      (v_entry->>'amount_deducted')::NUMERIC,
      (v_entry->>'quantity_after')::NUMERIC,
      'auto-backfill'
    );
  END LOOP;
END;
$$;
