import { addDays, format } from "date-fns";
import { FREQUENCIES } from "@/lib/constants";

/**
 * Calculate the total daily deduction amount based on dosage and frequency.
 * Returns dosageAmount × frequency multiplier.
 */
export function calculateDailyDeduction(
  dosageAmount: number,
  frequency: string
): number {
  const freq = FREQUENCIES.find((f) => f.value === frequency);
  const multiplier = freq?.multiplier ?? 1;
  return dosageAmount * multiplier;
}

/**
 * Check whether a given date falls on one of the scheduled days.
 */
export function isScheduledDay(date: Date, scheduleDays: string[]): boolean {
  const dayName = format(date, "EEEE").toLowerCase();
  return scheduleDays.includes(dayName);
}

export interface BackfillInput {
  lastDeductionDate: string | null;
  scheduleDays: string[];
  dosageAmount: number;
  frequency: string;
  quantity: number;
}

export interface BackfillEntry {
  date: Date;
  amountDeducted: number;
  quantityAfter: number;
}

/**
 * Calculate missed deductions between lastDeductionDate and today (inclusive).
 * Iterates from lastDeductionDate + 1 day through today.
 * Only deducts on scheduled days. Caps quantity at 0.
 */
export function calculateBackfillDeductions(
  medication: BackfillInput,
  today: Date
): BackfillEntry[] {
  let lastDate: Date;
  if (!medication.lastDeductionDate) {
    // If no last deduction date, process starting from today
    lastDate = addDays(today, -1);
  } else {
    lastDate = new Date(medication.lastDeductionDate + "T00:00:00");
  }

  // If last deduction is today or in the future, nothing to backfill
  if (lastDate >= today) return [];

  const dailyAmount = calculateDailyDeduction(
    medication.dosageAmount,
    medication.frequency
  );

  const entries: BackfillEntry[] = [];
  let currentQuantity = medication.quantity;
  let cursor = addDays(lastDate, 1);

  while (cursor <= today) {
    if (isScheduledDay(cursor, medication.scheduleDays) && currentQuantity > 0) {
      const deducted = Math.min(dailyAmount, currentQuantity);
      currentQuantity = Math.max(0, currentQuantity - dailyAmount);

      entries.push({
        date: new Date(cursor),
        amountDeducted: deducted,
        quantityAfter: currentQuantity,
      });
    }
    cursor = addDays(cursor, 1);
  }

  return entries;
}
