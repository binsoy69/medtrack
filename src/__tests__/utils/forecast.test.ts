import { describe, it, expect } from "vitest";
import { format } from "date-fns";
import { calculateRunOutDate, daysUntilRunOut } from "@/lib/utils/forecast";

const ALL_DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

describe("calculateRunOutDate", () => {
  it("returns correct date for 14 pills at 2/day daily", () => {
    // 14 / 2 = 7 scheduled days → runs out on day 7
    const from = new Date(2026, 2, 10); // Tuesday
    const result = calculateRunOutDate(14, 2, "once_daily", ALL_DAYS, from);
    expect(result).not.toBeNull();
    // Day 0 = Mar 10 (deduct 2 → 12), Day 1 = Mar 11 (10), ..., Day 6 = Mar 16 (0)
    expect(format(result!, "yyyy-MM-dd")).toBe("2026-03-16");
  });

  it("accounts for weekends with Mon-Fri schedule", () => {
    // 10 pills at 2/day, Mon-Fri only
    // 10 / 2 = 5 scheduled days
    // From Tue Mar 10: Tue(8), Wed(6), Thu(4), Fri(2), [skip Sat, Sun], Mon(0)
    const from = new Date(2026, 2, 10);
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const result = calculateRunOutDate(10, 2, "once_daily", weekdays, from);
    expect(result).not.toBeNull();
    expect(format(result!, "yyyy-MM-dd")).toBe("2026-03-16"); // Monday
  });

  it("returns null when quantity is 0", () => {
    const result = calculateRunOutDate(0, 2, "once_daily", ALL_DAYS, new Date(2026, 2, 10));
    expect(result).toBeNull();
  });

  it("returns null when no schedule days", () => {
    const result = calculateRunOutDate(10, 2, "once_daily", [], new Date(2026, 2, 10));
    expect(result).toBeNull();
  });

  it("handles single-day-per-week schedule", () => {
    // 4 pills, 2/day, only Sunday
    // 4 / 2 = 2 Sundays needed
    // From Tue Mar 10: first Sun = Mar 15 (2 left), next Sun = Mar 22 (0)
    const from = new Date(2026, 2, 10);
    const result = calculateRunOutDate(4, 2, "once_daily", ["sunday"], from);
    expect(result).not.toBeNull();
    expect(format(result!, "yyyy-MM-dd")).toBe("2026-03-22");
  });

  it("handles twice_daily frequency", () => {
    // 12 pills, 1 pill twice daily = 2/day
    // 12 / 2 = 6 days
    const from = new Date(2026, 2, 10); // Tuesday
    const result = calculateRunOutDate(12, 1, "twice_daily", ALL_DAYS, from);
    expect(result).not.toBeNull();
    expect(format(result!, "yyyy-MM-dd")).toBe("2026-03-15"); // Sunday
  });
});

describe("daysUntilRunOut", () => {
  it("returns 7 for 14 pills at 2/day daily", () => {
    const from = new Date(2026, 2, 10);
    // Runs out on Mar 16 → 6 calendar days
    expect(daysUntilRunOut(14, 2, "once_daily", ALL_DAYS, from)).toBe(6);
  });

  it("returns 0 when quantity is 0", () => {
    expect(daysUntilRunOut(0, 2, "once_daily", ALL_DAYS, new Date(2026, 2, 10))).toBe(0);
  });

  it("returns correct days for weekday-only schedule", () => {
    // 10 pills at 2/day, Mon-Fri. Runs out on Mon Mar 16 → 6 calendar days
    const weekdays = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    const from = new Date(2026, 2, 10);
    expect(daysUntilRunOut(10, 2, "once_daily", weekdays, from)).toBe(6);
  });

  it("returns extended days for single-day schedule", () => {
    // 4 pills, 2/day, only Sunday. Runs out Mar 22 → 12 calendar days from Mar 10
    const from = new Date(2026, 2, 10);
    expect(daysUntilRunOut(4, 2, "once_daily", ["sunday"], from)).toBe(12);
  });
});
