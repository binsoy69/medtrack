import { addDays, differenceInCalendarDays } from "date-fns";
import { calculateDailyDeduction, isScheduledDay } from "./deduction";

/**
 * Calculate the date when the medication will run out.
 * Iterates forward from fromDate, deducting on scheduled days.
 * Returns null if already out of stock.
 */
export function calculateRunOutDate(
  currentQuantity: number,
  dosageAmount: number,
  frequency: string,
  scheduleDays: string[],
  fromDate: Date
): Date | null {
  if (currentQuantity <= 0) return null;
  if (scheduleDays.length === 0) return null;

  const dailyAmount = calculateDailyDeduction(dosageAmount, frequency);
  if (dailyAmount <= 0) return null;

  let remaining = currentQuantity;
  let cursor = fromDate;

  // Safety limit: 10 years out
  const maxDays = 3650;
  for (let i = 0; i < maxDays; i++) {
    cursor = addDays(fromDate, i);
    if (isScheduledDay(cursor, scheduleDays)) {
      remaining -= dailyAmount;
      if (remaining <= 0) {
        return cursor;
      }
    }
  }

  // Extremely far out — return the last date checked
  return cursor;
}

/**
 * Calculate the number of calendar days until the medication runs out.
 * Returns 0 if already out of stock.
 */
export function daysUntilRunOut(
  currentQuantity: number,
  dosageAmount: number,
  frequency: string,
  scheduleDays: string[],
  fromDate: Date
): number {
  if (currentQuantity <= 0) return 0;

  const runOutDate = calculateRunOutDate(
    currentQuantity,
    dosageAmount,
    frequency,
    scheduleDays,
    fromDate
  );

  if (!runOutDate) return 0;
  return differenceInCalendarDays(runOutDate, fromDate);
}
