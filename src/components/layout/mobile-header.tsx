"use client";

import { useState, useRef, useEffect } from "react";
import { useProfileStore } from "@/stores/profile-store";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

interface MobileHeaderProps {
  username: string;
}

export function MobileHeader({ username }: MobileHeaderProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const profiles = useProfileStore((s) => s.profiles);
  const activeProfileId = useProfileStore((s) => s.activeProfileId);
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile);

  const activeProfile = profiles.find((p) => p.id === activeProfileId);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <header className="lg:hidden flex items-center justify-between px-4 h-14 bg-slate-950 border-b border-slate-800 flex-shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-teal-500/10 border border-teal-500/20">
          <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-teal-400">
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm1-13h-2v4H7v2h4v4h2v-4h4v-2h-4z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold text-white">MedTrack</span>
      </div>

      {/* Profile selector button */}
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Switch profile"
        >
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold">
            {activeProfile ? getInitials(activeProfile.name) : "?"}
          </span>
          <span className="text-sm font-medium text-slate-200 max-w-24 truncate hidden xs:block">
            {activeProfile?.name ?? "Profile"}
          </span>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            className={`w-3.5 h-3.5 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        {/* Dropdown */}
        {open && profiles.length > 0 && (
          <div
            className="absolute top-full right-0 mt-1 w-48 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
            role="listbox"
          >
            <p className="px-3 pt-2 pb-1 text-xs font-medium text-slate-500 uppercase tracking-wider">
              Switch Profile
            </p>
            {profiles.map((profile) => {
              const isActive = profile.id === activeProfileId;
              return (
                <button
                  key={profile.id}
                  role="option"
                  aria-selected={isActive}
                  onClick={() => {
                    setActiveProfile(profile.id);
                    setOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-3 py-2.5 text-left text-sm transition-colors cursor-pointer ${
                    isActive
                      ? "bg-teal-500/10 text-teal-400"
                      : "text-slate-300 hover:bg-slate-800"
                  }`}
                >
                  <span
                    className={`flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                      isActive
                        ? "bg-teal-500/20 text-teal-400"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {getInitials(profile.name)}
                  </span>
                  <span className="flex-1 truncate">{profile.name}</span>
                  {isActive && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="w-3.5 h-3.5 text-teal-400 flex-shrink-0"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
