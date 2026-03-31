"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDots,
  House,
  Pill,
  Pulse,
  SignOut,
  SlidersHorizontal,
} from "@phosphor-icons/react";
import type { Profile } from "@/lib/types/database";
import { signOut } from "@/actions/auth";
import { ProfileSelector } from "./profile-selector";

interface SidebarProps {
  username: string;
  profiles: Profile[];
  initialActiveProfileId: string | null;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: House,
  },
  {
    label: "Medications",
    href: "/medications",
    icon: Pill,
  },
  {
    label: "Schedule",
    href: "/schedule",
    icon: CalendarDots,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SlidersHorizontal,
  },
];

export function Sidebar({
  username,
  profiles,
  initialActiveProfileId,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 p-3 lg:flex">
      <div className="flex h-full w-full flex-col rounded-[22px] border border-white/10 bg-slate-950/90 p-3 shadow-[0_24px_60px_-34px_rgba(15,23,42,0.85)] backdrop-blur">
        <div className="rounded-[18px] border border-white/10 bg-white/[0.03] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
              <Pulse size={17} weight="duotone" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
                Medication system
              </p>
              <p className="truncate text-base font-semibold tracking-tight text-white">
                MedTrack
              </p>
            </div>
          </div>
          <p className="mt-3 text-[13px] text-slate-400">
            Inventory, schedule, and refill pressure in one place.
          </p>
          <p className="mt-2 text-[11px] text-slate-500">@{username}</p>
        </div>

        <div className="mt-3">
          <ProfileSelector
            profiles={profiles}
            initialActiveProfileId={initialActiveProfileId}
          />
        </div>

        <nav className="mt-4 flex-1 space-y-1 overflow-y-auto" aria-label="Desktop navigation">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Workspace
          </p>
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded-[16px] border px-2.5 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                isActive
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
                  : "border-transparent text-slate-300 hover:border-white/8 hover:bg-white/[0.03] hover:text-white"
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
                <Icon
                  size={16}
                  weight={isActive ? "fill" : "regular"}
                  className={`transition-colors ${
                    isActive
                      ? "text-emerald-300"
                      : "text-slate-500 group-hover:text-slate-200"
                  }`}
                />
              </span>
              <span className="flex-1">{item.label}</span>
              {isActive && (
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
              )}
            </Link>
          );
        })}
        </nav>

        <form action={signOut} className="border-t border-white/10 pt-3">
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-[16px] border border-transparent px-2.5 py-2.5 text-[13px] font-medium text-slate-400 transition-all duration-200 hover:border-red-500/10 hover:bg-red-500/10 hover:text-red-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03]">
              <SignOut size={16} className="text-slate-500" />
            </span>
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
