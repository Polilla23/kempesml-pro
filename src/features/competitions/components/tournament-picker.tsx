"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useSeasons, useTournaments } from "../hooks/use-competitions";
import type { Season, Tournament } from "../types";

/**
 * Owns the season → tournament selection state shared by the standings,
 * statistics and fixtures pages. Defaults to the active season and its first
 * tournament (leagues come first from the service).
 */
export function useTournamentSelection() {
  const seasons = useSeasons();
  const [seasonSel, setSeasonSel] = useState<string | null>(null);
  const seasonId =
    seasonSel ??
    seasons.data?.find((s) => s.status === "active")?.id ??
    seasons.data?.[0]?.id ??
    "";

  const tournaments = useTournaments(seasonId);
  const [tournamentSel, setTournamentSel] = useState<string | null>(null);
  const tournamentId =
    (tournamentSel && tournaments.data?.some((t) => t.id === tournamentSel)
      ? tournamentSel
      : tournaments.data?.[0]?.id) ?? "";

  return {
    seasons: seasons.data ?? [],
    tournaments: tournaments.data ?? [],
    isLoading: seasons.isLoading || tournaments.isLoading,
    seasonId,
    tournamentId,
    setSeason: (id: string) => {
      setSeasonSel(id);
      setTournamentSel(null);
    },
    setTournament: setTournamentSel,
  };
}

export function TournamentPicker({
  seasons,
  tournaments,
  isLoading,
  seasonId,
  tournamentId,
  setSeason,
  setTournament,
}: ReturnType<typeof useTournamentSelection>) {
  const t = useTranslations("competitions");

  if (isLoading && seasons.length === 0) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-56" />
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={seasonId} onValueChange={(v) => setSeason(v as string)}>
        <SelectTrigger aria-label={t("season")} className="min-w-36">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {seasons.map((s: Season) => (
            <SelectItem key={s.id} value={s.id}>
              {s.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={tournamentId}
        onValueChange={(v) => setTournament(v as string)}
      >
        <SelectTrigger aria-label={t("tournament")} className="min-w-56">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {tournaments.map((tr: Tournament) => (
            <SelectItem key={tr.id} value={tr.id}>
              {tr.name}
              {tr.division ? ` · ${tr.division}` : ""}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
