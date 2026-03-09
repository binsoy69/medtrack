"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: { username: string; password: string }) {
  const supabase = await createClient();

  // As per PRD, auth uses "fake" emails derived from usernames
  const email = `${formData.username}@medtrack.local`;

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: formData.password,
  });

  if (error) {
    return { error: "Invalid username or password" };
  }

  redirect("/dashboard");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
