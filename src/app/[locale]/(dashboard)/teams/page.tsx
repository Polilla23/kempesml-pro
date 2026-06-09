import { getTranslations, setRequestLocale } from "next-intl/server";

import { TeamsTable } from "@/features/teams";
import type { Locale } from "@/i18n/routing";

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("teams")}</h1>
      <TeamsTable />
    </div>
  );
}
