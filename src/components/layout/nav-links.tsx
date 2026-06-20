"use client";

import { useTranslations } from "next-intl";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { NAV_SECTIONS } from "./nav-config";

/**
 * Navigation links, shared between the desktop sidebar and the mobile drawer.
 * Renders grouped sections; admin-only sections are hidden for non-admins.
 * When `collapsed` (desktop icon-only mode) labels are hidden and each item
 * shows a tooltip. `onNavigate` lets the mobile drawer close on click.
 */
export function NavLinks({
  role,
  collapsed = false,
  onNavigate,
}: {
  role: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isAdmin = role === "admin";

  const sections = NAV_SECTIONS.filter((s) => !s.adminOnly || isAdmin);

  return (
    <TooltipProvider delay={0}>
      <nav
        className={cn(
          "flex-1 space-y-4 overflow-x-hidden overflow-y-auto p-3",
          collapsed && "px-2"
        )}
      >
        {sections.map((section) => (
          <div key={section.key} className="space-y-1">
            {!collapsed && (
              <p className="text-muted-foreground px-3 py-1 text-xs font-medium tracking-wider uppercase">
                {t(`sections.${section.key}` as Parameters<typeof t>[0])}
              </p>
            )}
            {section.items.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              const Icon = item.icon;
              const label = t(item.key as Parameters<typeof t>[0]);

              const link = (
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-label={collapsed ? label : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-0",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && label}
                </Link>
              );

              if (!collapsed) {
                return <div key={item.key}>{link}</div>;
              }

              return (
                <Tooltip key={item.key}>
                  <TooltipTrigger render={link} />
                  <TooltipContent side="right">{label}</TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        ))}
      </nav>
    </TooltipProvider>
  );
}
