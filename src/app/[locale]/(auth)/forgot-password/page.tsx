import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthBranding, AuthShell, ForgotPasswordForm } from "@/features/auth";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function ForgotPasswordPage({
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
          eyebrow={t("forgotEyebrow")}
          title={t.rich("forgotBrandTitle", { hl: highlight })}
          description={t("forgotBrandDescription")}
          stats={[
            { value: "2.4k+", label: t("statsPlayersLive") },
            { value: "12", label: t("statsActiveLeagues") },
          ]}
        />
      }
    >
      <div className="space-y-2">
        <h1 className="text-kml-on-surface font-display text-3xl font-bold tracking-tight uppercase">
          {t("forgotTitle")}
        </h1>
        <p className="text-kml-on-surface-variant font-body">
          {t("forgotSubtitle")}
        </p>
      </div>

      <ForgotPasswordForm />

      <p className="text-kml-on-surface-variant font-body text-center">
        <Link
          href="/sign-in"
          className="text-kml-primary font-bold tracking-tighter uppercase transition-all hover:underline"
        >
          {t("backToSignIn")}
        </Link>
      </p>
    </AuthShell>
  );
}
