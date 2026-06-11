"use client";

import { useTranslations } from "next-intl";

import { MobileNav } from "./mobile-nav";

/**
 * Slim top bar shown only on mobile (md:hidden): the hamburger that opens the
 * nav drawer + the app name. On desktop there is no top bar — everything lives
 * in the sidebar (incl. its footer).
 */
export function MobileHeader({
  role,
  name,
  email,
}: {
  role: string;
  name: string;
  email: string;
}) {
  const t = useTranslations("common");

  return (
    <header className="flex h-14 items-center gap-2 border-b px-4 md:hidden">
      <MobileNav role={role} name={name} email={email} />
      <span className="font-bold tracking-tight">{t("appName")}</span>
    </header>
  );
}
