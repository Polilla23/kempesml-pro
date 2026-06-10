"use client";

import { useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { NAV_SECTIONS } from "./nav-config";

/**
 * Navigation links, shared between the desktop sidebar and the mobile drawer.
 * Renders grouped sections; admin-only sections are hidden for non-admins.
 * `onNavigate` lets the mobile drawer close itself when a link is clicked.
 */
export function NavLinks({
  role,
  onNavigate,
}: {
  role: string;
  onNavigate?: () => void;
}) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const isAdmin = role === "admin";

  const sections = NAV_SECTIONS.filter((s) => !s.adminOnly || isAdmin);

  return (
    <nav className="flex-1 space-y-4 overflow-y-auto p-3">
      {sections.map((section) => (
        <div key={section.key} className="space-y-1">
          <p className="text-muted-foreground px-3 py-1 text-xs font-medium tracking-wider uppercase">
            {t(`sections.${section.key}` as Parameters<typeof t>[0])}
          </p>
          {section.items.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.key}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="size-4 shrink-0" />
                {t(item.key as Parameters<typeof t>[0])}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );
}
