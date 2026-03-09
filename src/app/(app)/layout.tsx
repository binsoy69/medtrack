import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types/database";
import { AppShell } from "@/components/layout/app-shell";
import { backfillAllProfiles } from "@/actions/backfill";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Run backfill for all profiles before rendering
  await backfillAllProfiles();

  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <AppShell user={user} profiles={(profiles as Profile[] | null) ?? []}>
      {children}
    </AppShell>
  );
}
