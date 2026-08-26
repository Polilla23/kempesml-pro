import {
  pageRange,
  type PaginatedParams,
  type PaginatedResult,
} from "@/lib/query/pagination";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables } from "@/types/database.types";

import type { PlayerListItem } from "../types";

export type PlayersListParams = PaginatedParams & {
  teamId?: string;
  status?: string;
  category?: string;
};

/** Column ids the DB can sort the list by (must match v_players_full). */
const SORTABLE = new Set([
  "name",
  "rating",
  "salary",
  "market_value",
  "birth_date",
  "primary_position",
]);

/**
 * Data-access for player listings. `get_players` returns SETOF v_players_full,
 * so PostgREST search/sort/pagination compose on top of the RPC.
 */
export const playersService = {
  /** Server-side paginated list (search + filters + sort in the DB). */
  async listPaged(
    supabase: TypedSupabaseClient,
    { page, pageSize, search, sortId, sortDesc, teamId, status, category }: PlayersListParams
  ): Promise<PaginatedResult<PlayerListItem>> {
    const { from, to } = pageRange(page, pageSize);
    let query = supabase
      .rpc(
        "get_players",
        {
          p_team_id: (teamId ?? null) as unknown as string,
          p_status: (status ?? null) as unknown as string,
          p_category: (category ?? null) as unknown as string,
          p_search: (search?.trim() || null) as unknown as string,
        },
        { count: "exact" }
      )
      .range(from, to);
    // nullsFirst:false — Postgres would otherwise put NULLs on top when DESC.
    query =
      sortId && SORTABLE.has(sortId)
        ? query.order(sortId, { ascending: !sortDesc, nullsFirst: false })
        : query.order("rating", { ascending: false, nullsFirst: false });

    const { data, error, count } = await query;
    if (error) throw error;
    return { rows: (data as PlayerListItem[] | null) ?? [], total: count ?? 0 };
  },

  /** Filter catalogs (statuses + categories) for the list page. */
  async getCatalogs(supabase: TypedSupabaseClient): Promise<{
    statuses: Tables<"player_statuses">[];
    categories: Tables<"player_categories">[];
  }> {
    const [st, cat] = await Promise.all([
      supabase.rpc("get_player_statuses"),
      supabase.rpc("get_player_categories"),
    ]);
    if (st.error) throw st.error;
    if (cat.error) throw cat.error;
    return {
      statuses: (st.data as Tables<"player_statuses">[] | null) ?? [],
      categories: (cat.data as Tables<"player_categories">[] | null) ?? [],
    };
  },
};
