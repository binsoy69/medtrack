"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Medication } from "@/lib/types/database";

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
    .eq("profile_id", profileId)
    .order("name");

  if (error) return { error: error.message };
  return { data: (data as Medication[] | null) ?? [] };
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

  revalidatePath("/medications");
  revalidatePath("/dashboard");
  return { data: { newQuantity } };
}
