import { setRequestLocale } from "next-intl/server";

import { TeamProfile } from "@/features/teams";
import type { Locale } from "@/i18n/routing";

export default async function TeamProfilePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as Locale);

  return <TeamProfile teamId={id} />;
}
