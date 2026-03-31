"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDots,
  House,
  Pill,
  SlidersHorizontal,
} from "@phosphor-icons/react";

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

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="safe-area-bottom mx-4 mb-3 rounded-[20px] border border-white/70 bg-white/90 px-1.5 py-1.5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur">
        <div className="flex items-stretch">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-[50px] flex-1 flex-col items-center justify-center gap-1 rounded-[14px] transition-colors ${
                isActive
                  ? "bg-emerald-50 text-emerald-700"
                  : "text-slate-400 hover:text-slate-700"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} weight={isActive ? "fill" : "regular"} />
              <span
                className={`text-[11px] font-medium leading-none ${
                  isActive ? "text-emerald-700" : "text-slate-500"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        </div>
      </div>
    </nav>
  );
}
