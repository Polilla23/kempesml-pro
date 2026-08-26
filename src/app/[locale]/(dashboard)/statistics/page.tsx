import { getTranslations, setRequestLocale } from "next-intl/server";

import { StatsView } from "@/features/competitions";
import type { Locale } from "@/i18n/routing";

export default async function StatisticsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("statistics")}</h1>
      <StatsView />
    </div>
  );
}
