"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { competitionTextClass } from "@/lib/football";
import { formatFixtureDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { TeamFixture } from "../../types";

export function FixturesCarousel({
  fixtures,
  isLoading,
}: {
  fixtures: TeamFixture[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.fixtures");
  const locale = useLocale();
  const scroller = useRef<HTMLDivElement>(null);

  const scrollBy = (dx: number) =>
    scroller.current?.scrollBy({ left: dx, behavior: "smooth" });

  return (
    <SectionCard
      title={t("title")}
      action={
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon-sm" aria-label={t("prev")} onClick={() => scrollBy(-300)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-sm" aria-label={t("next")} onClick={() => scrollBy(300)}>
            <ChevronRight />
          </Button>
        </div>
      }
    >
      <div
        ref={scroller}
        className="flex snap-x gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-36 w-64 shrink-0 rounded-xl" />
          ))}
        {!isLoading && fixtures?.length === 0 && (
          <p className="py-6 text-sm text-muted-foreground">{t("empty")}</p>
        )}
        {fixtures?.map((fx) => (
          <article
            key={fx.id}
            className="flex w-64 shrink-0 snap-start flex-col gap-3 rounded-xl border bg-background/40 p-4"
          >
            <div className="flex justify-between text-[11px] text-muted-foreground">
              <span className={cn("font-bold", competitionTextClass(fx.competition_kind))}>
                {fx.competition}
              </span>
              <span className="capitalize">
                {fx.kickoff_at
                  ? formatFixtureDate(fx.kickoff_at, locale)
                  : fx.plazo
                    ? t("plazo", { n: fx.plazo })
                    : t("tbd")}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ClubAvatar name={fx.rival.name} color={fx.rival.color} />
              <div className="min-w-0">
                <div className="truncate text-sm font-extrabold">{fx.rival.name}</div>
                <div className="text-[11px] text-muted-foreground">
                  {fx.is_home ? t("home") : t("away")} · {t("manager")}: {fx.rival.manager_name}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {/* TODO: wire to the chat/contact feature when it exists. */}
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                {t("contact")}
              </Button>
              {/* TODO: link to /submit-result?match=fx.id once that page is built. */}
              <Button size="sm" className="flex-1 text-xs">
                {t("submitResult")}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
