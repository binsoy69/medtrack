"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { CaretDown, Check, Pulse } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Profile } from "@/lib/types/database";
import { setActiveProfileSelection } from "@/actions/profiles";
import { useProfileStore } from "@/stores/profile-store";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface ProfileSelectorProps {
  profiles: Profile[];
  initialActiveProfileId: string | null;
  tone?: "light" | "dark";
  condensed?: boolean;
}

export function ProfileSelector({
  profiles: initialProfiles,
  initialActiveProfileId,
  tone = "dark",
  condensed = false,
}: ProfileSelectorProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const storedProfiles = useProfileStore((state) => state.profiles);
  const storedActiveProfileId = useProfileStore((state) => state.activeProfileId);
  const setActiveProfile = useProfileStore((state) => state.setActiveProfile);

  const profiles = storedProfiles.length > 0 ? storedProfiles : initialProfiles;
  const activeProfileId = storedActiveProfileId ?? initialActiveProfileId;

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  if (!profiles.length) return null;

  const isLight = tone === "light";

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center gap-2.5 rounded-[16px] border px-2.5 py-2.5 text-left transition-all duration-200 ${
          isLight
            ? "border-slate-200/80 bg-white/85 text-slate-900 shadow-[0_20px_40px_-28px_rgba(15,23,42,0.4)] hover:border-emerald-300/80 hover:bg-white"
            : "border-white/10 bg-slate-950/70 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] hover:border-emerald-400/30 hover:bg-slate-950"
        } ${condensed ? "min-w-[10.5rem]" : ""}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-busy={isPending}
      >
        <span
          className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border text-[11px] font-semibold ${
            isLight
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {activeProfile ? getInitials(activeProfile.name) : "?"}
        </span>

        <span className="min-w-0 flex-1">
          <span
            className={`block truncate text-[13px] font-medium ${
              isLight ? "text-slate-900" : "text-slate-100"
            }`}
          >
            {activeProfile?.name ?? "Select profile"}
          </span>
          <span
            className={`mt-0.5 block text-[11px] ${
              isLight ? "text-slate-500" : "text-slate-400"
            }`}
          >
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""} active
          </span>
        </span>

        <CaretDown
          size={14}
          weight="bold"
          className={`flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          } ${isLight ? "text-slate-400" : "text-slate-500"}`}
        />
      </button>

      {open && (
        <div
          className={`absolute top-full z-50 mt-2 overflow-hidden rounded-[18px] border shadow-[0_20px_40px_-28px_rgba(15,23,42,0.55)] ${
            condensed ? "right-0 w-64" : "left-0 right-0"
          } ${
            isLight
              ? "border-slate-200/80 bg-white/95"
              : "border-white/10 bg-slate-950/95"
          }`}
          role="listbox"
          aria-label="Select profile"
        >
          <div
            className={`flex items-center justify-between border-b px-3 py-2.5 ${
              isLight
                ? "border-slate-200/80 text-slate-500"
                : "border-white/10 text-slate-400"
            }`}
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em]">
              Medication profiles
            </span>
            {isPending && <Pulse size={14} className="animate-pulse" />}
          </div>

          {profiles.map((profile) => {
            const isActive = profile.id === activeProfileId;
            return (
              <button
                key={profile.id}
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  const previousActiveProfileId = activeProfileId;
                  setActiveProfile(profile.id);
                  setOpen(false);

                  startTransition(async () => {
                    const result = await setActiveProfileSelection(profile.id);
                    if (result.error) {
                      if (previousActiveProfileId) {
                        setActiveProfile(previousActiveProfileId);
                      }
                      toast.error(result.error);
                      return;
                    }

                    router.refresh();
                  });
                }}
                className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition-colors ${
                  isActive
                    ? isLight
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-emerald-500/10 text-emerald-300"
                    : isLight
                      ? "text-slate-700 hover:bg-slate-50"
                      : "text-slate-200 hover:bg-white/5"
                }`}
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-xl border text-[11px] font-semibold ${
                    isActive
                      ? isLight
                        ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                        : "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                      : isLight
                        ? "border-slate-200 bg-slate-100 text-slate-500"
                        : "border-white/10 bg-white/5 text-slate-300"
                  }`}
                >
                  {getInitials(profile.name)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium">
                    {profile.name}
                  </span>
                  <span
                    className={`mt-0.5 block text-[11px] ${
                      isLight ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Inventory and schedules
                  </span>
                </span>
                {isActive && (
                  <Check
                    size={16}
                    weight="bold"
                    className="flex-shrink-0"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
