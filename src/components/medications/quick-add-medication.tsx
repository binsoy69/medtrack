"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Lightning, Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import { createQuickMedication } from "@/actions/medications";
import { FREQUENCIES, UNIT_TYPES } from "@/lib/constants";
import {
  quickMedicationDefaults,
  type QuickMedicationFormData,
} from "@/lib/validators/medication";

interface QuickAddMedicationProps {
  activeProfileId: string;
  compact?: boolean;
}

export function QuickAddMedication({
  activeProfileId,
  compact = false,
}: QuickAddMedicationProps) {
  const router = useRouter();
  const [formData, setFormData] =
    useState<QuickMedicationFormData>(quickMedicationDefaults);
  const [isPending, startTransition] = useTransition();

  function updateField<K extends keyof QuickMedicationFormData>(
    key: K,
    value: QuickMedicationFormData[K]
  ) {
    setFormData((current) => ({ ...current, [key]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startTransition(async () => {
      const result = await createQuickMedication(activeProfileId, formData);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      setFormData(quickMedicationDefaults);
      toast.success("Medication added");
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-[20px] border border-slate-200/80 bg-white/90 shadow-[0_18px_36px_-28px_rgba(15,23,42,0.35)] backdrop-blur ${
        compact ? "p-3.5" : "p-4 sm:p-5"
      }`}
    >
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
              <Lightning size={16} weight="duotone" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Quick add medication
              </p>
              <p className="text-[13px] text-slate-500">
                Save stock now. Fine-tune days and times later if needed.
              </p>
            </div>
          </div>
        </div>

        {!compact && (
          <Link
            href="/medications/new"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1.5 text-[13px] font-medium text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
          >
            Need full details?
          </Link>
        )}
      </div>

      <div
        className={`mt-5 grid gap-3 ${
          compact
            ? "grid-cols-1 md:grid-cols-[minmax(0,2fr)_110px_120px_1fr_auto]"
            : "grid-cols-1 md:grid-cols-[minmax(0,2fr)_120px_130px_120px_1.25fr_auto]"
        }`}
      >
        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Name
          </span>
          <input
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            placeholder="Ibuprofen"
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Stock
          </span>
          <input
            type="number"
            min={0}
            step="1"
            value={formData.quantity}
            onChange={(event) =>
              updateField("quantity", Math.max(0, Number(event.target.value) || 0))
            }
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-300 focus:bg-white"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Unit
          </span>
          <select
            value={formData.unitType}
            onChange={(event) =>
              updateField("unitType", event.target.value as QuickMedicationFormData["unitType"])
            }
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-300 focus:bg-white"
          >
            {UNIT_TYPES.map((unit) => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
        </label>

        {!compact && (
          <label className="grid gap-2">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              Dose
            </span>
            <input
              type="number"
              min={0.1}
              step="0.1"
              value={formData.dosageAmount}
              onChange={(event) =>
                updateField(
                  "dosageAmount",
                  Math.max(0.1, Number(event.target.value) || 0.1)
                )
              }
              className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-300 focus:bg-white"
            />
          </label>
        )}

        <label className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            Daily cadence
          </span>
          <select
            value={formData.frequency}
            onChange={(event) =>
              updateField(
                "frequency",
                event.target.value as QuickMedicationFormData["frequency"]
              )
            }
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition-colors focus:border-emerald-300 focus:bg-white"
          >
            {FREQUENCIES.map((frequency) => (
              <option key={frequency.value} value={frequency.value}>
                {frequency.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          disabled={isPending}
          className="mt-auto inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-3.5 text-sm font-medium text-white transition-transform transition-colors hover:bg-emerald-800 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={16} weight="bold" />
          {isPending ? "Adding..." : "Quick add"}
        </button>
      </div>

      <p className="mt-3 text-[11px] text-slate-500">
        Quick add assumes an every-day schedule and uses your unit as the default dosage unit.
      </p>
    </form>
  );
}
