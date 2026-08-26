import { getTranslations, setRequestLocale } from "next-intl/server";

import { PlayersTable } from "@/features/players";
import type { Locale } from "@/i18n/routing";

export default async function PlayersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("players")}</h1>
      <PlayersTable />
    </div>
  );
}
