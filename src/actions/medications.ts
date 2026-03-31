"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Medication, DeductionLog } from "@/lib/types/database";
import {
  quickMedicationSchema,
  quickMedicationToFullForm,
  type MedicationFormData,
  type QuickMedicationFormData,
} from "@/lib/validators/medication";
import { DEDUCTION_LOG_PAGE_SIZE } from "@/lib/constants";

export async function fetchMedications(
  profileId: string
): Promise<{ data?: Medication[]; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("profile_id", profileId);

  if (error) return { error: error.message };
  return { data: (data as Medication[] | null) ?? [] };
}

export async function fetchMedication(
  medicationId: string
): Promise<{ data?: Medication; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data, error } = await supabase
    .from("medications")
    .select("*")
    .eq("id", medicationId)
    .single();

  if (error) return { error: "Medication not found" };
  return { data: data as Medication };
}

export async function createMedication(
  profileId: string,
  formData: MedicationFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const today = new Date().toISOString().split("T")[0];

  const { error } = await supabase.from("medications").insert({
    profile_id: profileId,
    name: formData.name,
    quantity: formData.quantity,
    unit_type: formData.unitType,
    dosage_amount: formData.dosageAmount,
    dosage_unit: formData.dosageUnit,
    frequency: formData.frequency,
    schedule_days: formData.scheduleDays,
    schedule_times:
      formData.scheduleTimes?.filter((t) => t.trim() !== "") ?? null,
    low_stock_threshold: formData.lowStockThreshold,
    notes: formData.notes || null,
    last_deduction_date: today,
  });

  if (error) return { error: error.message };

  revalidatePath("/medications");
  revalidatePath("/dashboard");
  return {};
}

export async function createQuickMedication(
  profileId: string,
  formData: QuickMedicationFormData
): Promise<{ error?: string }> {
  const parsed = quickMedicationSchema.safeParse(formData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid medication data" };
  }

  return createMedication(profileId, quickMedicationToFullForm(parsed.data));
}

export async function updateMedication(
  medicationId: string,
  formData: MedicationFormData
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("medications")
    .update({
      name: formData.name,
      quantity: formData.quantity,
      unit_type: formData.unitType,
      dosage_amount: formData.dosageAmount,
      dosage_unit: formData.dosageUnit,
      frequency: formData.frequency,
      schedule_days: formData.scheduleDays,
      schedule_times:
        formData.scheduleTimes?.filter((t) => t.trim() !== "") ?? null,
      low_stock_threshold: formData.lowStockThreshold,
      notes: formData.notes || null,
    })
    .eq("id", medicationId);

  if (error) return { error: error.message };

  revalidatePath("/medications");
  revalidatePath("/dashboard");
  return {};
}

export async function deleteMedication(
  medicationId: string
): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { error } = await supabase
    .from("medications")
    .delete()
    .eq("id", medicationId);

  if (error) return { error: error.message };

  revalidatePath("/medications");
  revalidatePath("/dashboard");
  redirect("/medications");
}

export async function adjustQuantity(
  medicationId: string,
  amount: number
): Promise<{ data?: { newQuantity: number }; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: med, error: fetchError } = await supabase
    .from("medications")
    .select("quantity")
    .eq("id", medicationId)
    .single();

  if (fetchError || !med) return { error: "Medication not found" };

  const current = (med as { quantity: number }).quantity;
  const newQuantity = Math.max(0, current + amount);
  // positive = units deducted, negative = units added (stock replenished)
  const amountDeducted = current - newQuantity;

  const { error: updateError } = await supabase
    .from("medications")
    .update({ quantity: newQuantity })
    .eq("id", medicationId);

  if (updateError) return { error: "Failed to update quantity" };

  const today = new Date().toISOString().split("T")[0];
  await supabase.from("deduction_logs").insert({
    medication_id: medicationId,
    deduction_date: today,
    amount_deducted: amountDeducted,
    quantity_after: newQuantity,
    type: "manual",
  });

  revalidatePath("/dashboard");
  return { data: { newQuantity } };
}

export async function fetchDeductionLogs(
  medicationId: string,
  page: number
): Promise<{
  data?: { logs: DeductionLog[]; hasMore: boolean };
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const from = page * DEDUCTION_LOG_PAGE_SIZE;
  const to = from + DEDUCTION_LOG_PAGE_SIZE;

  const { data, error } = await supabase
    .from("deduction_logs")
    .select("*")
    .eq("medication_id", medicationId)
    .order("deduction_date", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return { error: error.message };

  const logs = (data as DeductionLog[] | null) ?? [];
  // If we got more than PAGE_SIZE, there are more pages
  const hasMore = logs.length > DEDUCTION_LOG_PAGE_SIZE;
  const trimmed = hasMore ? logs.slice(0, DEDUCTION_LOG_PAGE_SIZE) : logs;

  return { data: { logs: trimmed, hasMore } };
}
