export type Profile = {
  id: string;
  user_id: string;
  name: string;
  created_at: string;
};

export type Medication = {
  id: string;
  profile_id: string;
  name: string;
  quantity: number;
  unit_type: string;
  dosage_amount: number;
  dosage_unit: string;
  frequency: "once_daily" | "twice_daily" | "three_times_daily";
  schedule_days: string[];
  schedule_times: string[] | null;
  low_stock_threshold: number;
  last_deduction_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type DeductionLog = {
  id: string;
  medication_id: string;
  deduction_date: string;
  amount_deducted: number;
  quantity_after: number;
  type: "auto" | "auto-backfill" | "manual";
  created_at: string;
};

export type UserMetadata = {
  username: string;
  timezone: string;
  notification_email: string | null;
};

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      medications: {
        Row: Medication;
        Insert: {
          id?: string;
          profile_id: string;
          name: string;
          quantity?: number;
          unit_type: string;
          dosage_amount: number;
          dosage_unit: string;
          frequency: "once_daily" | "twice_daily" | "three_times_daily";
          schedule_days: string[];
          schedule_times?: string[] | null;
          low_stock_threshold?: number;
          last_deduction_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          name?: string;
          quantity?: number;
          unit_type?: string;
          dosage_amount?: number;
          dosage_unit?: string;
          frequency?: "once_daily" | "twice_daily" | "three_times_daily";
          schedule_days?: string[];
          schedule_times?: string[] | null;
          low_stock_threshold?: number;
          last_deduction_date?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      deduction_logs: {
        Row: DeductionLog;
        Insert: {
          id?: string;
          medication_id: string;
          deduction_date: string;
          amount_deducted: number;
          quantity_after: number;
          type: "auto" | "auto-backfill" | "manual";
          created_at?: string;
        };
        Update: {
          id?: string;
          medication_id?: string;
          deduction_date?: string;
          amount_deducted?: number;
          quantity_after?: number;
          type?: "auto" | "auto-backfill" | "manual";
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      perform_backfill: {
        Args: {
          p_medication_id: string;
          p_deductions: unknown;
        };
        Returns: undefined;
      };
    };
    Enums: Record<string, never>;
  };
}
