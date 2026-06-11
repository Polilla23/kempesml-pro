"use client";

import { useTranslations } from "next-intl";

import { NavLinks } from "./nav-links";
import { SidebarFooter } from "./sidebar-footer";

export function AppSidebar({
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
    <aside className="bg-sidebar hidden w-64 shrink-0 flex-col border-r md:flex">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <span className="text-lg font-bold tracking-tight">{t("appName")}</span>
      </div>
      <NavLinks role={role} />
      <SidebarFooter name={name} email={email} />
    </aside>
  );
}
