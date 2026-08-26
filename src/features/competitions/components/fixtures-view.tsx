"use client";

import { useMemo } from "react";
import { CalendarDays } from "lucide-react";
import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { EmptyState } from "@/components/common/empty-state";
import { SectionCard } from "@/components/common/section-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTeams } from "@/features/teams";
import { Link } from "@/i18n/navigation";
import { clubColor } from "@/lib/football";
import { cn } from "@/lib/utils";

import { useMatches, useRounds } from "../hooks/use-competitions";
import type { Match } from "../types";
import {
  TournamentPicker,
  useTournamentSelection,
} from "./tournament-picker";

function TeamCell({
  id,
  name,
  align,
}: {
  id: string | null;
  name: string;
  align: "left" | "right";
}) {
  if (!id) return <span className="text-muted-foreground">—</span>;
  return (
    <Link
      href={`/teams/${id}`}
      className={cn(
        "flex min-w-0 items-center gap-2 hover:underline",
        align === "right" && "flex-row-reverse"
      )}
    >
      <ClubAvatar name={name} color={clubColor(id)} size="sm" />
      <span className="truncate text-[13px] font-semibold">{name}</span>
    </Link>
  );
}

export function FixturesView() {
  const t = useTranslations("competitions.fixtures");
  const sel = useTournamentSelection();
  const rounds = useRounds(sel.tournamentId);
  const matches = useMatches(sel.tournamentId);
  const teams = useTeams();

  const teamName = useMemo(() => {
    const map = new Map(teams.data?.map((tm) => [tm.id, tm.team_name]));
    return (id: string | null) => (id ? (map.get(id) ?? id) : "—");
  }, [teams.data]);

  const byRound = useMemo(() => {
    const map = new Map<string, Match[]>();
    for (const m of matches.data ?? []) {
      const list = map.get(m.round_id) ?? [];
      list.push(m);
      map.set(m.round_id, list);
    }
    for (const list of map.values())
      list.sort((a, b) => (a.match_number ?? 0) - (b.match_number ?? 0));
    return map;
  }, [matches.data]);

  const isLoading = rounds.isLoading || matches.isLoading;
  const visibleRounds = (rounds.data ?? []).filter((r) => byRound.has(r.id));

  return (
    <div className="flex flex-col gap-4">
      <TournamentPicker {...sel} />

      {isLoading &&
        Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}

      {!isLoading && visibleRounds.length === 0 && (
        <EmptyState icon={CalendarDays} title={t("empty")} />
      )}

      {!isLoading &&
        visibleRounds.map((round) => (
          <SectionCard
            key={round.id}
            flush
            title={round.round_name ?? t("round", { n: round.round_number ?? "?" })}
            action={
              round.status === "finished" ? (
                <Badge variant="secondary">{t("roundFinished")}</Badge>
              ) : undefined
            }
          >
            {byRound.get(round.id)?.map((m) => {
              const played = m.status === "PLAYED";
              return (
                <div
                  key={m.id}
                  className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 border-t px-4 py-2.5 first:border-t-0 hover:bg-muted/40 md:gap-3 md:px-5"
                >
                  <div className="flex justify-end">
                    <TeamCell
                      id={m.home_team_id}
                      name={teamName(m.home_team_id)}
                      align="right"
                    />
                  </div>
                  {played ? (
                    <span className="min-w-14 text-center text-[15px] font-black tabular-nums">
                      {m.home_score} - {m.away_score}
                    </span>
                  ) : (
                    <Badge
                      variant="outline"
                      className="min-w-14 justify-center text-[10px]"
                    >
                      {m.status === "PENDING"
                        ? t("pending")
                        : m.status === "POSTPONED"
                          ? t("postponed")
                          : m.status === "SUSPENDED"
                            ? t("suspended")
                            : m.status}
                    </Badge>
                  )}
                  <div className="flex justify-start">
                    <TeamCell
                      id={m.away_team_id}
                      name={teamName(m.away_team_id)}
                      align="left"
                    />
                  </div>
                </div>
              );
            })}
          </SectionCard>
        ))}
    </div>
  );
}
