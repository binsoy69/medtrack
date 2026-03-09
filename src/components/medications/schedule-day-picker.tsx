"use client";

import { DAYS_OF_WEEK } from "@/lib/constants";

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

interface ScheduleDayPickerProps {
  value: string[];
  onChange: (days: string[]) => void;
  error?: string;
}

export function ScheduleDayPicker({
  value,
  onChange,
  error,
}: ScheduleDayPickerProps) {
  const toggle = (day: string) => {
    if (value.includes(day)) {
      onChange(value.filter((d) => d !== day));
    } else {
      onChange([...value, day]);
    }
  };

  const selectAll = () => {
    onChange([...DAYS_OF_WEEK]);
  };

  const selectWeekdays = () => {
    onChange(["monday", "tuesday", "wednesday", "thursday", "friday"]);
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {DAYS_OF_WEEK.map((day) => {
          const selected = value.includes(day);
          return (
            <button
              key={day}
              type="button"
              onClick={() => toggle(day)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors min-w-[3.25rem] ${
                selected
                  ? "bg-teal-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {DAY_LABELS[day]}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
        >
          Every day
        </button>
        <span className="text-xs text-slate-300">|</span>
        <button
          type="button"
          onClick={selectWeekdays}
          className="text-xs text-teal-600 hover:text-teal-700 font-medium"
        >
          Weekdays
        </button>
      </div>

      {error && (
        <p className="text-[0.8rem] font-medium text-red-500">{error}</p>
      )}
    </div>
  );
}
