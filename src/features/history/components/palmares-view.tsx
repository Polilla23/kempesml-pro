"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Trophy } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TeamAvatar, useTeams } from "@/features/teams";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

import { usePalmares } from "../hooks/use-history";
import type { TitleTone } from "../points";

/** Card styling per podium position (1 gold, 2 silver, 3 bronze, rest plain). */
const TIERS = [
  {
    card: "border-amber-500/45 bg-linear-to-r from-amber-500/10 via-card to-card",
    badge: "bg-amber-400 text-amber-950",
    pts: "text-amber-600 dark:text-amber-400",
    name: "text-lg md:text-xl",
  },
  {
    card: "border-zinc-400/40 bg-linear-to-r from-zinc-400/10 via-card to-card",
    badge: "bg-zinc-300 text-zinc-900",
    pts: "text-foreground/85",
    name: "text-[17px]",
  },
  {
    card: "border-orange-700/40 bg-linear-to-r from-orange-700/10 via-card to-card",
    badge: "bg-orange-700 text-white",
    pts: "text-orange-600 dark:text-orange-400",
    name: "text-base",
  },
  {
    card: "border-border bg-card",
    badge: "bg-muted text-muted-foreground",
    pts: "",
    name: "text-[15px]",
  },
] as const;

const TONE: Record<TitleTone, { box: string; badge: string }> = {
  gold: { box: "border-amber-500/40 bg-amber-500/10", badge: "bg-amber-400 text-amber-950" },
  blue: { box: "border-primary/40 bg-primary/10", badge: "bg-primary text-primary-foreground" },
  green: { box: "border-emerald-500/40 bg-emerald-500/10", badge: "bg-emerald-500 text-white" },
  silver: { box: "border-zinc-400/40 bg-zinc-400/10", badge: "bg-zinc-400 text-zinc-950" },
  plain: { box: "border-border bg-muted/40", badge: "bg-muted-foreground text-background" },
};

export function PalmaresView() {
  const t = useTranslations("history.palmares");
  const palmares = usePalmares();
  const teams = useTeams();
  const [onlyActive, setOnlyActive] = useState(false);
  // Every card starts collapsed; the user opens what they want.
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const isOpen = (id: string) => expanded[id] ?? false;

  // Filter (and re-rank) by team status from the cached teams list.
  const activeIds = new Set(
    teams.data?.filter((tm) => tm.team_status === "activo").map((tm) => tm.id)
  );
  const clubs = onlyActive
    ? palmares.data?.clubs.filter((c) => activeIds.has(c.team_id))
    : palmares.data?.clubs;

  if (palmares.isError) {
    return <EmptyState icon={Trophy} title={t("error")} />;
  }

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1fr)]">
      <div className="flex flex-col gap-3">
        <div className="flex gap-1.5">
          <Button
            size="xs"
            variant={onlyActive ? "outline" : "default"}
            className="rounded-full"
            onClick={() => setOnlyActive(false)}
          >
            {t("filters.all")}
          </Button>
          <Button
            size="xs"
            variant={onlyActive ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setOnlyActive(true)}
          >
            {t("filters.active")}
          </Button>
        </div>

        {palmares.isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        {clubs?.map((club, i) => {
          const tier = TIERS[Math.min(i, 3)];
          const open = isOpen(club.team_id);
          return (
            <div
              key={club.team_id}
              className={cn("overflow-hidden rounded-xl border", tier.card)}
            >
              <button
                type="button"
                onClick={() =>
                  setExpanded((e) => ({ ...e, [club.team_id]: !open }))
                }
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-muted/30 md:px-5"
              >
                <span
                  className={cn(
                    "inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-[15px] font-black",
                    tier.badge
                  )}
                >
                  {i + 1}
                </span>
                <TeamAvatar teamId={club.team_id} name={club.team_name} />
                <Link
                  href={`/teams/${club.team_id}`}
                  onClick={(e) => e.stopPropagation()}
                  className={cn("min-w-0 flex-1 truncate font-black", tier.name)}
                >
                  <span className="hover:underline">{club.team_name}</span>
                </Link>
                <span className="shrink-0 text-right">
                  <span className={cn("block text-lg font-black tabular-nums", tier.pts)}>
                    {t("pts", { pts: club.points })}
                  </span>
                  <span className="block text-[10px] text-muted-foreground">
                    {t("titles", { count: club.titles })}
                  </span>
                </span>
                {open ? (
                  <ChevronDown className="size-3.5 shrink-0 text-primary" />
                ) : (
                  <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
                )}
              </button>

              {open && (
                <div className="flex gap-3.5 overflow-x-auto px-4 pt-1 pb-4 md:px-5">
                  {club.trophies.map((tp) => {
                    const tone = TONE[tp.tone];
                    return (
                      <div
                        key={tp.competition}
                        className="flex min-w-22 shrink-0 flex-col items-center gap-1.5"
                      >
                        <div
                          className={cn(
                            "relative flex size-16 items-center justify-center rounded-xl border text-3xl",
                            tone.box
                          )}
                        >
                          {tp.icon}
                          <span
                            className={cn(
                              "absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[10px] font-black",
                              tone.badge
                            )}
                          >
                            {tp.seasons.length}
                          </span>
                        </div>
                        <span className="max-w-24 truncate text-center text-[10px] font-bold">
                          {tp.competition}
                        </span>
                        <span className="max-w-24 text-center text-[9px] leading-tight text-muted-foreground">
                          {tp.seasons.join(" · ")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SectionCard flush title={t("valuesTitle")} className="lg:sticky lg:top-5">
        {palmares.isLoading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="h-7" />
            ))}
          </div>
        )}
        {palmares.data?.values.map((v) => (
          <div
            key={v.competition}
            className="flex items-center gap-2.5 border-t px-4 py-2.5 text-xs first:border-t-0 md:px-5"
          >
            <span className="w-6 text-center text-lg">{v.icon}</span>
            <span className="min-w-0 flex-1 truncate font-bold">{v.competition}</span>
            <span
              className={cn(
                "font-black tabular-nums",
                v.tone === "gold"
                  ? "text-amber-600 dark:text-amber-400"
                  : v.tone === "blue"
                    ? "text-primary"
                    : v.tone === "green"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-muted-foreground"
              )}
            >
              {t("pts", { pts: v.pts })}
            </span>
          </div>
        ))}
        <div className="border-t px-4 py-2.5 text-[10px] leading-relaxed text-muted-foreground md:px-5">
          {t("valuesNote")}
        </div>
      </SectionCard>
    </div>
  );
}
