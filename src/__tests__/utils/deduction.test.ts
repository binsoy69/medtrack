import { describe, it, expect } from "vitest";
import {
  calculateDailyDeduction,
  isScheduledDay,
  calculateBackfillDeductions,
} from "@/lib/utils/deduction";

describe("calculateDailyDeduction", () => {
  it("returns dosageAmount × 1 for once_daily", () => {
    expect(calculateDailyDeduction(1, "once_daily")).toBe(1);
  });

  it("returns dosageAmount × 2 for twice_daily", () => {
    expect(calculateDailyDeduction(2, "twice_daily")).toBe(4);
  });

  it("returns dosageAmount × 3 for three_times_daily", () => {
    expect(calculateDailyDeduction(5, "three_times_daily")).toBe(15);
  });

  it("defaults multiplier to 1 for unknown frequency", () => {
    expect(calculateDailyDeduction(3, "unknown_freq")).toBe(3);
  });
});

describe("isScheduledDay", () => {
  it("returns true for a scheduled Monday", () => {
    // 2026-03-09 is a Monday
    expect(isScheduledDay(new Date(2026, 2, 9), ["monday"])).toBe(true);
  });

  it("returns true for a scheduled Friday", () => {
    // 2026-03-13 is a Friday
    expect(isScheduledDay(new Date(2026, 2, 13), ["friday"])).toBe(true);
  });

  it("returns false for an unscheduled Saturday", () => {
    // 2026-03-14 is a Saturday
    expect(
      isScheduledDay(new Date(2026, 2, 14), ["monday", "wednesday", "friday"])
    ).toBe(false);
  });

  it("returns true when all days are scheduled", () => {
    const allDays = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    // Any day should match
    expect(isScheduledDay(new Date(2026, 2, 10), allDays)).toBe(true); // Tuesday
    expect(isScheduledDay(new Date(2026, 2, 15), allDays)).toBe(true); // Sunday
  });

  it("returns false when no days are scheduled", () => {
    expect(isScheduledDay(new Date(2026, 2, 10), [])).toBe(false);
  });
});

describe("calculateBackfillDeductions", () => {
  it("returns empty array when lastDeductionDate is null", () => {
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: null,
        scheduleDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        dosageAmount: 1,
        frequency: "once_daily",
        quantity: 100,
      },
      new Date(2026, 2, 10)
    );
    expect(result).toEqual([]);
  });

  it("returns empty array when lastDeductionDate is today", () => {
    const today = new Date(2026, 2, 10);
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-10",
        scheduleDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        dosageAmount: 1,
        frequency: "once_daily",
        quantity: 100,
      },
      today
    );
    expect(result).toEqual([]);
  });

  it("backfills 3 missed weekdays for a Mon-Fri medication", () => {
    // Last deduction: Friday 2026-03-06
    // Today: Tuesday 2026-03-10
    // Missed: Mon 3/9, Tue 3/10 (Sat 3/7 and Sun 3/8 are skipped)
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-06",
        scheduleDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        dosageAmount: 2,
        frequency: "once_daily",
        quantity: 20,
      },
      new Date(2026, 2, 10) // Tuesday
    );

    expect(result).toHaveLength(2);
    expect(result[0].amountDeducted).toBe(2);
    expect(result[0].quantityAfter).toBe(18);
    expect(result[1].amountDeducted).toBe(2);
    expect(result[1].quantityAfter).toBe(16);
  });

  it("skips weekends for weekday-only medication", () => {
    // Last deduction: Friday 2026-03-13
    // Today: Monday 2026-03-16
    // Sat 3/14 and Sun 3/15 are not scheduled
    // Only Mon 3/16 is deducted
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-13",
        scheduleDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        dosageAmount: 1,
        frequency: "once_daily",
        quantity: 10,
      },
      new Date(2026, 2, 16) // Monday
    );

    expect(result).toHaveLength(1);
    expect(result[0].quantityAfter).toBe(9);
  });

  it("caps quantity at 0 and stops deducting", () => {
    // 3 pills left, 2 per day, Mon-Fri
    // Last deduction: Mon 2026-03-09
    // Today: Thu 2026-03-12
    // Tue 3/10: deduct 2 → 1 remaining
    // Wed 3/11: deduct 1 (capped) → 0
    // Thu 3/12: skip (quantity is 0)
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-09",
        scheduleDays: ["monday", "tuesday", "wednesday", "thursday", "friday"],
        dosageAmount: 2,
        frequency: "once_daily",
        quantity: 3,
      },
      new Date(2026, 2, 12)
    );

    expect(result).toHaveLength(2);
    expect(result[0].amountDeducted).toBe(2);
    expect(result[0].quantityAfter).toBe(1);
    expect(result[1].amountDeducted).toBe(1); // only 1 left
    expect(result[1].quantityAfter).toBe(0);
  });

  it("handles twice_daily frequency correctly", () => {
    // 10 pills, 2 pills twice daily = 4 per day
    // Last deduction: Mon 2026-03-09
    // Today: Tue 2026-03-10 (all days scheduled)
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-09",
        scheduleDays: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
        dosageAmount: 2,
        frequency: "twice_daily",
        quantity: 10,
      },
      new Date(2026, 2, 10)
    );

    expect(result).toHaveLength(1);
    expect(result[0].amountDeducted).toBe(4);
    expect(result[0].quantityAfter).toBe(6);
  });

  it("returns empty when no scheduled days between last deduction and today", () => {
    // Only scheduled on Monday, last deduction was Monday
    // Today is Wednesday — Tue and Wed are not scheduled
    const result = calculateBackfillDeductions(
      {
        lastDeductionDate: "2026-03-09", // Monday
        scheduleDays: ["monday"],
        dosageAmount: 1,
        frequency: "once_daily",
        quantity: 10,
      },
      new Date(2026, 2, 11) // Wednesday
    );

    expect(result).toHaveLength(0);
  });
});
