import { getTranslations, setRequestLocale } from "next-intl/server";

import { StandingsView } from "@/features/competitions";
import type { Locale } from "@/i18n/routing";

export default async function StandingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("standings")}</h1>
      <StandingsView />
    </div>
  );
}
