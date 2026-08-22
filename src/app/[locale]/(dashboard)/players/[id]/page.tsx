import { setRequestLocale } from "next-intl/server";

import { PlayerProfile } from "@/features/players";
import type { Locale } from "@/i18n/routing";

export default async function PlayerProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);

  return <PlayerProfile playerId={id} />;
}
