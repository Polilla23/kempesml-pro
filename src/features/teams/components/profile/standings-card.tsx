"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { StandingsTable } from "../../types";

const GRID = "grid grid-cols-[28px_1fr_34px_34px_34px_52px] gap-x-1.5 px-4 md:px-5";

export function StandingsCard({
  tables,
  isLoading,
}: {
  tables: StandingsTable[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.standings");
  const [idx, setIdx] = useState(0);
  const count = tables?.length ?? 0;
  const table = tables?.[idx];

  return (
    <SectionCard
      flush
      title={
        <>
          {t("title")}
          {table && (
            <>
              {" · "}
              <span className="text-primary">{table.competition_name}</span>
            </>
          )}
        </>
      }
      action={
        count > 1 && (
          <div className="flex gap-1.5">
            <Button variant="outline" size="icon-sm" aria-label={t("prev")} onClick={() => setIdx((i) => (i + count - 1) % count)}>
              <ChevronLeft />
            </Button>
            <Button variant="outline" size="icon-sm" aria-label={t("next")} onClick={() => setIdx((i) => (i + 1) % count)}>
              <ChevronRight />
            </Button>
          </div>
        )
      }
    >
      {isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8" />
          ))}
        </div>
      )}
      {table && (
        <div>
          <div className={cn(GRID, "bg-muted/50 py-2 text-[11px] text-muted-foreground uppercase")}>
            <span>{t("pos")}</span>
            <span>{t("club")}</span>
            <span className="text-center">{t("played")}</span>
            <span className="text-center">{t("gd")}</span>
            <span className="text-center">{t("pts")}</span>
            <span />
          </div>
          {table.rows.map((r) => (
            <div
              key={r.team_id}
              className={cn(
                GRID,
                "items-center border-t py-2 text-[13px]",
                r.is_self && "bg-primary/10"
              )}
            >
              <span
                className={cn(
                  "font-extrabold",
                  r.position <= 2
                    ? "text-emerald-600 dark:text-emerald-400"
                    : r.position >= table.rows.length
                      ? "text-red-600 dark:text-red-400"
                      : "text-muted-foreground"
                )}
              >
                {r.position}
              </span>
              <Link
                href={`/teams/${r.team_id}`}
                className={cn("truncate hover:underline", r.is_self ? "font-extrabold" : "font-medium")}
              >
                {r.team_name}
              </Link>
              <span className="text-center text-muted-foreground">{r.played}</span>
              <span className="text-center text-muted-foreground">{formatSigned(r.goal_diff)}</span>
              <span className="text-center font-extrabold">{r.points}</span>
              <span className="truncate text-[10px] text-muted-foreground">{r.note}</span>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
