"use client";

import { useLocale, useTranslations } from "next-intl";

import { ResultPill } from "@/components/common/result-pill";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatShortDate } from "@/lib/format";

import type { TeamMatchResult } from "../../types";

export function ResultsCard({
  results,
  isLoading,
}: {
  results: TeamMatchResult[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.results");
  const locale = useLocale();

  return (
    <SectionCard flush title={t("title")}>
      {isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9" />
          ))}
        </div>
      )}
      {results?.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-3 border-t px-4 py-2.5 text-[13px] first:border-t-0 hover:bg-muted/40 md:px-5"
        >
          <ResultPill result={m.result} />
          <div className="min-w-0 flex-1">
            <div className="truncate font-bold">
              {m.is_home ? "vs" : "@"} {m.rival_name}
            </div>
            <div className="text-[11px] text-muted-foreground">
              {m.competition} · {formatShortDate(m.played_at, locale)}
            </div>
          </div>
          <span className="font-black tabular-nums">
            {m.goals_for}-{m.goals_against}
          </span>
        </div>
      ))}
    </SectionCard>
  );
}
