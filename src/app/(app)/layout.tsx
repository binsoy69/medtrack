import { redirect } from "next/navigation";
import { getAppContext } from "@/lib/data/app-context";
import { AppShell } from "@/components/layout/app-shell";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, username, profiles, activeProfileId } = await getAppContext();

  if (!user) redirect("/login");

  return (
    <AppShell
      username={username}
      profiles={profiles}
      initialActiveProfileId={activeProfileId}
    >
      {children}
    </AppShell>
  );
}
