"use client";

import { useQuery } from "@tanstack/react-query";

import { useSupabaseBrowser } from "@/hooks/use-supabase";
import { queryKeys } from "@/lib/query-keys";

import { historyService } from "../services/history.service";

/** All-time palmarés (composed from ~32 per-season calls → long cache). */
export function usePalmares() {
  const supabase = useSupabaseBrowser();
  return useQuery({
    queryKey: queryKeys.history.palmares,
    queryFn: () => historyService.getPalmares(supabase),
    staleTime: 30 * 60_000,
  });
}
