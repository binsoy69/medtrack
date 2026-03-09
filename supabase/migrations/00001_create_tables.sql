CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE medications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL DEFAULT 0,
  unit_type TEXT NOT NULL,
  dosage_amount NUMERIC NOT NULL,
  dosage_unit TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('once_daily', 'twice_daily', 'three_times_daily')),
  schedule_days TEXT[] NOT NULL,
  schedule_times TEXT[],
  low_stock_threshold NUMERIC NOT NULL DEFAULT 7,
  last_deduction_date DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE deduction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  medication_id UUID REFERENCES medications ON DELETE CASCADE NOT NULL,
  deduction_date DATE NOT NULL,
  amount_deducted NUMERIC NOT NULL,
  quantity_after NUMERIC NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('auto', 'auto-backfill', 'manual')),
  created_at TIMESTAMPTZ DEFAULT now()
);
