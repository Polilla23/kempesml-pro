"use client";

import { useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { teamProfileService } from "../services/team-profile.service";

/**
 * One hook per profile block so each section caches/invalidates on its own
 * and tabs load lazily (`enabled`). Nothing here changes when the service
 * moves from mocks to RPCs.
 */

export function useTeamProfileHeader(teamId: string) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.profile(teamId),
    queryFn: () => teamProfileService.getHeader(supabase, teamId),
    enabled: Boolean(teamId),
  });
}

export function useTeamFixtures(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.fixtures(teamId),
    queryFn: () => teamProfileService.getFixtures(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamResults(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.results(teamId),
    queryFn: () => teamProfileService.getResults(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamBestXi(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.bestXi(teamId),
    queryFn: () => teamProfileService.getBestXi(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamStandings(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.standings(teamId),
    queryFn: () => teamProfileService.getStandings(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamSquad(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.squad(teamId),
    queryFn: () => teamProfileService.getSquad(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamHighlights(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.highlights(teamId),
    queryFn: () => teamProfileService.getHighlights(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamHistory(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.history(teamId),
    queryFn: () => teamProfileService.getHistory(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamRecords(teamId: string, enabled = true) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.records(teamId),
    queryFn: () => teamProfileService.getRecords(supabase, teamId),
    enabled: enabled && Boolean(teamId),
  });
}

export function useTeamFinances(
  teamId: string,
  seasonId?: string,
  enabled = true
) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.teams.finances(teamId, seasonId),
    queryFn: () => teamProfileService.getFinances(supabase, teamId, seasonId),
    enabled: enabled && Boolean(teamId),
  });
}
