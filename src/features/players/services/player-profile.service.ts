/* eslint-disable @typescript-eslint/no-unused-vars -- mock params; remove this line when migrating to RPCs */
import type { TypedSupabaseClient } from "@/lib/supabase/types";

import {
  MOCK_PLAYER,
  MOCK_PLAYER_SEASONS,
  MOCK_PLAYER_TRANSFERS,
  MOCK_PLAYER_VALUE_HISTORY,
  MOCK_VALUE_RANKING,
} from "../mocks/player-profile.mock";
import type {
  PlayerProfile,
  PlayerSeason,
  PlayerTransfer,
  PlayerValuePoint,
  ValueRankRow,
} from "../types";

/**
 * Data-access for the player profile page.
 *
 * ⚠️ CURRENTLY BACKED BY MOCKS. Every method returns static data from
 * `../mocks/player-profile.mock.ts`. Each one documents the Postgres RPC that
 * should replace it (`TODO(db)`), following `teams.service.ts`
 * (`supabase.rpc("fn", { p_... })`, SECURITY DEFINER functions returning
 * `jsonb` with exactly the shape in `../types.ts`).
 *
 * Swapping a method = replace its body with:
 *
 *   const { data, error } = await supabase.rpc("<fn>", { p_player_id: playerId });
 *   if (error) throw error;
 *   return data as <Type>;
 *
 * Hooks and components do not need to change. Delete the mock import once
 * every method is migrated.
 */
export const playerProfileService = {
  /**
   * TODO(db): `get_player_profile(p_player_id text) → jsonb` (PlayerProfile)
   * Identity, bio, contract (salary, joined season), current club + division,
   * market value with league rank and position average, overall/potential,
   * skill moves / weak foot / work rates and the 6 attribute groups with their
   * sub-attributes (keys must match `AttributeKey`). `null` if not found.
   */
  async getProfile(
    _supabase: TypedSupabaseClient,
    playerId: string
  ): Promise<PlayerProfile | null> {
    return { ...MOCK_PLAYER, id: playerId };
  },

  /**
   * TODO(db): `get_player_seasons(p_player_id text) → jsonb[]` (PlayerSeason[])
   * One row per season, newest first, with the club of that season, the
   * aggregated stats and a nested `competitions` array with the per-competition
   * breakdown (stage reached + stats). The UI computes totals and goals/match.
   */
  async getSeasons(
    _supabase: TypedSupabaseClient,
    _playerId: string
  ): Promise<PlayerSeason[]> {
    return MOCK_PLAYER_SEASONS;
  },

  /**
   * TODO(db): `get_player_transfers(p_player_id text) → jsonb[]` (PlayerTransfer[])
   * Transfer history newest first (from/to club, kind, fee). The UI sums fees.
   */
  async getTransfers(
    _supabase: TypedSupabaseClient,
    _playerId: string
  ): Promise<PlayerTransfer[]> {
    return MOCK_PLAYER_TRANSFERS;
  },

  /**
   * TODO(db): `get_player_value_history(p_player_id text) → jsonb[]` (PlayerValuePoint[])
   * Market value at the end of every season, oldest first, with the club the
   * player belonged to (used for the chart markers).
   */
  async getValueHistory(
    _supabase: TypedSupabaseClient,
    _playerId: string
  ): Promise<PlayerValuePoint[]> {
    return MOCK_PLAYER_VALUE_HISTORY;
  },

  /**
   * TODO(db): `get_value_ranking(p_competition_id text, p_player_id text, p_limit int default 5) → jsonb[]`
   * (ValueRankRow[]) Most valuable players of the league, flagging the current
   * player with `is_self`. If the player is outside the top N, append their row.
   */
  async getValueRanking(
    _supabase: TypedSupabaseClient,
    _competitionId: string,
    _playerId: string,
    _limit = 5
  ): Promise<ValueRankRow[]> {
    return MOCK_VALUE_RANKING;
  },
};
