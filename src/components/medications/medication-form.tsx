"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  medicationSchema,
  type MedicationFormData,
} from "@/lib/validators/medication";
import {
  UNIT_TYPES,
  FREQUENCIES,
  DEFAULT_LOW_STOCK_THRESHOLD,
} from "@/lib/constants";
import type { Medication } from "@/lib/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";
import { Card } from "@/components/ui/card";
import { ScheduleDayPicker } from "./schedule-day-picker";
import { TimePickerList } from "./time-picker-list";

interface MedicationFormProps {
  mode: "create" | "edit";
  defaultValues?: Medication;
  onSubmit: (data: MedicationFormData) => Promise<{ error?: string }>;
  cancelHref: string;
  successRedirect?: string;
}

export function MedicationForm({
  mode,
  defaultValues,
  onSubmit,
  cancelHref,
  successRedirect,
}: MedicationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: defaultValues
      ? {
          name: defaultValues.name,
          quantity: defaultValues.quantity,
          unitType: defaultValues.unit_type as MedicationFormData["unitType"],
          dosageAmount: defaultValues.dosage_amount,
          dosageUnit: defaultValues.dosage_unit as MedicationFormData["dosageUnit"],
          frequency: defaultValues.frequency,
          scheduleDays: defaultValues.schedule_days as MedicationFormData["scheduleDays"],
          scheduleTimes: defaultValues.schedule_times ?? [],
          lowStockThreshold: defaultValues.low_stock_threshold,
          notes: defaultValues.notes ?? "",
        }
      : {
          name: "",
          quantity: 0,
          unitType: "pills",
          dosageAmount: 1,
          dosageUnit: "pills",
          frequency: "once_daily",
          scheduleDays: [],
          scheduleTimes: [""],
          lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
          notes: "",
        },
  });

  const submit = async (data: MedicationFormData) => {
    setServerError(null);
    const result = await onSubmit(data);
    if (result?.error) {
      setServerError(result.error);
      toast.error(result.error);
    } else {
      toast.success(mode === "create" ? "Medication added successfully" : "Changes saved successfully");
      if (successRedirect) {
        router.push(successRedirect);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-6">
      {serverError && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-4 h-4 flex-shrink-0"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          {serverError}
        </div>
      )}

      {/* Basic Info */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Basic Info</h2>

        <FormField label="Medication Name" error={errors.name?.message}>
          <Input
            {...register("name")}
            placeholder="e.g. Ibuprofen"
            error={errors.name?.message}
          />
        </FormField>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField label="Current Quantity" error={errors.quantity?.message}>
            <Input
              type="number"
              min={0}
              step="any"
              {...register("quantity", {
                valueAsNumber: true,
                onChange: (e) => {
                  if (e.target.value < 0) e.target.value = 0;
                },
              })}
              error={errors.quantity?.message}
            />
          </FormField>

          <FormField label="Unit Type" error={errors.unitType?.message}>
            <select
              {...register("unitType")}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {UNIT_TYPES.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </FormField>
        </div>

        <FormField label="Notes (optional)" error={errors.notes?.message}>
          <textarea
            {...register("notes")}
            rows={3}
            placeholder="Any additional notes about this medication..."
            className="flex w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
          />
        </FormField>
      </Card>

      {/* Dosage */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Dosage</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <FormField
            label="Dosage Amount"
            error={errors.dosageAmount?.message}
          >
            <Input
              type="number"
              min={0.1}
              step="any"
              {...register("dosageAmount", {
                valueAsNumber: true,
                onChange: (e) => {
                  if (e.target.value < 0) e.target.value = 0;
                },
              })}
              error={errors.dosageAmount?.message}
            />
          </FormField>

          <FormField label="Dosage Unit" error={errors.dosageUnit?.message}>
            <select
              {...register("dosageUnit")}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {UNIT_TYPES.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Frequency" error={errors.frequency?.message}>
            <select
              {...register("frequency")}
              className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:ring-offset-2"
            >
              {FREQUENCIES.map((freq) => (
                <option key={freq.value} value={freq.value}>
                  {freq.label}
                </option>
              ))}
            </select>
          </FormField>
        </div>
      </Card>

      {/* Schedule */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">Schedule</h2>

        <FormField
          label="Schedule Days"
          error={errors.scheduleDays?.message}
        >
          <Controller
            name="scheduleDays"
            control={control}
            render={({ field }) => (
              <ScheduleDayPicker
                value={field.value}
                onChange={field.onChange}
                error={errors.scheduleDays?.message}
              />
            )}
          />
        </FormField>

        <FormField label="Times of Day (optional)">
          <Controller
            name="scheduleTimes"
            control={control}
            render={({ field }) => (
              <TimePickerList
                value={field.value ?? []}
                onChange={field.onChange}
              />
            )}
          />
        </FormField>
      </Card>

      {/* Stock Alert */}
      <Card className="p-5 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">
          Stock Alert
        </h2>

        <FormField
          label="Low Stock Threshold (days of supply)"
          error={errors.lowStockThreshold?.message}
        >
          <Input
            type="number"
            min={0}
            step="1"
            {...register("lowStockThreshold", {
              valueAsNumber: true,
              onChange: (e) => {
                if (e.target.value < 0) e.target.value = 0;
              },
            })}
            error={errors.lowStockThreshold?.message}
          />
        </FormField>
      </Card>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Link href={cancelHref}>
          <Button type="button" variant="secondary">
            Cancel
          </Button>
        </Link>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {mode === "create" ? "Add Medication" : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
