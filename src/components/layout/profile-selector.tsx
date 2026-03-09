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

export function ProfileSelector() {
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

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2.5 w-full px-2 py-2 rounded-lg hover:bg-slate-800/60 transition-colors cursor-pointer group"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/30 text-teal-400 text-xs font-bold">
          {activeProfile ? getInitials(activeProfile.name) : "?"}
        </span>

        <span className="flex-1 min-w-0 text-left">
          <span className="block text-sm font-medium text-slate-200 truncate">
            {activeProfile?.name ?? "Select profile"}
          </span>
          <span className="block text-xs text-slate-500">
            {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
          </span>
        </span>

        {/* Chevron */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          className={`w-4 h-4 text-slate-500 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
          role="listbox"
          aria-label="Select profile"
        >
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
                className={`flex items-center gap-2.5 w-full px-3 py-2.5 text-left transition-colors cursor-pointer ${
                  isActive
                    ? "bg-teal-500/10 text-teal-400"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <span
                  className={`flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                    isActive
                      ? "bg-teal-500/20 border border-teal-500/40 text-teal-400"
                      : "bg-slate-700 text-slate-400"
                  }`}
                >
                  {getInitials(profile.name)}
                </span>
                <span className="flex-1 text-sm font-medium truncate">
                  {profile.name}
                </span>
                {isActive && (
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    className="w-4 h-4 text-teal-400 flex-shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
