/* eslint-disable @typescript-eslint/no-unused-vars -- unused `_supabase` on the mocked methods; remove as their RPCs land */
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables, Views } from "@/types/database.types";

import { teamProfileService, type TeamFixture } from "@/features/teams";

import {
  MOCK_CHAMPIONS,
  MOCK_LATEST_RESULTS,
  MOCK_MY_FIXTURES,
  MOCK_NEWS,
  MOCK_PLAZO,
  MOCK_SEASON_SUMMARY,
  MOCK_TRANSFERS_FEED,
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

  /**
   * TODO(db): `get_season_summary(p_season_id default null)` — hero KPIs
   * (docs/db-pending-home.md §1). MOCKED.
   */
  async getSeasonSummary(
    _supabase: TypedSupabaseClient
  ): Promise<SeasonSummary> {
    return MOCK_SEASON_SUMMARY;
  },

  /**
   * TODO(db): `get_season_champions(p_season_id default null)` — reigning
   * champions per tournament (docs/db-pending-home.md §2). MOCKED.
   */
  async getChampions(
    _supabase: TypedSupabaseClient
  ): Promise<SeasonChampion[]> {
    return MOCK_CHAMPIONS;
  },

  /**
   * TODO(db): `get_latest_results(p_limit default 12)` — league-wide latest
   * loaded results (docs/db-pending-home.md §3). MOCKED.
   */
  async getLatestResults(
    _supabase: TypedSupabaseClient
  ): Promise<LatestResult[]> {
    return MOCK_LATEST_RESULTS;
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
   * TODO(db): `get_latest_transfers(p_limit default 12)` — market feed;
   * depends on the transfers table (docs/db-pending-home.md §5). MOCKED.
   */
  async getLatestTransfers(
    _supabase: TypedSupabaseClient
  ): Promise<TransferFeedItem[]> {
    return MOCK_TRANSFERS_FEED;
  },

  /**
   * TODO(db): `get_news(p_limit default 6)` — news grid; depends on the news
   * table (docs/db-pending-home.md §6). MOCKED.
   */
  async getNews(_supabase: TypedSupabaseClient): Promise<NewsItem[]> {
    return MOCK_NEWS;
  },
};
