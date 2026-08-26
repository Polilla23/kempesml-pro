"use client";

import { useQuery } from "@tanstack/react-query";

import { teamProfileService } from "@/features/teams";
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

/** Pending matches of the signed-in manager's team (reuses the profile RPC). */
export function useMyFixtures(teamId: string | null | undefined) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.dashboard.myFixtures(teamId ?? ""),
    queryFn: () => teamProfileService.getFixtures(supabase, teamId as string, 4),
    enabled: Boolean(teamId),
  });
}
