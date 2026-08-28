/* eslint-disable @typescript-eslint/no-unused-vars -- unused `_supabase` on the mocked methods; remove as their RPCs land */
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables, Views } from "@/types/database.types";

import { teamProfileService, type TeamFixture } from "@/features/teams";
import { competitionKindOf } from "@/lib/football";

import {
  MOCK_MY_FIXTURES,
  MOCK_NEWS,
  MOCK_PLAZO,
} from "../mocks/dashboard.mock";
import type {
  LatestResult,
  LeagueTable,
  NewsItem,
  PlazoInfo,
  SeasonChampion,
  SeasonInfo,
  SeasonSummary,
  TransferFeedItem,
} from "../types";

type TournamentRow = Tables<"tournaments">;
type StandingRowRaw = Views<"v_standings_full">;
type RpcTeamRow = { id: string; team_name: string; manager_id: string | null };

async function rpc<T>(
  supabase: TypedSupabaseClient,
  fn: string,
  args: Record<string, unknown> = {}
): Promise<T> {
  const { data, error } = await supabase
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic fn name; payload asserted per call site
    .rpc(fn as any, args as any);
  if (error) throw error;
  return data as T;
}

/**
 * Data-access for the home page.
 *
 * Real today: active season + every league table of the season + the user's
 * pending matches (via `teamProfileService.getFixtures`, consumed directly by
 * the home hooks).
 *
 * The rest of the design renders MOCK data from `../mocks/dashboard.mock.ts`
 * until its DB endpoints exist — each method below carries the TODO(db) with
 * the function that replaces it (spec: docs/db-pending-home.md). Swapping is
 * the usual drill: replace the body with the `rpc(...)` call, delete the mock
 * import when the last one goes.
 */
export const dashboardService = {
  /** Active season via get_active_season(). */
  async getSeasonInfo(supabase: TypedSupabaseClient): Promise<SeasonInfo> {
    const s = await rpc<SeasonInfo>(supabase, "get_active_season");
    return { id: s.id, name: s.name, status: s.status };
  },

  /**
   * The top-division (A) league tables of the active season — Liga Mayores A
   * and Liga Kempesitas A — with manager names resolved from the teams list.
   * TODO(db): the "Forma" column of the design needs a last-5 form array per
   * standings row.
   */
  async getLeagueTables(
    supabase: TypedSupabaseClient
  ): Promise<LeagueTable[]> {
    const season = await rpc<SeasonInfo>(supabase, "get_active_season");
    const [tournaments, teams] = await Promise.all([
      rpc<TournamentRow[] | null>(supabase, "get_tournaments_by_season", {
        p_season_id: season.id,
      }),
      rpc<RpcTeamRow[] | null>(supabase, "get_all_teams"),
    ]);
    const managerOf = new Map(teams?.map((t) => [t.id, t.manager_id]));

    const leagues = (tournaments ?? [])
      .filter((t) => t.type === "LEAGUE" && t.division === "A")
      .sort(
        (a, b) =>
          (a.category === "senior" ? 0 : 1) - (b.category === "senior" ? 0 : 1) ||
          (a.division ?? "").localeCompare(b.division ?? "")
      );

    const standings = await Promise.all(
      leagues.map((t) =>
        rpc<StandingRowRaw[] | null>(supabase, "get_standings_by_tournament", {
          p_tournament_id: t.id,
        })
      )
    );

    return leagues
      .map((t, i) => ({
        tournament_id: t.id,
        name: t.name,
        division: t.division,
        category: t.category,
        rows: (standings[i] ?? [])
          .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
          .map((r) => ({
            position: r.position ?? 0,
            team_id: r.team_id ?? "",
            team_name: r.team_name ?? r.team_id ?? "—",
            manager_name: managerOf.get(r.team_id ?? "") ?? null,
            played: r.played ?? 0,
            won: r.won ?? 0,
            drawn: r.drawn ?? 0,
            lost: r.lost ?? 0,
            goals_for: r.goals_for ?? 0,
            goals_against: r.goals_against ?? 0,
            goal_diff: r.goal_difference ?? 0,
            points: r.points ?? 0,
          })),
      }))
      .filter((t) => t.rows.length > 0);
  },

  /**
   * Pending matches of the user's team. Real via get_team_fixtures; while the
   * team has none (e.g. season finished), MOCK fixtures keep the card visible
   * for design review — remove the fallback once real fixtures flow again.
   */
  async getMyFixtures(
    supabase: TypedSupabaseClient,
    teamId: string,
    limit = 4
  ): Promise<TeamFixture[]> {
    const real = await teamProfileService.getFixtures(supabase, teamId, limit);
    return real.length > 0 ? real : MOCK_MY_FIXTURES.slice(0, limit);
  },

  /** Hero KPIs via get_season_summary(null = active season). */
  async getSeasonSummary(
    supabase: TypedSupabaseClient
  ): Promise<SeasonSummary> {
    const raw = await rpc<{
      season_id: string;
      matches_played: number | null;
      total_matches: number | null;
      transfers_count: number | null;
      transfers_amount: number | null;
    }>(supabase, "get_season_summary", { p_season_id: null });
    return {
      season_id: raw.season_id,
      matches_played: raw.matches_played ?? 0,
      matches_total: raw.total_matches ?? 0,
      transfers_count: raw.transfers_count,
      transfers_amount: raw.transfers_amount,
    };
  },

  /**
   * Reigning champions via get_season_champions(null = latest). The hero
   * shows 4: senior league A, kempesitas league A, Copa de Oro, then the rest.
   */
  async getChampions(
    supabase: TypedSupabaseClient
  ): Promise<SeasonChampion[]> {
    const rows =
      (await rpc<
        | {
            team_id: string;
            team_name: string;
            tournament_id: string;
            tournament_name: string;
            tournament_type: string | null;
            division: string | null;
            category: string | null;
          }[]
        | null
      >(supabase, "get_season_champions", { p_season_id: null })) ?? [];

    const weight = (r: (typeof rows)[number]) => {
      const league = r.tournament_type === "LEAGUE" && r.division === "A";
      if (league && r.category === "senior") return 0;
      if (league) return 1;
      if (r.tournament_name.toLowerCase().includes("oro")) return 2;
      return 3;
    };

    return rows
      .sort((a, b) => weight(a) - weight(b))
      .slice(0, 4)
      .map((r) => ({
        tournament_id: r.tournament_id,
        // "Liga Mayores T31" → "Liga Mayores" (the chip is tiny).
        tournament_name: r.tournament_name.replace(/\s*T\d+$/, ""),
        kind: competitionKindOf(r.tournament_type, r.tournament_name),
        team_id: r.team_id,
        team_name: r.team_name,
      }));
  },

  /**
   * League-wide latest loaded results via get_latest_results(p_limit).
   * TODO(db): the RPC's `competition` field carries the type ("CUP") instead
   * of the tournament name — until it's fixed we resolve the name from
   * tournament_id against the active season's tournaments.
   */
  async getLatestResults(
    supabase: TypedSupabaseClient,
    limit = 12
  ): Promise<LatestResult[]> {
    const [rows, season] = await Promise.all([
      rpc<
        | {
            id: string;
            tournament_id: string;
            competition: string | null;
            competition_kind: string | null;
            competition_division: string | null;
            plazo: string | null;
            home_team_id: string;
            home_team_name: string | null;
            home_score: number;
            away_team_id: string;
            away_team_name: string | null;
            away_score: number;
            loaded_at: string;
          }[]
        | null
      >(supabase, "get_latest_results", { p_limit: limit }),
      rpc<SeasonInfo>(supabase, "get_active_season"),
    ]);
    const tournaments = await rpc<TournamentRow[] | null>(
      supabase,
      "get_tournaments_by_season",
      { p_season_id: season.id }
    );
    const nameById = new Map(tournaments?.map((t) => [t.id, t.name]));

    return (rows ?? [])
      .sort((a, b) => b.loaded_at.localeCompare(a.loaded_at))
      .map((r) => {
        const name = nameById.get(r.tournament_id) ?? r.tournament_id;
        return {
          id: r.id,
          competition: name,
          competition_kind: competitionKindOf(r.competition_kind, name),
          division: r.competition_division,
          plazo: r.plazo,
          home_team_id: r.home_team_id,
          home_team_name: r.home_team_name ?? r.home_team_id,
          home_score: r.home_score,
          away_team_id: r.away_team_id,
          away_team_name: r.away_team_name ?? r.away_team_id,
          away_score: r.away_score,
          loaded_at: r.loaded_at,
        };
      });
  },

  /**
   * TODO(db): `get_current_plazo()` + `get_team_plazo_progress(p_team_id)` —
   * current matchday window, deadline and the user's progress
   * (docs/db-pending-home.md §4). MOCKED.
   */
  async getCurrentPlazo(
    _supabase: TypedSupabaseClient,
    _teamId?: string
  ): Promise<PlazoInfo> {
    return MOCK_PLAZO;
  },

  /**
   * Market feed via get_latest_transfers(p_limit), newest first.
   * Known DB-side issue (confirmed, fix pending there): the RPC currently
   * sends some rows twice — no front workaround by request.
   */
  async getLatestTransfers(
    supabase: TypedSupabaseClient,
    limit = 12
  ): Promise<TransferFeedItem[]> {
    const rows =
      (await rpc<
        | {
            id: string;
            player_id: string;
            player_name: string | null;
            /** TODO(db): dropped when the crest fields were added — restore it. */
            photo_url?: string | null;
            position: string | null;
            kind: string | null;
            fee: number | null;
            date: string;
            from_team_id: string;
            from_team_name: string | null;
            from_team_logo: string | null;
            to_team_id: string;
            to_team_name: string | null;
            to_team_logo: string | null;
          }[]
        | null
      >(supabase, "get_latest_transfers", { p_limit: limit })) ?? [];

    // DB kinds are uppercase (TRANSFER/LOAN/FREE...) → UI kinds.
    const kindOf = (k: string | null): TransferFeedItem["kind"] => {
      const up = (k ?? "").toUpperCase();
      if (up.includes("LOAN")) return "loan";
      if (up.includes("FREE")) return "free";
      return "purchase";
    };

    return rows
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((r) => ({
        id: r.id,
        player_id: r.player_id,
        player_name: r.player_name ?? r.player_id,
        photo_url: r.photo_url ?? null,
        position: r.position ?? "—",
        kind: kindOf(r.kind),
        fee: r.fee,
        date: r.date,
        from_team_id: r.from_team_id,
        from_team_name: r.from_team_name ?? r.from_team_id,
        from_team_logo: r.from_team_logo,
        to_team_id: r.to_team_id,
        to_team_name: r.to_team_name ?? r.to_team_id,
        to_team_logo: r.to_team_logo,
      }));
  },

  /**
   * TODO(db): `get_news(p_limit default 6)` — news grid; depends on the news
   * table (docs/db-pending-home.md §6). MOCKED.
   */
  async getNews(_supabase: TypedSupabaseClient): Promise<NewsItem[]> {
    return MOCK_NEWS;
  },
};
