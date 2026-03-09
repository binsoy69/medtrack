"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import type { Medication } from "@/lib/types/database";
import { StockBadge } from "@/components/medications/stock-badge";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ForecastDisplay } from "@/components/medications/forecast-display";
import { FREQUENCIES, DAYS_OF_WEEK } from "@/lib/constants";

const DAY_ABBR: Record<string, string> = {
  monday: "Mo",
  tuesday: "Tu",
  wednesday: "We",
  thursday: "Th",
  friday: "Fr",
  saturday: "Sa",
  sunday: "Su",
};

interface MedicationCardProps {
  medication: Medication;
}

export function MedicationCard({ medication }: MedicationCardProps) {
  const [quantity, setQuantity] = useState(medication.quantity);

  // Sync with fresh data when parent re-fetches
  useEffect(() => {
    setQuantity(medication.quantity);
  }, [medication.quantity]);

  const freqLabel =
    FREQUENCIES.find((f) => f.value === medication.frequency)?.label ??
    medication.frequency;

  const isEveryDay = medication.schedule_days.length === 7;

  return (
    <Link
      href={`/medications/${medication.id}`}
      className="block bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
    >
      <div className="p-5 flex flex-col gap-3">
        {/* Header: name + stock badge */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-slate-900 text-base leading-snug">
            {medication.name}
          </h3>
          <StockBadge quantity={quantity} threshold={medication.low_stock_threshold} />
        </div>

        {/* Dosage summary */}
        <p className="text-sm text-slate-500">
          {medication.dosage_amount} {medication.dosage_unit},{" "}
          {freqLabel.toLowerCase()}
        </p>

        {/* Schedule days */}
        <div className="flex flex-wrap gap-1">
          {isEveryDay ? (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-teal-50 text-teal-700 border border-teal-200">
              Every day
            </span>
          ) : (
            DAYS_OF_WEEK.map((day) => {
              const scheduled = medication.schedule_days.includes(day);
              return (
                <span
                  key={day}
                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                    scheduled
                      ? "bg-teal-50 text-teal-700 border border-teal-200"
                      : "bg-slate-50 text-slate-200 border border-slate-100"
                  }`}
                >
                  {DAY_ABBR[day]}
                </span>
              );
            })
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Quantity adjuster + forecast placeholder */}
        <div
          className="flex items-center justify-between"
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
        >
          <QuantityAdjuster
            medicationId={medication.id}
            quantity={quantity}
            unit={medication.unit_type}
            onQuantityChange={setQuantity}
          />
          <ForecastDisplay
            quantity={quantity}
            dosageAmount={medication.dosage_amount}
            frequency={medication.frequency}
            scheduleDays={medication.schedule_days}
          />
        </div>
      </div>
    </Link>
  );
}
