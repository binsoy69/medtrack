"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { calculateRunOutDate, daysUntilRunOut } from "@/lib/utils/forecast";

interface ForecastDisplayProps {
  quantity: number;
  dosageAmount: number;
  frequency: string;
  scheduleDays: string[];
}

export function ForecastDisplay({
  quantity,
  dosageAmount,
  frequency,
  scheduleDays,
}: ForecastDisplayProps) {
  const today = useMemo(() => new Date(), []);

  const runOutDate = useMemo(
    () =>
      calculateRunOutDate(quantity, dosageAmount, frequency, scheduleDays, today),
    [quantity, dosageAmount, frequency, scheduleDays, today]
  );

  const daysLeft = useMemo(
    () =>
      daysUntilRunOut(quantity, dosageAmount, frequency, scheduleDays, today),
    [quantity, dosageAmount, frequency, scheduleDays, today]
  );

  if (quantity <= 0) {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-4 h-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
        Out of Stock
      </div>
    );
  }

  if (!runOutDate) {
    return (
      <span className="text-sm text-slate-400 italic">No forecast available</span>
    );
  }

  const isUrgent = daysLeft <= 7;

  return (
    <div
      className={`flex items-center gap-2 text-sm font-medium ${
        isUrgent ? "text-amber-600" : "text-slate-600"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-4 h-4"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
        />
      </svg>
      <span>
        Runs out: {format(runOutDate, "MMM d")}
        <span className="text-xs ml-1 opacity-75">
          (~{daysLeft} day{daysLeft !== 1 ? "s" : ""})
        </span>
      </span>
    </div>
  );
}
