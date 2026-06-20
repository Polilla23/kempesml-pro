import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthBranding, AuthShell, ResetPasswordForm } from "@/features/auth";
import type { Locale } from "@/i18n/routing";

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("auth");
  const highlight = (chunks: React.ReactNode) => (
    <span className="text-kml-primary italic">{chunks}</span>
  );

  return (
    <AuthShell
      branding={
        <AuthBranding
          eyebrow={t("resetEyebrow")}
          title={t.rich("resetBrandTitle", { hl: highlight })}
          description={t("resetBrandDescription")}
          stats={[
            { value: "2.4k+", label: t("statsPlayersLive") },
            { value: "12", label: t("statsActiveLeagues") },
          ]}
        />
      }
    >
      <div className="space-y-2">
        <h1 className="text-kml-on-surface font-display text-3xl font-bold tracking-tight uppercase">
          {t("resetTitle")}
        </h1>
        <p className="text-kml-on-surface-variant font-body">
          {t("resetSubtitle")}
        </p>
      </div>

      <ResetPasswordForm />
    </AuthShell>
  );
}
