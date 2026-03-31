"use client";

import { Pulse } from "@phosphor-icons/react";
import type { Profile } from "@/lib/types/database";
import { ProfileSelector } from "./profile-selector";

interface MobileHeaderProps {
  username: string;
  profiles: Profile[];
  initialActiveProfileId: string | null;
}

export function MobileHeader({
  username,
  profiles,
  initialActiveProfileId,
}: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-[rgba(244,247,243,0.85)] backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700">
              <Pulse size={16} weight="duotone" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold tracking-tight text-slate-900">
                MedTrack
              </p>
              <p className="truncate text-[11px] text-slate-500">@{username}</p>
            </div>
          </div>
        </div>

        <ProfileSelector
          profiles={profiles}
          initialActiveProfileId={initialActiveProfileId}
          tone="light"
          condensed
        />
      </div>
    </header>
  );
}
