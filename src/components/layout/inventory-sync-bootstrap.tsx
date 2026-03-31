"use client";

import { useEffect } from "react";
import { backfillAllProfiles, triggerDailyDeductions } from "@/actions/backfill";

const LAST_SYNC_KEY = "medtrack-last-inventory-sync";

export function InventorySyncBootstrap() {
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);

    if (window.localStorage.getItem(LAST_SYNC_KEY) === today) {
      return;
    }

    window.localStorage.setItem(LAST_SYNC_KEY, today);

    void triggerDailyDeductions();
    backfillAllProfiles().catch(() => {
      window.localStorage.removeItem(LAST_SYNC_KEY);
    });
  }, []);

  return null;
}

