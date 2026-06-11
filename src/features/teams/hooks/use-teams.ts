"use client";

import { useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { teamsService } from "../services/teams.service";

/** All teams (get_all_teams RPC); filtering/sorting happen client-side. */
export function useTeams() {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.teams.list(),
    queryFn: () => teamsService.list(supabase),
  });
}

/** A single team by id (get_team_by_id RPC). */
export function useTeam(id: string) {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.teams.detail(id),
    queryFn: () => teamsService.getById(supabase, id),
    enabled: Boolean(id),
  });
}
