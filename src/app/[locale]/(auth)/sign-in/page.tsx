import { getTranslations, setRequestLocale } from "next-intl/server";

import { AuthBranding, AuthShell, SignInForm } from "@/features/auth";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function SignInPage({
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
          eyebrow={t("signInEyebrow")}
          title={t.rich("signInBrandTitle", { hl: highlight })}
          description={t("signInBrandDescription")}
          stats={[
            { value: "2.4k+", label: t("statsPlayersLive") },
            { value: "12", label: t("statsActiveLeagues") },
          ]}
        />
      }
    >
      <div className="space-y-2">
        <h1 className="text-kml-on-surface font-display text-3xl font-bold tracking-tight uppercase md:hidden">
          {t.rich("signInBrandTitle", { hl: highlight })}
        </h1>
        <p className="text-kml-on-surface-variant font-body text-lg">
          {t("signInSubtitle")}
        </p>
      </div>

      <SignInForm />

      <p className="text-kml-on-surface-variant font-body text-center">
        {t("noAccount")}{" "}
        <Link
          href="/sign-up"
          className="text-kml-primary font-bold tracking-tighter uppercase transition-all hover:underline"
        >
          {t("signUpLink")}
        </Link>
      </p>
    </AuthShell>
  );
}
