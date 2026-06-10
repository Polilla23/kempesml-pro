"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { NavLinks } from "./nav-links";

/** Hamburger + slide-in nav drawer. Only rendered on small screens. */
export function MobileNav({ role }: { role: string }) {
  const t = useTranslations("common");
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("menu")}
          />
        }
      >
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="h-14 justify-center border-b px-6">
          <SheetTitle className="text-lg font-bold tracking-tight">
            {t("appName")}
          </SheetTitle>
        </SheetHeader>
        <NavLinks role={role} onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
