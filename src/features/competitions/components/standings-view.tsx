"use client";

import { ListOrdered } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/features/profiles";
import { Link } from "@/i18n/navigation";
import { formatSigned } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useStandings } from "../hooks/use-competitions";
import {
  TournamentPicker,
  useTournamentSelection,
} from "./tournament-picker";

const GRID =
  "grid grid-cols-[32px_minmax(150px,1fr)_40px_36px_36px_36px_44px_44px_48px_48px] gap-x-1.5 px-4 md:px-5";

export function StandingsView() {
  const t = useTranslations("competitions.standings");
  const sel = useTournamentSelection();
  const standings = useStandings(sel.tournamentId);
  const myTeamId = useCurrentProfile().data?.team_id;

  const name =
    sel.tournaments.find((tr) => tr.id === sel.tournamentId)?.name ?? "";

  return (
    <div className="flex flex-col gap-4">
      <TournamentPicker {...sel} />

      <SectionCard flush title={name || t("title")}>
        {standings.isLoading && (
          <div className="space-y-2 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-8" />
            ))}
          </div>
        )}
        {!standings.isLoading && (standings.data?.length ?? 0) === 0 && (
          <div className="p-6">
            <EmptyState icon={ListOrdered} title={t("empty")} />
          </div>
        )}
        {(standings.data?.length ?? 0) > 0 && (
          <div className="overflow-x-auto">
            <div className="min-w-130">
              <div className={cn(GRID, "bg-muted/50 py-2 text-[11px] text-muted-foreground uppercase")}>
                <span>#</span>
                <span>{t("club")}</span>
                <span className="text-center">{t("played")}</span>
                <span className="text-center">{t("won")}</span>
                <span className="text-center">{t("drawn")}</span>
                <span className="text-center">{t("lost")}</span>
                <span className="text-center">{t("goalsFor")}</span>
                <span className="text-center">{t("goalsAgainst")}</span>
                <span className="text-center">{t("goalDiff")}</span>
                <span className="text-center">{t("points")}</span>
              </div>
              {standings.data?.map((r, i) => (
                <div
                  key={r.team_id ?? i}
                  className={cn(
                    GRID,
                    "items-center border-t py-2.5 text-[13px] hover:bg-muted/40",
                    r.team_id === myTeamId && "bg-primary/10"
                  )}
                >
                  <span
                    className={cn(
                      "font-extrabold",
                      (r.position ?? 99) <= 2
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-muted-foreground"
                    )}
                  >
                    {r.position}
                  </span>
                  <Link
                    href={`/teams/${r.team_id}`}
                    className={cn(
                      "truncate hover:underline",
                      r.team_id === myTeamId ? "font-extrabold" : "font-medium"
                    )}
                  >
                    {r.team_name ?? r.team_id}
                  </Link>
                  <span className="text-center text-muted-foreground">{r.played}</span>
                  <span className="text-center">{r.won}</span>
                  <span className="text-center">{r.drawn}</span>
                  <span className="text-center">{r.lost}</span>
                  <span className="text-center text-muted-foreground">{r.goals_for}</span>
                  <span className="text-center text-muted-foreground">{r.goals_against}</span>
                  <span className="text-center text-muted-foreground">
                    {formatSigned(r.goal_difference ?? 0)}
                  </span>
                  <span className="text-center font-extrabold">{r.points}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </SectionCard>
    </div>
  );
}
