import { z } from "zod";
import {
  UNIT_TYPES,
  DAYS_OF_WEEK,
  DEFAULT_LOW_STOCK_THRESHOLD,
} from "@/lib/constants";

export const medicationSchema = z.object({
  name: z.string().min(1, "Medication name is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  unitType: z.enum(UNIT_TYPES),
  dosageAmount: z.number().min(0.1, "Dosage must be greater than 0"),
  dosageUnit: z.enum(UNIT_TYPES),
  frequency: z.enum(["once_daily", "twice_daily", "three_times_daily"]),
  scheduleDays: z
    .array(z.enum(DAYS_OF_WEEK))
    .min(1, "Select at least one day"),
  scheduleTimes: z.array(z.string()).optional(),
  lowStockThreshold: z.number().min(0, "Threshold cannot be negative"),
  notes: z.string().optional(),
});

export const quickMedicationSchema = z.object({
  name: z.string().trim().min(1, "Medication name is required"),
  quantity: z.number().min(0, "Quantity cannot be negative"),
  unitType: z.enum(UNIT_TYPES),
  dosageAmount: z.number().min(0.1, "Dosage must be greater than 0").default(1),
  frequency: z
    .enum(["once_daily", "twice_daily", "three_times_daily"])
    .default("once_daily"),
});

export type MedicationFormData = z.infer<typeof medicationSchema>;
export type QuickMedicationFormData = z.infer<typeof quickMedicationSchema>;

export const quickMedicationDefaults: QuickMedicationFormData = {
  name: "",
  quantity: 30,
  unitType: "pills",
  dosageAmount: 1,
  frequency: "once_daily",
};

export const quickMedicationToFullForm = (
  quickMedication: QuickMedicationFormData
): MedicationFormData => ({
  name: quickMedication.name,
  quantity: quickMedication.quantity,
  unitType: quickMedication.unitType,
  dosageAmount: quickMedication.dosageAmount,
  dosageUnit: quickMedication.unitType,
  frequency: quickMedication.frequency,
  scheduleDays: [...DAYS_OF_WEEK],
  scheduleTimes: [],
  lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
  notes: "",
});
