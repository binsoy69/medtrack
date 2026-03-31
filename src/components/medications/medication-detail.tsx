"use client";

import type { Medication } from "@/lib/types/database";
import { FREQUENCIES, DAYS_OF_WEEK } from "@/lib/constants";
import { parse, format } from "date-fns";
import { StockBadge } from "./stock-badge";
import { ForecastDisplay } from "./forecast-display";

function formatTimeAMPM(time24: string) {
  try {
    const parsed = parse(time24, "HH:mm", new Date());
    return format(parsed, "h:mm a");
  } catch {
    return time24;
  }
}

const DAY_LABELS: Record<string, string> = {
  monday: "Mon",
  tuesday: "Tue",
  wednesday: "Wed",
  thursday: "Thu",
  friday: "Fri",
  saturday: "Sat",
  sunday: "Sun",
};

interface MedicationDetailProps {
  medication: Medication;
}

export function MedicationDetail({ medication }: MedicationDetailProps) {
  const freqLabel =
    FREQUENCIES.find((f) => f.value === medication.frequency)?.label ??
    medication.frequency;

  const isLowStock =
    medication.quantity <= medication.low_stock_threshold &&
    medication.quantity > 0;

  return (
    <div className="space-y-5">
      {/* Low stock warning banner */}
      {isLowStock && (
        <div className="flex items-center gap-3 rounded-[16px] border border-amber-200 bg-amber-50 p-3.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 text-amber-600 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-amber-800">
              Low Stock Warning
            </p>
            <p className="text-xs text-amber-600">
              Current stock ({medication.quantity} {medication.unit_type}) is at
              or below your threshold of {medication.low_stock_threshold}.
            </p>
          </div>
        </div>
      )}

      {medication.quantity === 0 && (
        <div className="flex items-center gap-3 rounded-[16px] border border-red-200 bg-red-50 p-3.5">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-5 h-5 text-red-600 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
          <div>
            <p className="text-sm font-medium text-red-800">Out of Stock</p>
            <p className="text-xs text-red-600">
              This medication has been completely depleted. Please refill.
            </p>
          </div>
        </div>
      )}

      {/* Info section */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Section title="Medication Info">
          <InfoRow label="Name" value={medication.name} />
          <InfoRow
            label="Stock"
            value={
              <span className="flex items-center gap-2">
                {medication.quantity} {medication.unit_type}
                <StockBadge
                  quantity={medication.quantity}
                  threshold={medication.low_stock_threshold}
                />
              </span>
            }
          />
          {medication.notes && (
            <InfoRow label="Notes" value={medication.notes} />
          )}
        </Section>

        <Section title="Dosage">
          <InfoRow
            label="Amount"
            value={`${medication.dosage_amount} ${medication.dosage_unit}`}
          />
          <InfoRow label="Frequency" value={freqLabel} />
        </Section>
      </div>

      {/* Schedule */}
      <Section title="Schedule">
        <div className="mb-2 flex flex-wrap gap-1.5">
          {DAYS_OF_WEEK.map((day) => {
            const scheduled = medication.schedule_days.includes(day);
            return (
              <span
                key={day}
                className={`rounded-lg border px-2.5 py-1 text-[11px] font-medium ${
                  scheduled
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-slate-100 bg-slate-50 text-slate-300"
                }`}
              >
                {DAY_LABELS[day]}
              </span>
            );
          })}
        </div>

        {medication.schedule_times && medication.schedule_times.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="mr-1 self-center text-[11px] text-slate-500">Times:</span>
            {medication.schedule_times.map((time, i) => (
              <span
                key={i}
                className="rounded-lg border border-slate-200 bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700"
              >
                {formatTimeAMPM(time)}
              </span>
            ))}
          </div>
        )}
      </Section>

      {/* Forecast */}
      <Section title="Stock Forecast">
        <div className="flex items-center gap-4">
          <InfoRow
            label="Low Stock Threshold"
            value={`${medication.low_stock_threshold} days`}
          />
        </div>
        <div className="mt-2">
          <ForecastDisplay
            quantity={medication.quantity}
            dosageAmount={medication.dosage_amount}
            frequency={medication.frequency}
            scheduleDays={medication.schedule_days}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_16px_30px_-26px_rgba(15,23,42,0.3)]">
      <h3 className="mb-3 text-sm font-semibold text-slate-900">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-[13px] text-slate-500">{label}</span>
      <span className="text-[13px] font-medium text-slate-900 text-right">
        {value}
      </span>
    </div>
  );
}
