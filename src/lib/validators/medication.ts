import { z } from "zod";
import { UNIT_TYPES, DAYS_OF_WEEK } from "@/lib/constants";

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

export type MedicationFormData = z.infer<typeof medicationSchema>;
