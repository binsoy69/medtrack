import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";
import { ProfileManager } from "@/components/settings/profile-manager";

export const metadata: Metadata = {
  title: "Settings — MedTrack",
};

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: true });

  const username =
    (user?.user_metadata?.username as string | undefined) ?? "User";

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profiles and account preferences.
        </p>
      </div>

      {/* Account info card */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Account
          </h2>
        </div>
        <div className="px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-teal-500/10 border border-teal-500/20">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                className="w-5 h-5 text-teal-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">{username}</p>
              <p className="text-xs text-slate-500">Signed in account</p>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 bg-slate-50 rounded-lg p-3 border border-slate-100">
            Account settings (username, password, timezone, notifications) will
            be available in a future update.
          </p>
        </div>
      </section>

      {/* Profile management card */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
                Profiles
              </h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Each profile tracks its own medication inventory. Up to 5
                profiles per account.
              </p>
            </div>
            <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
              {profiles?.length ?? 0} / 5
            </span>
          </div>
        </div>
        <div className="px-6 py-5">
          <ProfileManager initialProfiles={(profiles as Profile[] | null) ?? []} />
        </div>
      </section>
    </div>
  );
}
