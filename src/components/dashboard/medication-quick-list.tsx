"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Pill, Plus } from "@phosphor-icons/react";
import type { Medication } from "@/lib/types/database";
import { StockBadge } from "@/components/medications/stock-badge";
import { QuantityAdjuster } from "@/components/medications/quantity-adjuster";
import { ForecastDisplay } from "@/components/medications/forecast-display";
import { QuickAddMedication } from "@/components/medications/quick-add-medication";

interface MedicationQuickListProps {
  medications: Medication[];
  activeProfileId?: string | null;
}

function QuickListRow({ medication }: { medication: Medication }) {
  const [quantity, setQuantity] = useState(medication.quantity);

  return (
    <div className="grid gap-3 rounded-[16px] border border-slate-200/80 bg-slate-50/70 px-3.5 py-3 transition-colors hover:border-emerald-200 hover:bg-white md:grid-cols-[minmax(0,1.2fr)_auto_auto] md:items-center">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-medium text-slate-900">
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

      <div className="md:justify-self-end">
        <QuantityAdjuster
          medicationId={medication.id}
          quantity={quantity}
          unit={medication.unit_type}
          onQuantityChange={setQuantity}
        />
      </div>

      <div className="md:justify-self-end">
        <Link
          href={`/medications/${medication.id}`}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
        >
          Details
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
}

export function MedicationQuickList({
  medications,
  activeProfileId,
}: MedicationQuickListProps) {
  return (
    <section className="rounded-[22px] border border-slate-200/80 bg-white/90 p-4 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
              <Pill size={18} weight="duotone" />
            </span>
            <div>
              <h2 className="text-base font-semibold tracking-tight text-slate-900">
                Medication inventory
              </h2>
              <p className="text-[13px] text-slate-500">
                Update stock in place and only open details when you need the full record.
              </p>
            </div>
          </div>
          <Link
            href="/medications"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            View all medications
          </Link>
        </div>

        {activeProfileId && <QuickAddMedication activeProfileId={activeProfileId} compact />}

        {medications.length === 0 ? (
          <div className="rounded-[18px] border border-dashed border-slate-200 bg-slate-50/70 px-5 py-10 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
              <Plus size={16} />
            </span>
            <p className="mt-4 text-sm font-medium text-slate-700">
              No medications added yet
            </p>
            <p className="mt-1 text-[13px] text-slate-500">
              Use quick add above to create the first item without opening the full form.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {medications.map((medication) => (
              <QuickListRow
                key={`${medication.id}-${medication.quantity}`}
                medication={medication}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
