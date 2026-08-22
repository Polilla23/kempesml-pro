"use client";

import { useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { playerProfileService } from "../services/player-profile.service";

/** One hook per profile block; nothing here changes when mocks become RPCs. */

export function usePlayerProfile(playerId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.profile(playerId),
    queryFn: () => playerProfileService.getProfile(supabase, playerId),
    enabled: Boolean(playerId),
  });
}

export function usePlayerSeasons(playerId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.seasons(playerId),
    queryFn: () => playerProfileService.getSeasons(supabase, playerId),
    enabled: Boolean(playerId),
  });
}

export function usePlayerTransfers(playerId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.transfers(playerId),
    queryFn: () => playerProfileService.getTransfers(supabase, playerId),
    enabled: Boolean(playerId),
  });
}

export function usePlayerValueHistory(playerId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.valueHistory(playerId),
    queryFn: () => playerProfileService.getValueHistory(supabase, playerId),
    enabled: Boolean(playerId),
  });
}

/** Top-N by value in the league the player's team plays in. */
export function useValueRanking(competitionId: string, playerId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: [...queryKeys.players.valueRanking(competitionId), playerId],
    queryFn: () =>
      playerProfileService.getValueRanking(supabase, competitionId, playerId),
    enabled: Boolean(competitionId) && Boolean(playerId),
  });
}
