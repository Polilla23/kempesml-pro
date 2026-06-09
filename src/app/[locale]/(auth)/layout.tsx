import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {children}
    </div>
  );
}
