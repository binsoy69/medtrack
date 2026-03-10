"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Medication } from "@/lib/types/database";
import { StockBadge } from "@/components/medications/stock-badge";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ForecastDisplay } from "@/components/medications/forecast-display";

interface MedicationQuickListProps {
  medications: Medication[];
}

function QuickListRow({ medication }: { medication: Medication }) {
  const [quantity, setQuantity] = useState(medication.quantity);

  useEffect(() => {
    setQuantity(medication.quantity);
  }, [medication.quantity]);

  return (
    <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-slate-50 transition-colors group">
      {/* Name + forecast — links to detail */}
      <Link
        href={`/medications/${medication.id}`}
        className="min-w-0 flex-1 flex items-center gap-3"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-slate-900 truncate group-hover:text-teal-700 transition-colors">
              {medication.name}
            </p>
            <StockBadge
              quantity={quantity}
              threshold={medication.low_stock_threshold}
            />
          </div>
          <div className="mt-1">
            <ForecastDisplay
              quantity={quantity}
              dosageAmount={medication.dosage_amount}
              frequency={medication.frequency}
              scheduleDays={medication.schedule_days}
            />
          </div>
        </div>
      </Link>

      {/* Quantity adjuster — stops propagation internally */}
      <div className="flex-shrink-0">
        <QuantityAdjuster
          medicationId={medication.id}
          quantity={quantity}
          unit={medication.unit_type}
          onQuantityChange={setQuantity}
        />
      </div>
    </div>
  );
}

export function MedicationQuickList({ medications }: MedicationQuickListProps) {
  if (medications.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-slate-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 text-base">
            All Medications
          </h2>
        </div>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-sm text-slate-500">No medications added yet.</p>
          <Link
            href="/medications/new"
            className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors text-sm font-medium shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Medication
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              className="w-5 h-5 text-slate-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <h2 className="font-semibold text-slate-900 text-base">
            All Medications
          </h2>
        </div>
        <Link
          href="/medications"
          className="text-sm text-teal-600 hover:text-teal-700 font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-slate-100">
        {medications.map((med) => (
          <QuickListRow key={med.id} medication={med} />
        ))}
      </div>
    </div>
  );
}
