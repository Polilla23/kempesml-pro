import { setRequestLocale } from "next-intl/server";

import { DashboardHome } from "@/features/dashboard";
import type { Locale } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <DashboardHome />;
}
