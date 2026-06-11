import {
  pageRange,
  type PaginatedParams,
  type PaginatedResult,
} from "@/lib/query/pagination";
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import type { Team } from "../types";

/** Columns that free-text search covers. */
const SEARCHABLE = ["team_name", "manager_name", "manager_mail"] as const;

/**
 * Pure data-access layer for `teams`. Receives the Supabase client so it works
 * from both server and client contexts.
 */
export const teamsService = {
  /** All teams (client-side use, small datasets only). */
  async list(supabase: TypedSupabaseClient): Promise<Team[]> {
    const { data, error } = await supabase
      .from("teams")
      .select("*")
      .order("team_name", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  /**
   * Server-side paginated list: filtering, sorting and pagination all run in
   * Postgres so only one page travels to the client. Scales to large tables.
   */
  async listPaged(
    supabase: TypedSupabaseClient,
    params: PaginatedParams
  ): Promise<PaginatedResult<Team>> {
    const { from, to } = pageRange(params.page, params.pageSize);

    let query = supabase.from("teams").select("*", { count: "exact" });

    if (params.search) {
      const term = `%${params.search}%`;
      query = query.or(
        SEARCHABLE.map((col) => `${col}.ilike.${term}`).join(",")
      );
    }

    query = query
      .order(params.sortId ?? "team_name", { ascending: !params.sortDesc })
      .range(from, to);

    const { data, error, count } = await query;
    if (error) throw error;

    return { rows: data ?? [], total: count ?? 0 };
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
