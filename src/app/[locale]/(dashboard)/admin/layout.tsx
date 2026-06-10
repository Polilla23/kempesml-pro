import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { profilesService } from "@/features/profiles";
import type { Locale } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";

/**
 * Gate for /admin/* routes. The proxy only checks authentication; this enforces
 * that the user is actually an admin (defense in depth beyond hiding nav items).
 */
export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const supabase = await createClient();
  const profile = await profilesService.getCurrent(supabase);

  if (profile?.role !== "admin") {
    redirect(`/${locale}/dashboard`);
  }

  return <>{children}</>;
}
