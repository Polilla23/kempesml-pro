"use client";

import { useQuery } from "@tanstack/react-query";


import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { dashboardService } from "../services/dashboard.service";

export function useSeasonInfo() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.seasonInfo,
    queryFn: () => dashboardService.getSeasonInfo(supabase),
    staleTime: 5 * 60_000,
  });
}

export function useLeagueTables() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.leagueTables,
    queryFn: () => dashboardService.getLeagueTables(supabase),
  });
}

export function useSeasonSummary() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.seasonSummary,
    queryFn: () => dashboardService.getSeasonSummary(supabase),
  });
}

export function useChampions() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.champions,
    queryFn: () => dashboardService.getChampions(supabase),
  });
}

export function useLatestResults() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.latestResults,
    queryFn: () => dashboardService.getLatestResults(supabase),
  });
}

export function useCurrentPlazo(teamId?: string | null) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.plazo(teamId ?? ""),
    queryFn: () =>
      dashboardService.getCurrentPlazo(supabase, teamId ?? undefined),
  });
}

export function useLatestTransfers() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.transfersFeed,
    queryFn: () => dashboardService.getLatestTransfers(supabase),
  });
}

export function useNews() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.news,
    queryFn: () => dashboardService.getNews(supabase),
  });
}

/** Pending matches of the signed-in manager's team (mock while empty). */
export function useMyFixtures(teamId: string | null | undefined) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.myFixtures(teamId ?? ""),
    queryFn: () => dashboardService.getMyFixtures(supabase, teamId as string, 4),
    enabled: Boolean(teamId),
  });
}
