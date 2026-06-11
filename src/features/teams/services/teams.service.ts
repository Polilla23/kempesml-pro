import type { TypedSupabaseClient } from "@/lib/supabase/types";

import type { Team } from "../types";

/**
 * Data-access for `teams`. Direct table SELECT is locked down by RLS — reads go
 * through the DB's SECURITY DEFINER RPC functions (the DB-owns-logic pattern).
 */
export const teamsService = {
  /** All teams via get_all_teams(). Returns the full set (client-side table). */
  async list(supabase: TypedSupabaseClient): Promise<Team[]> {
    const { data, error } = await supabase.rpc("get_all_teams");
    if (error) throw error;
    return (data as Team[] | null) ?? [];
  },

  /** Single team via get_team_by_id(p_id). */
  async getById(
    supabase: TypedSupabaseClient,
    id: string
  ): Promise<Team | null> {
    const { data, error } = await supabase.rpc("get_team_by_id", { p_id: id });
    if (error) throw error;
    const row = Array.isArray(data) ? data[0] : data;
    return (row as Team) ?? null;
  },
};
