/* eslint-disable @typescript-eslint/no-unused-vars -- mock params; remove this line when migrating to RPCs */
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import {
  MOCK_TEAM_BEST_XI,
  MOCK_TEAM_FINANCES,
  MOCK_TEAM_FIXTURES,
  MOCK_TEAM_HEADER,
  MOCK_TEAM_HIGHLIGHTS,
  MOCK_TEAM_HISTORY,
  MOCK_TEAM_RECORDS,
  MOCK_TEAM_RESULTS,
  MOCK_TEAM_SQUAD,
  MOCK_TEAM_STANDINGS,
} from "../mocks/team-profile.mock";
import type {
  BestXi,
  SquadPlayer,
  StandingsTable,
  TeamFinances,
  TeamFixture,
  TeamHighlights,
  TeamMatchResult,
  TeamProfileHeader,
  TeamRecord,
  TeamSeasonEntry,
} from "../types";

/**
 * Data-access for the club profile page.
 *
 * ⚠️ CURRENTLY BACKED BY MOCKS. Every method below returns static data from
 * `../mocks/team-profile.mock.ts`. Each one documents the Postgres RPC that
 * should replace it (`TODO(db)`), following the same pattern as
 * `teams.service.ts` (`supabase.rpc("fn", { p_... })`, SECURITY DEFINER
 * functions that return `jsonb` with exactly the shape in `../types.ts`).
 *
 * Swapping a method = replace its body with:
 *
 *   const { data, error } = await supabase.rpc("<fn>", { p_team_id: teamId });
 *   if (error) throw error;
 *   return data as <Type>;
 *
 * Hooks and components do not need to change. Remember to delete the mock
 * import once all methods are migrated.
 */
export const teamProfileService = {
  /**
   * TODO(db): `get_team_profile(p_team_id text) → jsonb` (TeamProfileHeader)
   * Header of the club: identity, manager, current division + position,
   * squad aggregates (rating/value/size/avg age), last-5 form, current-season
   * record and trophies grouped by competition with the seasons they were won.
   * Returns `null` when the team does not exist.
   */
  async getHeader(
    _supabase: TypedSupabaseClient,
    teamId: string
  ): Promise<TeamProfileHeader | null> {
    return { ...MOCK_TEAM_HEADER, id: teamId };
  },

  /**
   * TODO(db): `get_team_fixtures(p_team_id text, p_limit int default 5) → jsonb[]`
   * Next unplayed matches (any competition), ordered by kickoff, with the rival
   * club and its manager name.
   */
  async getFixtures(
    _supabase: TypedSupabaseClient,
    _teamId: string,
    _limit = 5
  ): Promise<TeamFixture[]> {
    return MOCK_TEAM_FIXTURES;
  },

  /**
   * TODO(db): `get_team_results(p_team_id text, p_limit int default 5) → jsonb[]`
   * Last played matches, newest first, with result from the team's POV.
   */
  async getResults(
    _supabase: TypedSupabaseClient,
    _teamId: string,
    _limit = 5
  ): Promise<TeamMatchResult[]> {
    return MOCK_TEAM_RESULTS;
  },

  /**
   * TODO(db): `get_team_best_xi(p_team_id text) → jsonb` (BestXi)
   * Best eleven by rating for the team's formation. Each player carries a
   * `slot` index (0 = GK, then lines back → front); the UI maps it to pitch
   * coordinates via `FORMATION_SLOTS`.
   */
  async getBestXi(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<BestXi> {
    return MOCK_TEAM_BEST_XI;
  },

  /**
   * TODO(db): `get_team_standings(p_team_id text) → jsonb[]` (StandingsTable[])
   * One table per active competition the team takes part in this season
   * (league, cup group, youth group...), with `is_self` flagged on the team's
   * row. Could also be a view `v_standings` filtered by competition_id.
   */
  async getStandings(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<StandingsTable[]> {
    return MOCK_TEAM_STANDINGS;
  },

  /**
   * TODO(db): `get_team_squad(p_team_id text) → jsonb[]` (SquadPlayer[])
   * Full current roster with season stats, salary, market value and
   * transferable flag. Small enough (≤ 30 rows) for client-side filter/sort.
   */
  async getSquad(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<SquadPlayer[]> {
    return MOCK_TEAM_SQUAD;
  },

  /**
   * TODO(db): `get_team_highlights(p_team_id text) → jsonb` (TeamHighlights)
   * Top scorer and MVP of the current season for the team.
   */
  async getHighlights(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<TeamHighlights> {
    return MOCK_TEAM_HIGHLIGHTS;
  },

  /**
   * TODO(db): `get_team_history(p_team_id text) → jsonb[]` (TeamSeasonEntry[])
   * One row per (season, competition), newest season first, league first
   * within the season. `achievement_kind` drives the color in the UI.
   */
  async getHistory(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<TeamSeasonEntry[]> {
    return MOCK_TEAM_HISTORY;
  },

  /**
   * TODO(db): `get_team_records(p_team_id text) → jsonb[]` (TeamRecord[])
   * All-time records (top scorer, most expensive signing/sale, best season).
   */
  async getRecords(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<TeamRecord[]> {
    return MOCK_TEAM_RECORDS;
  },

  /**
   * TODO(db): `get_team_finances(p_team_id text, p_season_id text default null) → jsonb`
   * (TeamFinances) Income/expenses/balance/budget for the season (current when
   * null) plus the movement list. RLS: only the manager of the team or an
   * admin should see this — enforce inside the function with `manages_team()`
   * / `is_admin()`.
   */
  async getFinances(
    _supabase: TypedSupabaseClient,
    _teamId: string,
    _seasonId?: string
  ): Promise<TeamFinances> {
    return MOCK_TEAM_FINANCES;
  },
};
