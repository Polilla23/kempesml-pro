"use client";

import Image from "next/image";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { NavLinks } from "./nav-links";
import { useSidebar } from "./sidebar-context";
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
  const { collapsed, toggle } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-sidebar hidden shrink-0 flex-col border-r transition-[width] duration-200 ease-linear md:flex",
        collapsed ? "w-[3.25rem]" : "w-64"
      )}
    >
      {collapsed ? (
        <div className="flex flex-col items-center gap-1 border-b px-2 py-2">
          <Image
            src="/images/120.png"
            alt={t("appName")}
            width={24}
            height={24}
            className="size-6 select-none"
            priority
          />
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={t("menu")}
          >
            <PanelLeftOpen />
          </Button>
        </div>
      ) : (
        <div className="relative flex flex-col items-center gap-1 border-b px-4 py-3 text-center">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggle}
            aria-label={t("menu")}
            className="absolute top-2 right-2"
          >
            <PanelLeftClose />
          </Button>
          <Image
            src="/images/120.png"
            alt={t("appName")}
            width={64}
            height={64}
            className="size-14 select-none"
            priority
          />
          <span className="text-base font-bold tracking-tight">
            {t("appName")}
          </span>
          <span className="text-muted-foreground px-2 text-xs italic">
            {t("appTagline")}
          </span>
        </div>
      )}

      <NavLinks role={role} collapsed={collapsed} />
      <SidebarFooter name={name} email={email} collapsed={collapsed} />
    </aside>
  );
}
