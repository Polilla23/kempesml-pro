import type { TypedSupabaseClient } from "@/lib/supabase/types";

import type {
  Match,
  Season,
  StandingRow,
  Tournament,
  TournamentPlayerStats,
  TournamentRound,
} from "../types";

/**
 * Data-access for seasons / tournaments / standings / fixtures / stats.
 * All reads go through the DB's RPC functions (DB-owns-logic pattern).
 */
export const competitionsService = {
  /** All seasons via get_seasons(null), newest first. */
  async listSeasons(supabase: TypedSupabaseClient): Promise<Season[]> {
    const { data, error } = await supabase.rpc("get_seasons", {
      p_status: null as unknown as string,
    });
    if (error) throw error;
    return ((data as Season[] | null) ?? []).sort(
      (a, b) => b.season_number - a.season_number
    );
  },

  /** Tournaments of a season, leagues first, then by name. */
  async listTournaments(
    supabase: TypedSupabaseClient,
    seasonId: string
  ): Promise<Tournament[]> {
    const { data, error } = await supabase.rpc("get_tournaments_by_season", {
      p_season_id: seasonId,
    });
    if (error) throw error;
    return ((data as Tournament[] | null) ?? []).sort(
      (a, b) =>
        (a.type === "LEAGUE" ? 0 : 1) - (b.type === "LEAGUE" ? 0 : 1) ||
        a.name.localeCompare(b.name)
    );
  },

  /** Standings of one tournament, ordered by position. */
  async getStandings(
    supabase: TypedSupabaseClient,
    tournamentId: string
  ): Promise<StandingRow[]> {
    const { data, error } = await supabase.rpc("get_standings_by_tournament", {
      p_tournament_id: tournamentId,
    });
    if (error) throw error;
    return ((data as StandingRow[] | null) ?? []).sort(
      (a, b) => (a.position ?? 99) - (b.position ?? 99)
    );
  },

  /** Rounds of a tournament, by round number. */
  async listRounds(
    supabase: TypedSupabaseClient,
    tournamentId: string
  ): Promise<TournamentRound[]> {
    const { data, error } = await supabase.rpc("get_rounds_by_tournament", {
      p_tournament_id: tournamentId,
    });
    if (error) throw error;
    return ((data as TournamentRound[] | null) ?? []).sort(
      (a, b) => (a.round_number ?? 0) - (b.round_number ?? 0)
    );
  },

  /** Every match of a tournament (all statuses). */
  async listMatches(
    supabase: TypedSupabaseClient,
    tournamentId: string
  ): Promise<Match[]> {
    const { data, error } = await supabase.rpc("get_matches_by_tournament", {
      p_tournament_id: tournamentId,
      p_status: null as unknown as string,
    });
    if (error) throw error;
    return (data as Match[] | null) ?? [];
  },

  /** Player stats of a whole tournament (p_team_id null = every team). */
  async getPlayerStats(
    supabase: TypedSupabaseClient,
    tournamentId: string
  ): Promise<TournamentPlayerStats[]> {
    const { data, error } = await supabase.rpc(
      "get_player_stats_by_tournament",
      {
        p_tournament_id: tournamentId,
        p_team_id: null as unknown as string,
      }
    );
    if (error) throw error;
    return (data as TournamentPlayerStats[] | null) ?? [];
  },
};
