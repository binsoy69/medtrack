import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";
import { ProfileManager } from "@/components/settings/profile-manager";
import { ChangeUsernameForm } from "@/components/settings/change-username-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { TimezoneForm } from "@/components/settings/timezone-form";
import { NotificationEmailForm } from "@/components/settings/notification-email-form";

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
  const timezone =
    (user?.user_metadata?.timezone as string | undefined) ?? "UTC";
  const notificationEmail =
    (user?.user_metadata?.notification_email as string | null) ?? null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profiles and account preferences.
        </p>
      </div>

      {/* Change Username */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Change Username
          </h2>
        </div>
        <div className="px-6 py-5">
          <ChangeUsernameForm currentUsername={username} />
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Change Password
          </h2>
        </div>
        <div className="px-6 py-5">
          <ChangePasswordForm />
        </div>
      </section>

      {/* Timezone */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Timezone
          </h2>
        </div>
        <div className="px-6 py-5">
          <TimezoneForm currentTimezone={timezone} />
        </div>
      </section>

      {/* Notification Email */}
      <section className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60">
          <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wider">
            Notification Email
          </h2>
        </div>
        <div className="px-6 py-5">
          <NotificationEmailForm currentEmail={notificationEmail} />
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
