"use client";

import { useEffect } from "react";
import type { User } from "@supabase/supabase-js";
import type { Profile } from "@/lib/types/database";
import { useProfileStore } from "@/stores/profile-store";
import { Sidebar } from "./sidebar";
import { MobileNav } from "./mobile-nav";
import { MobileHeader } from "./mobile-header";

interface AppShellProps {
  user: User;
  profiles: Profile[];
  children: React.ReactNode;
}

export function AppShell({ user, profiles, children }: AppShellProps) {
  const setProfiles = useProfileStore((s) => s.setProfiles);

  useEffect(() => {
    setProfiles(profiles);
  }, [profiles, setProfiles]);

  const username =
    (user.user_metadata?.username as string | undefined) ?? user.email ?? "User";

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar username={username} />

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        {/* Mobile top header */}
        <MobileHeader username={username} />

        {/* Page content */}
        <main
          id="main-content"
          className="flex-1 overflow-y-auto pb-20 lg:pb-0"
        >
          {children}
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <MobileNav />
    </div>
  );
}
