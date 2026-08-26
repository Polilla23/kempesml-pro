"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import {
  playersService,
  type PlayersListParams,
} from "../services/players.service";

/** Server-side paginated player list. */
export function usePlayersList(params: PlayersListParams) {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.list(params),
    queryFn: () => playersService.listPaged(supabase, params),
    placeholderData: keepPreviousData,
  });
}

/** Status/category catalogs for the list filters. */
export function usePlayerCatalogs() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.players.catalogs,
    queryFn: () => playersService.getCatalogs(supabase),
    staleTime: 30 * 60_000,
  });
}
