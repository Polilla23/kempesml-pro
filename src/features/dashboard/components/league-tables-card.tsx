"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/features/profiles";
import { TeamAvatar } from "@/features/teams";
import { Link } from "@/i18n/navigation";
import { formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useLeagueTables } from "../hooks/use-dashboard";

const GRID =
  "grid grid-cols-[26px_minmax(150px,1fr)_32px_32px_32px_32px_48px_40px_40px] gap-x-1.5 px-4";

export function LeagueTablesCard() {
  const t = useTranslations("home.tables");
  const tc = useTranslations("competitions.standings");
  const tables = useLeagueTables();
  const myTeamId = useCurrentProfile().data?.team_id;
  const [idx, setIdx] = useState(0);

  const count = tables.data?.length ?? 0;
  const table = tables.data?.[Math.min(idx, Math.max(count - 1, 0))];

  return (
    <SectionCard
      flush
      title={
        table ? `${table.name}${table.division ? ` · ${table.division}` : ""}` : t("title")
      }
      action={
        <div className="flex items-center gap-2">
          <Link href="/standings" className="text-[11px] font-bold text-primary hover:underline">
            {t("fullTable")} ›
          </Link>
          {count > 1 && (
            <>
              <Button variant="outline" size="icon-sm" aria-label={t("prev")} onClick={() => setIdx((i) => (i + count - 1) % count)}>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon-sm" aria-label={t("next")} onClick={() => setIdx((i) => (i + 1) % count)}>
                <ChevronRight />
              </Button>
            </>
          )}
        </div>
      }
    >
      {tables.isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </div>
      )}
      {!tables.isLoading && !table && (
        <p className="p-6 text-sm text-muted-foreground">{t("empty")}</p>
      )}
      {table && (
        <div className="overflow-x-auto">
          <div className="min-w-140">
            <div className={cn(GRID, "bg-muted/50 py-2 text-[10px] text-muted-foreground uppercase")}>
              <span>#</span>
              <span>{tc("club")}</span>
              <span className="text-center">{tc("played")}</span>
              <span className="text-center">{tc("won")}</span>
              <span className="text-center">{tc("drawn")}</span>
              <span className="text-center">{tc("lost")}</span>
              <span className="text-center">GF:GC</span>
              <span className="text-center">{tc("goalDiff")}</span>
              <span className="text-center">{tc("points")}</span>
              {/* TODO(db): columna "Forma" (últimos 5 W/D/L por equipo) cuando
                  las standings incluyan la racha — docs/db-pending-home.md §7. */}
            </div>
            {table.rows.map((r) => (
              <div
                key={r.team_id}
                className={cn(
                  GRID,
                  "items-center border-t py-2.5 text-[13px] hover:bg-muted/40",
                  r.team_id === myTeamId && "bg-primary/10"
                )}
              >
                <span className="font-extrabold text-muted-foreground">{r.position}</span>
                <Link href={`/teams/${r.team_id}`} className="flex min-w-0 items-center gap-2 hover:underline">
                  <TeamAvatar teamId={r.team_id} name={r.team_name} size="sm" />
                  <span className="flex min-w-0 flex-col">
                    <span className={cn("truncate", r.team_id === myTeamId ? "font-extrabold" : "font-bold")}>
                      {r.team_name}
                    </span>
                    {r.manager_name && (
                      <span className="truncate text-[10px] text-muted-foreground">{r.manager_name}</span>
                    )}
                  </span>
                </Link>
                <span className="text-center text-muted-foreground">{r.played}</span>
                <span className="text-center text-muted-foreground">{r.won}</span>
                <span className="text-center text-muted-foreground">{r.drawn}</span>
                <span className="text-center text-muted-foreground">{r.lost}</span>
                <span className="text-center text-[11px] text-muted-foreground">
                  {r.goals_for}:{r.goals_against}
                </span>
                <span
                  className={cn(
                    "text-center font-semibold",
                    r.goal_diff > 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : r.goal_diff < 0
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted-foreground"
                  )}
                >
                  {formatSigned(r.goal_diff)}
                </span>
                <span className="text-center font-extrabold">{r.points}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </SectionCard>
  );
}
