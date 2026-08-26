"use client";

import { useLocale, useTranslations } from "next-intl";

import { AutoCarousel } from "@/components/common/auto-carousel";
import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { clubColor, competitionTextClass } from "@/lib/football";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useLatestResults } from "../hooks/use-dashboard";
import type { LatestResult } from "../types";

function Side({
  teamId,
  name,
  score,
  rivalScore,
}: {
  teamId: string;
  name: string;
  score: number;
  rivalScore: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <ClubAvatar name={name} color={clubColor(teamId)} size="xs" />
      <Link
        href={`/teams/${teamId}`}
        className={cn(
          "min-w-0 flex-1 truncate text-xs hover:underline",
          score >= rivalScore ? "font-extrabold" : "font-medium"
        )}
      >
        {name}
      </Link>
      <span
        className={cn(
          "text-[13px] font-black tabular-nums",
          score > rivalScore && "text-emerald-600 dark:text-emerald-400"
        )}
      >
        {score}
      </span>
    </div>
  );
}

function ResultCard({ r, locale }: { r: LatestResult; locale: string }) {
  return (
    <article className="w-44 shrink-0 rounded-xl border bg-background/40 px-3 py-2.5">
      <div className="mb-2 flex justify-between gap-1.5 text-[9px]">
        <span className={cn("font-extrabold whitespace-nowrap", competitionTextClass(r.competition_kind))}>
          {r.competition}
        </span>
        <span className="truncate text-muted-foreground">
          {r.division ? `${r.division} · ` : ""}
          {formatRelativeTime(r.loaded_at, locale)}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <Side teamId={r.home_team_id} name={r.home_team_name} score={r.home_score} rivalScore={r.away_score} />
        <Side teamId={r.away_team_id} name={r.away_team_name} score={r.away_score} rivalScore={r.home_score} />
      </div>
    </article>
  );
}

/**
 * TODO(db): MOCKED feed — swap to `get_latest_results`
 * (docs/db-pending-home.md §3); only the service changes.
 */
export function LatestResultsCarousel() {
  const t = useTranslations("home.latestResults");
  const locale = useLocale();
  const results = useLatestResults();

  return (
    <SectionCard
      title={t("title")}
      action={
        <Link href="/fixtures" className="text-xs font-bold text-primary hover:underline">
          {t("viewAll")} ›
        </Link>
      }
    >
      {results.isLoading && (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-44 shrink-0 rounded-xl" />
          ))}
        </div>
      )}
      {results.data && (
        <AutoCarousel speed={0.9}>
          {results.data.map((r) => (
            <ResultCard key={r.id} r={r} locale={locale} />
          ))}
        </AutoCarousel>
      )}
    </SectionCard>
  );
}
