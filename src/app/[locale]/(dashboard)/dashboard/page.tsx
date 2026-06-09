import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("nav");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">{t("dashboard")}</h1>

      <Card>
        <CardHeader>
          <CardTitle>👋</CardTitle>
          <CardDescription>
            Base lista: auth, layout, i18n y tema. Próximo: features.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
