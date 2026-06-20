"use client";

import { useState } from "react";
import {
  Check,
  Languages,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSignOut } from "@/features/auth";
import { ProfileSettingsDialog } from "@/features/profiles";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/**
 * Unified account menu (sidebar + mobile drawer): avatar trigger opening a
 * dropdown with language and theme submenus, profile settings and sign out.
 * In `collapsed` mode the trigger shows only the avatar.
 */
export function UserMenu({
  name,
  email,
  collapsed = false,
}: {
  name: string;
  email: string;
  collapsed?: boolean;
}) {
  const t = useTranslations("userMenu");
  const tLang = useTranslations("language");
  const tTheme = useTranslations("theme");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const signOut = useSignOut();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              className={cn(
                "h-auto w-full gap-2 px-2 py-1.5",
                collapsed ? "justify-center" : "justify-start"
              )}
              aria-label={t("account")}
            />
          }
        >
          <Avatar size="sm">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="flex min-w-0 flex-col items-start">
              <span className="truncate text-sm leading-tight font-medium">
                {name}
              </span>
              <span className="text-muted-foreground truncate text-xs leading-tight font-normal">
                {email}
              </span>
            </div>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="size-4" />
              {tLang("label")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              {routing.locales.map((loc) => (
                <DropdownMenuItem
                  key={loc}
                  onClick={() => router.replace(pathname, { locale: loc })}
                >
                  {tLang(loc)}
                  {loc === locale && <Check className="ml-auto size-4" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Sun className="size-4" />
              {tTheme("toggle")}
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun className="size-4" />
                {tTheme("light")}
                {theme === "light" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon className="size-4" />
                {tTheme("dark")}
                {theme === "dark" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor className="size-4" />
                {tTheme("system")}
                {theme === "system" && <Check className="ml-auto size-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={() => setProfileOpen(true)}>
            <Settings className="size-4" />
            {t("profile")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            variant="destructive"
            disabled={signOut.isPending}
            onClick={() => signOut.mutate()}
          >
            <LogOut className="size-4" />
            {t("signOut")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsDialog open={profileOpen} onOpenChange={setProfileOpen} />
    </>
  );
}
