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
    <div className="mx-auto max-w-2xl space-y-6 px-4 py-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Settings</h1>
        <p className="mt-1 text-[13px] text-slate-500">
          Manage your profiles and account preferences.
        </p>
      </div>

      {/* Change Username */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
            Change Username
          </h2>
        </div>
        <div className="px-5 py-4">
          <ChangeUsernameForm currentUsername={username} />
        </div>
      </section>

      {/* Change Password */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
            Change Password
          </h2>
        </div>
        <div className="px-5 py-4">
          <ChangePasswordForm />
        </div>
      </section>

      {/* Timezone */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
            Timezone
          </h2>
        </div>
        <div className="px-5 py-4">
          <TimezoneForm currentTimezone={timezone} />
        </div>
      </section>

      {/* Notification Email */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
            Notification Email
          </h2>
        </div>
        <div className="px-5 py-4">
          <NotificationEmailForm currentEmail={notificationEmail} />
        </div>
      </section>

      {/* Profile management card */}
      <section className="overflow-hidden rounded-[18px] border border-slate-200 bg-white">
        <div className="border-b border-slate-100 bg-slate-50/60 px-5 py-3">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-700">
                Profiles
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                Each profile tracks its own medication inventory. Up to 5
                profiles per account.
              </p>
            </div>
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-400">
              {profiles?.length ?? 0} / 5
            </span>
          </div>
        </div>
        <div className="px-5 py-4">
          <ProfileManager initialProfiles={(profiles as Profile[] | null) ?? []} />
        </div>
      </section>
    </div>
  );
}
