"use client";

import { useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { competitionsService } from "../services/competitions.service";

export function useSeasons() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.seasons,
    queryFn: () => competitionsService.listSeasons(supabase),
    staleTime: 5 * 60_000,
  });
}

export function useTournaments(seasonId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.tournaments(seasonId),
    queryFn: () => competitionsService.listTournaments(supabase, seasonId),
    enabled: Boolean(seasonId),
    staleTime: 5 * 60_000,
  });
}

export function useStandings(tournamentId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.standings(tournamentId),
    queryFn: () => competitionsService.getStandings(supabase, tournamentId),
    enabled: Boolean(tournamentId),
  });
}

export function useRounds(tournamentId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.rounds(tournamentId),
    queryFn: () => competitionsService.listRounds(supabase, tournamentId),
    enabled: Boolean(tournamentId),
  });
}

export function useMatches(tournamentId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.matches(tournamentId),
    queryFn: () => competitionsService.listMatches(supabase, tournamentId),
    enabled: Boolean(tournamentId),
  });
}

export function useTournamentPlayerStats(tournamentId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.competitions.playerStats(tournamentId),
    queryFn: () => competitionsService.getPlayerStats(supabase, tournamentId),
    enabled: Boolean(tournamentId),
  });
}
