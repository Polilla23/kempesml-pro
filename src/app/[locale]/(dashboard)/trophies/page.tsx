import { setRequestLocale } from "next-intl/server";

import { HistoryView } from "@/features/history";
import type { Locale } from "@/i18n/routing";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return <HistoryView />;
}
