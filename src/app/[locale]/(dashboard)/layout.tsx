import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { profilesService } from "@/features/profiles";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Belt-and-suspenders: the proxy already gates this, but guard here too.
  if (!user) {
    redirect(`/${locale}/sign-in`);
  }

  const profile = await profilesService.getCurrent(supabase);
  const name = profile?.name ?? user.email ?? "?";
  const email = profile?.mail ?? user.email ?? "";

  return (
    <div className="flex min-h-screen">
      <AppSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader name={name} email={email} />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
