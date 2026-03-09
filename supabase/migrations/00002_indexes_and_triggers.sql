-- Indexes
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_medications_profile_id ON medications(profile_id);
CREATE INDEX idx_deduction_logs_medication_date ON deduction_logs(medication_id, deduction_date);

-- Trigger Function: Enforce max 5 profiles per user
CREATE OR REPLACE FUNCTION enforce_profile_limit()
RETURNS trigger AS $$
BEGIN
  IF (SELECT count(*) FROM profiles WHERE user_id = NEW.user_id) >= 5 THEN
    RAISE EXCEPTION 'Maximum of 5 profiles per user allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_profile_limit_trigger
BEFORE INSERT ON profiles
FOR EACH ROW EXECUTE FUNCTION enforce_profile_limit();

-- Trigger Function: Auto-update updated_at on medications
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_medications_updated_at
BEFORE UPDATE ON medications
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
