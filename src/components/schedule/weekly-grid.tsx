"use client";

import { useState } from "react";
import type { Medication } from "@/lib/types/database";
import { DAYS_OF_WEEK } from "@/lib/constants";
import { DayColumn } from "./day-column";

interface WeeklyGridProps {
  medications: Medication[];
  today: string;
}

export function WeeklyGrid({ medications, today }: WeeklyGridProps) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  const medsByDay = DAYS_OF_WEEK.map((day) => ({
    day,
    medications: medications
      .filter((m) => m.schedule_days.includes(day))
      .map((m) => ({
        name: m.name,
        dosageAmount: m.dosage_amount,
        dosageUnit: m.dosage_unit,
        frequency: m.frequency,
        scheduleTimes: m.schedule_times,
      })),
  }));

  return (
    <>
      {/* Desktop: 7-column grid */}
      <div className="hidden lg:grid lg:grid-cols-7 gap-3">
        {medsByDay.map(({ day, medications: meds }) => (
          <DayColumn
            key={day}
            dayName={day}
            medications={meds}
            isToday={day === today}
          />
        ))}
      </div>

      {/* Mobile/Tablet: stacked accordion */}
      <div className="lg:hidden space-y-2">
        {medsByDay.map(({ day, medications: meds }) => {
          const isToday = day === today;
          const isExpanded = expandedDay === day || (expandedDay === null && isToday);

          return (
            <div
              key={day}
              className={`rounded-xl border overflow-hidden ${
                isToday
                  ? "border-teal-300 ring-1 ring-teal-200"
                  : "border-slate-200"
              }`}
            >
              <button
                onClick={() => setExpandedDay(isExpanded ? "__none__" : day)}
                className={`w-full flex items-center justify-between px-4 py-3 text-left ${
                  isToday ? "bg-teal-50/50" : "bg-white"
                }`}
                aria-expanded={isExpanded}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={`text-sm font-semibold capitalize ${
                      isToday ? "text-teal-700" : "text-slate-700"
                    }`}
                  >
                    {day}
                  </span>
                  {isToday && (
                    <span className="text-xs font-medium text-teal-600 bg-teal-100 px-1.5 py-0.5 rounded-full">
                      Today
                    </span>
                  )}
                  <span className="text-xs text-slate-400">
                    {meds.length} {meds.length === 1 ? "med" : "meds"}
                  </span>
                </span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 space-y-2">
                  {meds.length === 0 ? (
                    <p className="text-xs text-slate-400 italic py-1">
                      No medications
                    </p>
                  ) : (
                    meds.map((med, i) => {
                      const hasTimes =
                        med.scheduleTimes && med.scheduleTimes.length > 0;
                      return (
                        <div
                          key={`${med.name}-${i}`}
                          className="bg-slate-50 rounded-lg p-2.5"
                        >
                          <p className="text-sm font-medium text-slate-900">
                            {med.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {med.dosageAmount} {med.dosageUnit}
                          </p>
                          {hasTimes && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {med.scheduleTimes!.map((time) => (
                                <span
                                  key={time}
                                  className="px-1.5 py-0.5 rounded text-xs font-medium bg-white text-slate-600 border border-slate-200"
                                >
                                  {time}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}
