import type { TypedSupabaseClient } from "@/lib/supabase/types";

import type { Team } from "../types";

/**
 * Pure data-access layer for `teams`. Receives the Supabase client so it works
 * from both server and client contexts.
 */
export const teamsService = {
  async list(supabase: TypedSupabaseClient): Promise<Team[]> {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async getById(supabase: TypedSupabaseClient, id: string): Promise<Team> {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
