"use client";

import { useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { ValueRankRow } from "../types";

export function PlayerValueRanking({
  rows,
  isLoading,
}: {
  rows: ValueRankRow[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("playerProfile.valueRank");

  return (
    <SectionCard flush title={t("title")}>
      {isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8" />)}
        </div>
      )}
      {rows?.map((r) => (
        <div
          key={r.player_id}
          className={cn(
            "flex items-center gap-2.5 border-t px-4 py-2 text-[13px] first:border-t-0 md:px-5",
            r.is_self && "bg-primary/10"
          )}
        >
          <span
            className={cn(
              "w-5 font-extrabold",
              r.position === 1 ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
            )}
          >
            {r.position}
          </span>
          <Link
            href={`/players/${r.player_id}`}
            className={cn("flex-1 truncate hover:underline", r.is_self ? "font-extrabold" : "font-medium")}
          >
            {r.name}
          </Link>
          <span className="text-[11px] text-muted-foreground">{r.team_name}</span>
          <span className="font-extrabold text-primary">{formatMoney(r.value)}</span>
        </div>
      ))}
    </SectionCard>
  );
}
