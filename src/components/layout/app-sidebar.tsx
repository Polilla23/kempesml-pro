"use client";

import { useTranslations } from "next-intl";

import { NavLinks } from "./nav-links";

export function AppSidebar() {
  const t = useTranslations("common");

  return (
    <aside className="bg-sidebar hidden w-64 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <span className="text-lg font-bold tracking-tight">{t("appName")}</span>
      </div>
      <NavLinks />
    </aside>
  );
}
