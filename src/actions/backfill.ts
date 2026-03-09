"use server";

import { createClient } from "@/lib/supabase/server";
import { toZonedTime } from "date-fns-tz";
import { format } from "date-fns";
import { calculateBackfillDeductions } from "@/lib/utils/deduction";
import type { Medication } from "@/lib/types/database";

export async function backfillDeductions(
  profileId: string,
  timezone: string
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const { data: medications, error } = await supabase
    .from("medications")
    .select("*")
    .eq("profile_id", profileId);

  if (error) return { error: error.message };
  if (!medications || medications.length === 0) return {};

  // Calculate today in the user's timezone
  const now = new Date();
  const zonedNow = toZonedTime(now, timezone);
  // Create a Date object representing midnight in user's timezone
  const todayStr = format(zonedNow, "yyyy-MM-dd");
  const today = new Date(todayStr + "T00:00:00");

  for (const med of medications as Medication[]) {
    const deductions = calculateBackfillDeductions(
      {
        lastDeductionDate: med.last_deduction_date,
        scheduleDays: med.schedule_days,
        dosageAmount: med.dosage_amount,
        frequency: med.frequency,
        quantity: med.quantity,
      },
      today
    );

    if (deductions.length === 0) continue;

    // Format deductions as JSONB for the SQL function
    const deductionsJson = deductions.map((d) => ({
      date: format(d.date, "yyyy-MM-dd"),
      amount_deducted: d.amountDeducted,
      quantity_after: d.quantityAfter,
    }));

    const { error: rpcError } = await supabase.rpc("perform_backfill", {
      p_medication_id: med.id,
      p_deductions: deductionsJson,
    });

    if (rpcError) {
      console.error(
        `Backfill failed for medication ${med.id}:`,
        rpcError.message
      );
    }
  }

  return {};
}

export async function backfillAllProfiles(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const timezone =
    (user.user_metadata as { timezone?: string })?.timezone ?? "UTC";

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  if (!profiles || profiles.length === 0) return {};

  for (const profile of profiles) {
    await backfillDeductions(profile.id, timezone);
  }

  return {};
}
