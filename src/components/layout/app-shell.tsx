"use client";

import { useEffect } from "react";
import type { Profile } from "@/lib/types/database";
import { useProfileStore } from "@/stores/profile-store";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { MobileHeader } from "./mobile-header";
import { InventorySyncBootstrap } from "./inventory-sync-bootstrap";

interface AppShellProps {
  username: string;
  profiles: Profile[];
  initialActiveProfileId: string | null;
  children: React.ReactNode;
}

export function AppShell({
  username,
  profiles,
  initialActiveProfileId,
  children,
}: AppShellProps) {
  const syncProfiles = useProfileStore((state) => state.syncProfiles);

  useEffect(() => {
    syncProfiles(profiles, initialActiveProfileId);
  }, [initialActiveProfileId, profiles, syncProfiles]);

  return (
    <div className="flex min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.1),_transparent_28%),radial-gradient(circle_at_top_right,_rgba(15,23,42,0.06),_transparent_26%),#f4f7f3]">
      <InventorySyncBootstrap />

      <Sidebar
        username={username}
        profiles={profiles}
        initialActiveProfileId={initialActiveProfileId}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:ml-56">
        <MobileHeader
          username={username}
          profiles={profiles}
          initialActiveProfileId={initialActiveProfileId}
        />

        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-20 lg:pb-4"
        >
          <div className="mx-auto w-full max-w-[1320px]">{children}</div>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
