import { getTranslations, setRequestLocale } from "next-intl/server";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignUpForm } from "@/features/auth";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";

export default async function SignUpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  const t = await getTranslations("auth");

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">{t("signUpTitle")}</CardTitle>
        <CardDescription>{t("signUpSubtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SignUpForm />
        <p className="text-muted-foreground text-center text-sm">
          {t("haveAccount")}{" "}
          <Link
            href="/sign-in"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            {t("signInLink")}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
