import { Anybody, Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

const anybody = Anybody({ variable: "--font-anybody", subsets: ["latin"] });
const hanken = Hanken_Grotesk({ variable: "--font-hanken", subsets: ["latin"] });
const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

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
    <div
      className={`${anybody.variable} ${hanken.variable} ${jetbrains.variable} bg-kml-surface text-kml-on-surface font-body selection:bg-kml-primary selection:text-kml-on-primary min-h-screen`}
    >
      {children}
    </div>
  );
}
