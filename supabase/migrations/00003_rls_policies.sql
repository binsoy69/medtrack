-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE medications ENABLE ROW LEVEL SECURITY;
ALTER TABLE deduction_logs ENABLE ROW LEVEL SECURITY;

-- Helper Function: Check profile ownership
CREATE OR REPLACE FUNCTION public.is_owner_of_profile(p_profile_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = p_profile_id 
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Profiles Policies
CREATE POLICY "Users can view their own profiles"
  ON profiles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profiles"
  ON profiles FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profiles"
  ON profiles FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own profiles"
  ON profiles FOR DELETE
  USING (user_id = auth.uid());

-- Medications Policies
CREATE POLICY "Users can view their own medications"
  ON medications FOR SELECT
  USING (public.is_owner_of_profile(profile_id));

CREATE POLICY "Users can insert their own medications"
  ON medications FOR INSERT
  WITH CHECK (public.is_owner_of_profile(profile_id));

CREATE POLICY "Users can update their own medications"
  ON medications FOR UPDATE
  USING (public.is_owner_of_profile(profile_id));

CREATE POLICY "Users can delete their own medications"
  ON medications FOR DELETE
  USING (public.is_owner_of_profile(profile_id));

-- Deduction Logs Policies
CREATE POLICY "Users can view deduction logs for their medications"
  ON deduction_logs FOR SELECT
  USING (medication_id IN (
    SELECT id FROM medications WHERE public.is_owner_of_profile(profile_id)
  ));

CREATE POLICY "Users can insert deduction logs for their medications"
  ON deduction_logs FOR INSERT
  WITH CHECK (medication_id IN (
    SELECT id FROM medications WHERE public.is_owner_of_profile(profile_id)
  ));
