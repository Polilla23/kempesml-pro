"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import type { PaginatedParams } from "@/lib/query/pagination";
import { queryKeys } from "@/lib/query-keys";

import { teamsService } from "../services/teams.service";

/** All teams (client-side filtering; small datasets). */
export function useTeams() {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.teams.list(),
    queryFn: () => teamsService.list(supabase),
  });
}

/** Server-side paginated teams; keeps the previous page visible while fetching. */
export function useTeamsPaged(params: PaginatedParams) {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.teams.list(params),
    queryFn: () => teamsService.listPaged(supabase, params),
    placeholderData: keepPreviousData,
  });
}

/** A single team by id. */
export function useTeam(id: string) {
  const supabase = useSupabaseBrowser();

  return useQuery({
    queryKey: queryKeys.teams.detail(id),
    queryFn: () => teamsService.getById(supabase, id),
    enabled: Boolean(id),
  });
}
