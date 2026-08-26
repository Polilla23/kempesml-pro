"use client";

import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { RatingBadge } from "@/components/common/rating-badge";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { competitionIcon } from "@/lib/football";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { PlayerSeason } from "../types";

const GRID =
  "grid grid-cols-[70px_minmax(140px,1.5fr)_minmax(80px,1fr)_44px_44px_44px_44px_44px_44px_56px_80px] gap-x-2 px-4 md:px-5";

const gpm = (goals: number, played: number) => (played ? (goals / played).toFixed(2) : "—");

function stageClass(stage: string) {
  if (stage.startsWith("Campeón")) return "text-amber-600 dark:text-amber-400";
  if (stage === "Final" || stage === "Semifinal") return "text-emerald-600 dark:text-emerald-400";
  return "text-muted-foreground";
}

export function PlayerSeasonsTable({
  seasons,
  isLoading,
}: {
  seasons: PlayerSeason[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("playerProfile.seasons");
  // Latest season starts expanded; user toggles override it.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isOpen = (season: string, index: number) => expanded[season] ?? index === 0;
  const toggle = (s: string, index: number) =>
    setExpanded((e) => ({ ...e, [s]: !isOpen(s, index) }));

  const totals = (seasons ?? []).reduce(
    (acc, s) => ({
      played: acc.played + s.played,
      goals: acc.goals + s.goals,
      assists: acc.assists + s.assists,
      yellow: acc.yellow + s.yellow_cards,
      red: acc.red + s.red_cards,
    }),
    { played: 0, goals: 0, assists: 0, yellow: 0, red: 0 }
  );

  return (
    <SectionCard flush title={t("title")}>
      <div className="overflow-x-auto">
        <div className="min-w-165">
          <div className={cn(GRID, "bg-muted/50 py-2.5 text-[11px] tracking-wide text-muted-foreground uppercase")}>
            <span>{t("season")}</span>
            <span>{t("club")}</span>
            <span>{t("division")}</span>
            <span className="text-center">{t("rating")}</span>
            <span className="text-center">{t("played")}</span>
            <span className="text-center">{t("goals")}</span>
            <span className="text-center">{t("assists")}</span>
            <span className="text-center">🟨</span>
            <span className="text-center">🟥</span>
            <span className="text-center">{t("goalsPerMatch")}</span>
            <span className="text-right">{t("value")}</span>
          </div>

          {isLoading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-t px-4 py-2.5">
                <Skeleton className="h-5" />
              </div>
            ))}

          {seasons?.map((s, index) => {
            const open = isOpen(s.season, index);
            return (
              <Fragment key={s.season}>
                <button
                  type="button"
                  onClick={() => toggle(s.season, index)}
                  className={cn(GRID, "w-full items-center border-t py-2.5 text-left text-[13px] hover:bg-muted/40")}
                >
                  <span className="flex items-center gap-1.5 font-bold">
                    {open ? (
                      <ChevronDown className="size-3 text-primary" />
                    ) : (
                      <ChevronRight className="size-3 text-primary" />
                    )}
                    {s.season}
                  </span>
                  <span className="flex min-w-0 items-center gap-2">
                    <ClubAvatar name={s.team.name} color={s.team.color} size="xs" />
                    <Link
                      href={`/teams/${s.team.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="truncate font-semibold hover:underline"
                    >
                      {s.team.name}
                    </Link>
                  </span>
                  <span className="truncate text-xs text-muted-foreground">{s.division_name}</span>
                  <RatingBadge rating={s.rating} className="text-center" />
                  <span className="text-center">{s.played}</span>
                  <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{s.goals}</span>
                  <span className="text-center">{s.assists}</span>
                  <span className="text-center text-amber-600 dark:text-amber-400">{s.yellow_cards}</span>
                  <span className="text-center text-red-600 dark:text-red-400">{s.red_cards}</span>
                  <span className="text-center text-muted-foreground">{gpm(s.goals, s.played)}</span>
                  <span className="text-right font-bold">
                    {s.value != null ? formatMoney(s.value) : "—"}
                  </span>
                </button>

                {open &&
                  s.competitions.map((c) => (
                    <div
                      key={c.competition}
                      className={cn(GRID, "items-center border-t border-foreground/5 bg-muted/30 py-2 text-xs")}
                    >
                      <span />
                      <span className="flex items-center gap-1.5 text-foreground/80">
                        <span className="text-[13px]">{competitionIcon(c.competition_kind)}</span>
                        <span className="truncate font-semibold">{c.competition}</span>
                      </span>
                      <span className={cn("truncate text-[11px] font-bold", stageClass(c.stage))}>{c.stage}</span>
                      <span />
                      <span className="text-center text-foreground/80">{c.played}</span>
                      <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{c.goals}</span>
                      <span className="text-center text-foreground/80">{c.assists}</span>
                      <span className="text-center text-amber-600 dark:text-amber-400">{c.yellow_cards}</span>
                      <span className="text-center text-red-600 dark:text-red-400">{c.red_cards}</span>
                      <span className="text-center text-muted-foreground">{gpm(c.goals, c.played)}</span>
                      <span />
                    </div>
                  ))}
              </Fragment>
            );
          })}

          {seasons && (
            <div className={cn(GRID, "border-t-2 bg-muted/50 py-2.5 text-[13px] font-extrabold")}>
              <span>{t("total")}</span>
              <span>—</span>
              <span />
              <span />
              <span className="text-center">{totals.played}</span>
              <span className="text-center text-emerald-600 dark:text-emerald-400">{totals.goals}</span>
              <span className="text-center">{totals.assists}</span>
              <span className="text-center text-amber-600 dark:text-amber-400">{totals.yellow}</span>
              <span className="text-center text-red-600 dark:text-red-400">{totals.red}</span>
              <span className="text-center">{gpm(totals.goals, totals.played)}</span>
              <span />
            </div>
          )}
        </div>
      </div>
    </SectionCard>
  );
}
