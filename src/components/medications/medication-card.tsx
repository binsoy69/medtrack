"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react";
import { parse, format } from "date-fns";
import type { Medication } from "@/lib/types/database";
import { StockBadge } from "@/components/medications/stock-badge";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ForecastDisplay } from "@/components/medications/forecast-display";
import { FREQUENCIES, DAYS_OF_WEEK } from "@/lib/constants";

function formatTimeAMPM(time24: string) {
  try {
    const parsed = parse(time24, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return time24;
  }
}

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
  wide?: boolean;
}

export function MedicationCard({
  medication,
  wide = false,
}: MedicationCardProps) {
  const [quantity, setQuantity] = useState(medication.quantity);

  const frequencyLabel =
    FREQUENCIES.find((frequency) => frequency.value === medication.frequency)
      ?.label ?? medication.frequency;
  const isEveryDay = medication.schedule_days.length === 7;

  return (
    <article className="rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div
        className={`grid gap-4 ${
          wide ? "xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.85fr)]" : ""
        }`}
      >
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Medication
              </p>
              <h3 className="mt-1.5 text-lg font-semibold tracking-tight text-slate-900">
                {medication.name}
              </h3>
              <p className="mt-0.5 text-[13px] text-slate-500">
                {medication.dosage_amount} {medication.dosage_unit} per dose,{" "}
                {frequencyLabel.toLowerCase()}
              </p>
            </div>
            <StockBadge
              quantity={quantity}
              threshold={medication.low_stock_threshold}
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            {isEveryDay ? (
              <span className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700">
                Every day
              </span>
            ) : (
              DAYS_OF_WEEK.map((day) => {
                const scheduled = medication.schedule_days.includes(day);
                return (
                  <span
                    key={day}
                    className={`rounded-lg border px-2 py-1 text-[11px] font-medium ${
                      scheduled
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-300"
                    }`}
                  >
                    {DAY_ABBR[day]}
                  </span>
                );
              })
            )}
          </div>

          {medication.schedule_times && medication.schedule_times.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {[...medication.schedule_times].sort().map((time) => (
                <span
                  key={time}
                  className="rounded-xl border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-600"
                >
                  {formatTimeAMPM(time)}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-[18px] border border-slate-200 bg-slate-50/80 p-3.5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Inventory
            </p>
            <div className="mt-2.5">
              <QuantityAdjuster
                medicationId={medication.id}
                quantity={quantity}
                unit={medication.unit_type}
                onQuantityChange={setQuantity}
              />
            </div>
            <div className="mt-3">
              <ForecastDisplay
                quantity={quantity}
                dosageAmount={medication.dosage_amount}
                frequency={medication.frequency}
                scheduleDays={medication.schedule_days}
              />
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {quantity} {medication.unit_type} remaining
            </span>
            <Link
              href={`/medications/${medication.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
            >
              Details
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
