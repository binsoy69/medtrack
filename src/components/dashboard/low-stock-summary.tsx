"use client";

import { useMemo } from "react";
import Link from "next/link";
import type { Medication } from "@/lib/types/database";
import { daysUntilRunOut, calculateRunOutDate } from "@/lib/utils/forecast";
import { format } from "date-fns";

interface LowStockSummaryProps {
  medications: Medication[];
}

export function LowStockSummary({ medications }: LowStockSummaryProps) {
  const today = useMemo(() => new Date(), []);

  const lowStockMeds = useMemo(() => {
    const filtered = medications.filter(
      (m) => m.quantity <= m.low_stock_threshold
    );

    return filtered
      .map((m) => ({
        ...m,
        daysLeft: daysUntilRunOut(
          m.quantity,
          m.dosage_amount,
          m.frequency,
          m.schedule_days,
          today
        ),
        runOutDate: calculateRunOutDate(
          m.quantity,
          m.dosage_amount,
          m.frequency,
          m.schedule_days,
          today
        ),
      }))
      .sort((a, b) => a.daysLeft - b.daysLeft)
      .slice(0, 5);
  }, [medications, today]);

  if (lowStockMeds.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-emerald-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 text-base">
            Stock Status
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          All medications are well stocked.
        </p>
      </div>
    );
  }

  const totalLow = medications.filter(
    (m) => m.quantity <= m.low_stock_threshold
  ).length;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-amber-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 text-base">
            Low Stock Alert
          </h2>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          {totalLow} medication{totalLow !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="space-y-2">
        {lowStockMeds.map((med) => {
          const isOutOfStock = med.quantity === 0;
          return (
            <Link
              key={med.id}
              href={`/medications/${med.id}`}
              className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-slate-900 truncate group-hover:text-teal-700 transition-colors">
                  {med.name}
                </p>
                <p
                  className={`text-xs mt-0.5 ${isOutOfStock ? "text-red-500 font-medium" : "text-amber-600"}`}
                >
                  {isOutOfStock
                    ? "Out of stock"
                    : med.runOutDate
                      ? `Runs out ${format(med.runOutDate, "MMM d")} (~${med.daysLeft} day${med.daysLeft !== 1 ? "s" : ""})`
                      : "Low stock"}
                </p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-sm font-bold tabular-nums ${isOutOfStock ? "text-red-600" : "text-amber-600"}`}
                >
                  {med.quantity}
                </span>
                <span className="text-xs text-slate-400">{med.unit_type}</span>
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m8.25 4.5 7.5 7.5-7.5 7.5"
                  />
                </svg>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
