import type { Profile } from "@/lib/types/database";

export const ACTIVE_PROFILE_COOKIE_NAME = "medtrack-active-profile";

export function resolveActiveProfileId(
  profiles: Profile[],
  requestedId?: string | null
) {
  if (requestedId && profiles.some((profile) => profile.id === requestedId)) {
    return requestedId;
  }

  return profiles[0]?.id ?? null;
}

