"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { PlayerAvatar } from "@/components/common/player-avatar";
import { RatingBadge } from "@/components/common/rating-badge";
import { SectionCard } from "@/components/common/section-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { POSITION_GROUPS, type PositionGroup } from "@/lib/football";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { SquadPlayer } from "../../types";

type Filter = "all" | PositionGroup | "transferables";
type SortKey = "rating" | "played" | "goals" | "assists" | "salary" | "value";

const FILTERS: Filter[] = ["all", ...POSITION_GROUPS, "transferables"];
const SORT_COLS: { key: SortKey; align: "center" | "right" }[] = [
  { key: "rating", align: "center" },
  { key: "played", align: "center" },
  { key: "goals", align: "center" },
  { key: "assists", align: "center" },
  { key: "salary", align: "right" },
  { key: "value", align: "right" },
];

const GRID =
  "grid grid-cols-[minmax(160px,1.6fr)_40px_50px_50px_44px_40px_40px_90px_84px_110px] gap-x-2 px-4 md:px-5";

export function SquadTable({
  squad,
  isLoading,
}: {
  squad: SquadPlayer[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.squad");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean } | null>(null);

  const rows = useMemo(() => {
    let list = squad ?? [];
    if (filter === "transferables") list = list.filter((p) => p.transferable);
    else if (filter !== "all") list = list.filter((p) => p.position_group === filter);
    if (sort) {
      const dir = sort.desc ? -1 : 1;
      list = [...list].sort((a, b) => (a[sort.key] - b[sort.key]) * dir);
    }
    return list;
  }, [squad, filter, sort]);

  const toggleSort = (key: SortKey) =>
    setSort((s) => ({ key, desc: s?.key === key ? !s.desc : true }));

  return (
    <SectionCard
      flush
      title={
        <>
          {t("title")}{" "}
          <span className="font-semibold text-muted-foreground">
            · {t("count", { count: rows.length })}
          </span>
        </>
      }
      action={
        <div className="hidden flex-wrap gap-1.5 sm:flex">
          {FILTERS.map((f) => (
            <Button
              key={f}
              size="xs"
              variant={filter === f ? "default" : "outline"}
              className="rounded-full"
              onClick={() => setFilter(f)}
            >
              {t(`filters.${f}`)}
            </Button>
          ))}
        </div>
      }
    >
      {/* Filters on mobile go below the header so the title does not wrap. */}
      <div className="flex flex-wrap gap-1.5 border-b px-4 py-3 sm:hidden">
        {FILTERS.map((f) => (
          <Button
            key={f}
            size="xs"
            variant={filter === f ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setFilter(f)}
          >
            {t(`filters.${f}`)}
          </Button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-180">
          <div className={cn(GRID, "bg-muted/50 py-2 text-[11px] text-muted-foreground uppercase")}>
            <span>{t("columns.player")}</span>
            <span className="text-center">{t("columns.nat")}</span>
            <span className="text-center">{t("columns.pos")}</span>
            {SORT_COLS.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => toggleSort(c.key)}
                className={cn(
                  "font-bold uppercase hover:text-foreground",
                  c.align === "right" ? "text-right" : "text-center",
                  sort?.key === c.key && "text-primary"
                )}
              >
                {t(`columns.${c.key}`)}
                {sort?.key === c.key && (sort.desc ? " ↓" : " ↑")}
              </button>
            ))}
            <span className="text-center">{t("columns.status")}</span>
          </div>

          {isLoading &&
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border-t px-4 py-2.5">
                <Skeleton className="h-6" />
              </div>
            ))}

          {rows.map((p) => (
            <div
              key={p.player_id}
              className={cn(GRID, "items-center border-t py-2.5 text-[13px] hover:bg-muted/40")}
            >
              <Link href={`/players/${p.player_id}`} className="flex min-w-0 items-center gap-2.5 hover:underline">
                <PlayerAvatar name={p.name} src={p.photo_url} size="sm" />
                <span className="truncate font-semibold">{p.name}</span>
              </Link>
              <span className="text-center text-[15px]">{p.nationality_flag}</span>
              <span className="text-center text-[11px] font-bold text-muted-foreground">{p.position}</span>
              <RatingBadge rating={p.rating} className="text-center" />
              <span className="text-center text-muted-foreground">{p.played}</span>
              <span className="text-center font-bold text-emerald-600 dark:text-emerald-400">{p.goals}</span>
              <span className="text-center text-muted-foreground">{p.assists}</span>
              <span className="text-right text-muted-foreground">{formatMoney(p.salary)}</span>
              <span className="text-right font-extrabold text-primary">{formatMoney(p.value)}</span>
              <span className="text-center">
                <Badge
                  variant={p.transferable ? "outline" : "secondary"}
                  className={cn(p.transferable && "border-orange-500/40 bg-orange-500/10 text-orange-600 dark:text-orange-400")}
                >
                  {p.transferable ? t("transferable") : t("untransferable")}
                </Badge>
              </span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
