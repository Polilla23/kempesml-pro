/* eslint-disable @typescript-eslint/no-unused-vars -- unused params on the 2 methods still waiting for DB backing (transfers, value history) */
import { clubColor, competitionKindOf } from "@/lib/football";
import { flagEmoji, initials } from "@/lib/format";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Views } from "@/types/database.types";

import type {
  PlayerProfile,
  PlayerSeason,
  PlayerTransfer,
  PlayerValuePoint,
  ValueRankRow,
} from "../types";

type PlayerRow = Views<"v_players_full">;
type StatRow = Views<"v_tournament_player_stats">;

type RpcSeason = { id: string; name: string };
type RpcTeamRow = { id: string; team_name: string };
type RpcTeamProfileLite = {
  formation: string | null;
  tournaments:
    | { position: string | null; tournament_id: string; tournament_name: string }[]
    | null;
};

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

async function getPlayerRaw(supabase: TypedSupabaseClient, playerId: string) {
  const data = await rpc<PlayerRow | PlayerRow[] | null>(
    supabase,
    "get_player_by_id",
    { p_id: playerId }
  );
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}

/** "Alejandro Frances" → "Frances". */
const surname = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;

/**
 * Data-access for the player profile page.
 *
 * Real today: bio (`get_player_by_id` → v_players_full), current-season stats
 * (composed from the team's tournaments) and the global value ranking
 * (`get_players` ordered by market_value).
 *
 * Pending DB work (see docs/db-pending-profiles.md): detailed attributes
 * (expose players_scrapped_stats), height/foot/potential/skill moves/work
 * rates, joined-season, per-season club history, transfers and value history —
 * the matching fields return null / [] and their UI blocks hide themselves.
 */
export const playerProfileService = {
  async getProfile(
    supabase: TypedSupabaseClient,
    playerId: string
  ): Promise<PlayerProfile | null> {
    const player = await getPlayerRaw(supabase, playerId);
    if (!player || !player.id) return null;

    const teamId = player.current_team_id;
    const [teams, rank] = await Promise.all([
      rpc<RpcTeamRow[] | null>(supabase, "get_all_teams"),
      player.market_value != null
        ? supabase
            .rpc(
              "get_players",
              {
                p_team_id: null as unknown as string,
                p_status: null as unknown as string,
                p_category: null as unknown as string,
                p_search: null as unknown as string,
              },
              { count: "exact", head: true }
            )
            .gt("market_value", player.market_value)
            .then(({ count, error }) => {
              if (error) throw error;
              return count != null ? count + 1 : null;
            })
        : Promise.resolve(null),
    ]);
    const teamName = teams?.find((t) => t.id === teamId)?.team_name;

    const positions = player.positions ?? [];
    const secondary = positions
      .filter((p) => p !== player.primary_position)
      .join(" · ");

    return {
      id: player.id,
      name: player.name ?? player.id,
      short_name: surname(player.name ?? player.id),
      position: player.primary_position ?? positions[0] ?? "—",
      secondary_position: secondary || null,
      nationality: player.nationality,
      nationality_flag: flagEmoji(player.nationality_code),
      birth_date: player.birth_date,
      height_cm: null, // TODO(db): not stored yet
      foot: null, // TODO(db): not stored yet
      salary: player.salary ?? 0,
      joined_season: null, // TODO(db): no squad history per season yet
      team: teamId
        ? {
            id: teamId,
            name: teamName ?? teamId,
            color: clubColor(teamId),
            division_name: player.category_label,
          }
        : null,
      sofifa_link: player.sofifa_link,
      value: player.market_value,
      value_rank: rank,
      position_avg_value: null, // TODO(db): needs an aggregate function
      overall: player.rating ?? 0,
      potential: null, // TODO(db): not scraped yet
      skill_moves: null, // TODO(db): not scraped yet
      weak_foot: null, // TODO(db): not scraped yet
      attacking_rate: null, // TODO(db): not scraped yet
      defensive_rate: null, // TODO(db): not scraped yet
      attributes: null, // TODO(db): expose players_scrapped_stats via RPC
    };
  },

  /**
   * Current season only, composed from the player's team tournaments +
   * per-tournament stats. TODO(db): past seasons need club-per-season history.
   */
  async getSeasons(
    supabase: TypedSupabaseClient,
    playerId: string
  ): Promise<PlayerSeason[]> {
    const player = await getPlayerRaw(supabase, playerId);
    const teamId = player?.current_team_id;
    if (!player || !teamId) return [];

    const [season, teamProfile, teams] = await Promise.all([
      rpc<RpcSeason>(supabase, "get_active_season"),
      rpc<RpcTeamProfileLite | null>(supabase, "get_team_profile", {
        p_team_id: teamId,
      }),
      rpc<RpcTeamRow[] | null>(supabase, "get_all_teams"),
    ]);
    const tournaments = teamProfile?.tournaments ?? [];
    const statRows = await Promise.all(
      tournaments.map((t) =>
        rpc<StatRow[] | null>(supabase, "get_player_stats_by_tournament", {
          p_tournament_id: t.tournament_id,
          p_team_id: teamId,
        })
      )
    );

    const competitions = tournaments.flatMap((t, i) => {
      const mine = (statRows[i] ?? []).find((r) => r.player_id === playerId);
      if (!mine) return [];
      return [
        {
          competition: t.tournament_name,
          competition_kind: competitionKindOf(null, t.tournament_name),
          stage: t.position ?? "—",
          played: mine.matches_played ?? 0,
          goals: mine.goals ?? 0,
          assists: mine.assists ?? 0,
          yellow_cards: mine.yellow_cards ?? 0,
          red_cards: mine.red_cards ?? 0,
        },
      ];
    });
    if (competitions.length === 0) return [];

    const sum = (k: "played" | "goals" | "assists" | "yellow_cards" | "red_cards") =>
      competitions.reduce((n, c) => n + c[k], 0);

    return [
      {
        season: season.id,
        team: {
          id: teamId,
          name: teams?.find((t) => t.id === teamId)?.team_name ?? teamId,
          color: clubColor(teamId),
        },
        division_name: player.category_label ?? "—",
        rating: player.rating ?? 0,
        played: sum("played"),
        goals: sum("goals"),
        assists: sum("assists"),
        yellow_cards: sum("yellow_cards"),
        red_cards: sum("red_cards"),
        value: player.market_value,
        competitions,
      },
    ];
  },

  /** TODO(db): no transfers table yet — the block hides itself. */
  async getTransfers(
    _supabase: TypedSupabaseClient,
    _playerId: string
  ): Promise<PlayerTransfer[]> {
    return [];
  },

  /** TODO(db): no per-season value history yet — the chart hides itself. */
  async getValueHistory(
    _supabase: TypedSupabaseClient,
    _playerId: string
  ): Promise<PlayerValuePoint[]> {
    return [];
  },

  /** Global top-5 by market value (+ the player's own row if outside). */
  async getValueRanking(
    supabase: TypedSupabaseClient,
    playerId: string
  ): Promise<ValueRankRow[]> {
    const [{ data, error }, teams, player] = await Promise.all([
      supabase
        .rpc("get_players", {
          p_team_id: null as unknown as string,
          p_status: null as unknown as string,
          p_category: null as unknown as string,
          p_search: null as unknown as string,
        })
        .order("market_value", { ascending: false, nullsFirst: false })
        .range(0, 4),
      rpc<RpcTeamRow[] | null>(supabase, "get_all_teams"),
      getPlayerRaw(supabase, playerId),
    ]);
    if (error) throw error;

    const teamName = (id: string | null) =>
      teams?.find((t) => t.id === id)?.team_name ?? "—";
    const rows = ((data as PlayerRow[] | null) ?? []).map((p, i) => ({
      position: i + 1,
      player_id: p.id ?? "",
      name: p.name ? `${initials(p.name, 1)}. ${surname(p.name)}` : "—",
      team_name: teamName(p.current_team_id),
      value: p.market_value ?? 0,
      is_self: p.id === playerId,
    }));

    if (!rows.some((r) => r.is_self) && player?.market_value != null) {
      const { count } = await supabase
        .rpc(
          "get_players",
          {
            p_team_id: null as unknown as string,
            p_status: null as unknown as string,
            p_category: null as unknown as string,
            p_search: null as unknown as string,
          },
          { count: "exact", head: true }
        )
        .gt("market_value", player.market_value);
      rows.push({
        position: (count ?? 0) + 1,
        player_id: playerId,
        name: player.name
          ? `${initials(player.name, 1)}. ${surname(player.name)}`
          : playerId,
        team_name: teamName(player.current_team_id),
        value: player.market_value,
        is_self: true,
      });
    }
    return rows;
  },
};
