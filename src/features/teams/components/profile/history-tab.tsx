"use client";

import { useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { competitionIcon, competitionTextClass } from "@/lib/football";
import { cn } from "@/lib/utils";

import type { TeamRecord, TeamSeasonEntry } from "../../types";

const GRID =
  "grid grid-cols-[60px_minmax(150px,1.2fr)_100px_44px_44px_44px_44px_60px_minmax(150px,1.2fr)] gap-x-2 px-4 md:px-5";

const ACHIEVEMENT_CLASS = {
  gold: "text-amber-600 dark:text-amber-400",
  ok: "text-emerald-600 dark:text-emerald-400",
  none: "text-muted-foreground",
} as const;

const RECORD_TONE = {
  green: "text-emerald-600 dark:text-emerald-400",
  blue: "text-primary",
  gold: "text-amber-600 dark:text-amber-400",
} as const;

function positionClass(label: string) {
  if (label === "1°" || label === "Campeón") return "text-amber-600 dark:text-amber-400";
  if (["2°", "3°", "Final"].includes(label)) return "text-emerald-600 dark:text-emerald-400";
  return "text-muted-foreground";
}

export function HistoryTab({
  history,
  records,
  isLoading,
}: {
  history: TeamSeasonEntry[] | undefined;
  records: TeamRecord[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.history");

  return (
    <div className="flex flex-col gap-5">
      <SectionCard flush title={t("title")}>
        <div className="overflow-x-auto">
          <div className="min-w-180">
            <div className={cn(GRID, "bg-muted/50 py-2.5 text-[11px] text-muted-foreground uppercase")}>
              <span>{t("season")}</span>
              <span>{t("competition")}</span>
              <span className="text-center">{t("position")}</span>
              <span className="text-center">{t("played")}</span>
              <span className="text-center">{t("won")}</span>
              <span className="text-center">{t("drawn")}</span>
              <span className="text-center">{t("lost")}</span>
              <span className="text-center">{t("goals")}</span>
              <span>{t("result")}</span>
            </div>
            {isLoading &&
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border-t px-4 py-2.5">
                  <Skeleton className="h-5" />
                </div>
              ))}
            {history?.map((h, i) => {
              const first = i === 0 || history[i - 1].season !== h.season;
              return (
                <div
                  key={`${h.season}-${h.competition}`}
                  className={cn(
                    GRID,
                    "items-center py-2.5 text-[13px] hover:bg-muted/40",
                    first ? "border-t-2" : "border-t"
                  )}
                >
                  <span className="font-extrabold">{first ? h.season : ""}</span>
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm">{competitionIcon(h.competition_kind)}</span>
                    <span className={cn("truncate text-xs font-semibold", competitionTextClass(h.competition_kind))}>
                      {h.competition}
                    </span>
                  </span>
                  <span className={cn("text-center text-xs font-extrabold", positionClass(h.position_label))}>
                    {h.position_label}
                  </span>
                  <span className="text-center text-muted-foreground">{h.played}</span>
                  <span className="text-center">{h.won}</span>
                  <span className="text-center">{h.drawn}</span>
                  <span className="text-center">{h.lost}</span>
                  <span className="text-center text-muted-foreground">
                    {h.goals_for}:{h.goals_against}
                  </span>
                  <span className={cn("truncate text-xs font-semibold", ACHIEVEMENT_CLASS[h.achievement_kind])}>
                    {h.achievement}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading &&
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        {records?.map((r) => (
          <div key={r.key} className="rounded-xl bg-card p-4 ring-1 ring-foreground/10">
            <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{r.label}</div>
            <div className={cn("mt-1.5 text-lg font-black md:text-xl", RECORD_TONE[r.tone])}>{r.value}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{r.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
