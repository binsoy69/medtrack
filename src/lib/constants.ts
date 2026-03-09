export const UNIT_TYPES = [
  "pills",
  "capsules",
  "mL",
  "mg",
  "patches",
  "tablets",
  "drops",
  "units",
] as const;

export const FREQUENCIES = [
  { value: "once_daily", label: "Once daily", multiplier: 1 },
  { value: "twice_daily", label: "Twice daily", multiplier: 2 },
  { value: "three_times_daily", label: "Three times daily", multiplier: 3 },
] as const;

export const DAYS_OF_WEEK = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

export const DEFAULT_LOW_STOCK_THRESHOLD = 7;
export const MAX_PROFILES_PER_USER = 5;
export const DEDUCTION_LOG_PAGE_SIZE = 30;
