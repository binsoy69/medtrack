"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { MAX_PROFILES_PER_USER } from "@/lib/constants";
import { ACTIVE_PROFILE_COOKIE_NAME } from "@/lib/profile-selection";

export async function createProfile(name: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const trimmed = name.trim();
  if (!trimmed) return { error: "Profile name is required" };

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) >= MAX_PROFILES_PER_USER) {
    return { error: `Maximum ${MAX_PROFILES_PER_USER} profiles allowed` };
  }

  const { data, error } = await supabase
    .from("profiles")
    .insert({ user_id: user.id, name: trimmed })
    .select()
    .single();

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { data };
}

export async function renameProfile(profileId: string, newName: string) {
  const supabase = await createClient();

  const trimmed = newName.trim();
  if (!trimmed) return { error: "Profile name is required" };

  const { error } = await supabase
    .from("profiles")
    .update({ name: trimmed })
    .eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function deleteProfile(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  if ((count ?? 0) <= 1) {
    return { error: "Cannot delete your last profile" };
  }

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", profileId);

  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  return { success: true };
}

export async function setActiveProfileSelection(profileId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized" };

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", profileId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !profile) {
    return { error: "Profile not found" };
  }

  const cookieStore = await cookies();
  cookieStore.set(ACTIVE_PROFILE_COOKIE_NAME, profileId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });

  revalidatePath("/", "layout");
  return { success: true };
}
