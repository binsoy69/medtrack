import { cache } from "react";
import { cookies } from "next/headers";
import type { Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/server";
import {
  ACTIVE_PROFILE_COOKIE_NAME,
  resolveActiveProfileId,
} from "@/lib/profile-selection";

export const getAppContext = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      user: null,
      username: "User",
      profiles: [] as Profile[],
      activeProfileId: null,
      activeProfile: null,
    };
  }

  const { data: profilesData } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const profiles = (profilesData as Profile[] | null) ?? [];
  const cookieStore = await cookies();
  const activeProfileId = resolveActiveProfileId(
    profiles,
    cookieStore.get(ACTIVE_PROFILE_COOKIE_NAME)?.value
  );
  const activeProfile =
    profiles.find((profile) => profile.id === activeProfileId) ?? null;
  const username =
    (user.user_metadata?.username as string | undefined) ??
    user.email ??
    "User";

  return {
    user,
    username,
    profiles,
    activeProfileId,
    activeProfile,
  };
});

