"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function updateUsername(newUsername: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Check uniqueness via admin client
  const admin = createAdminClient();
  const newEmail = `${newUsername}@medtrack.local`;

  const { data: existingUsers } = await admin.auth.admin.listUsers();
  const taken = existingUsers?.users?.some(
    (u) => u.email === newEmail && u.id !== user.id,
  );

  if (taken) {
    return { error: "Username is already taken" };
  }

  const { error } = await admin.auth.admin.updateUserById(user.id, {
    email: newEmail,
    user_metadata: { ...user.user_metadata, username: newUsername },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updatePassword(
  currentPassword: string,
  newPassword: string,
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  // Verify current password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: currentPassword,
  });

  if (signInError) {
    return { error: "Current password is incorrect" };
  }

  // Update to new password
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateTimezone(timezone: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, timezone },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function updateNotificationEmail(email: string | null) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated" };
  }

  const { error } = await supabase.auth.updateUser({
    data: { ...user.user_metadata, notification_email: email || null },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}
