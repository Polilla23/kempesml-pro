/* eslint-disable @typescript-eslint/no-unused-vars -- unused params on the 2 methods still waiting for DB backing (transfers, value history) */
import { clubColor, competitionKindOf, transferKindOf } from "@/lib/football";
import { flagEmoji, initials } from "@/lib/format";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Views } from "@/types/database.types";

import type {
  AttributeGroup,
  AttributeKey,
  PlayerListItem,
  PlayerProfile,
  PlayerSeason,
  PlayerTransfer,
  PlayerValuePoint,
  ValueRankRow,
} from "../types";

type PlayerRow = PlayerListItem;
type StatRow = Views<"v_tournament_player_stats">;

const PLAYERS_ARGS = {
  p_team_id: null as unknown as string,
  p_status: null as unknown as string,
  p_category: null as unknown as string,
  p_search: null as unknown as string,
};

/**
 * How many players are worth strictly more than `value` (rank - 1).
 * No `head: true`: PostgREST does not execute set-returning RPCs on HEAD and
 * reports count 0 — a 1-row range gets the real exact count.
 */
async function countRicherPlayers(supabase: TypedSupabaseClient, value: number) {
  const { count, error } = await supabase
    .rpc("get_players", PLAYERS_ARGS, { count: "exact" })
    .gt("market_value", value)
    .range(0, 0);
  if (error) throw error;
  return count ?? 0;
}

/** Raw payload of the restored get_player_by_id (2026-08-28). */
type RpcSofifa = {
  overall_rating: number | null;
  potential: number | null;
  height: number | null;
  foot: number | null;
  skill_moves: number | null;
  weak_foot: number | null;
  atk_work_rate: string | null;
  def_work_rate: string | null;
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling_overall: number | null;
  defending: number | null;
  physical: number | null;
  acceleration: number | null;
  sprint_speed: number | null;
  positioning: number | null;
  finishing: number | null;
  shot_power: number | null;
  long_shots: number | null;
  volleys: number | null;
  penalties: number | null;
  vision: number | null;
  crossing: number | null;
  fk_accuracy: number | null;
  short_passing: number | null;
  long_passing: number | null;
  curve: number | null;
  agility: number | null;
  balance: number | null;
  reactions: number | null;
  ball_control: number | null;
  dribbling: number | null;
  composure: number | null;
  interceptions: number | null;
  heading: number | null;
  def_awareness: number | null;
  standing_tackle: number | null;
  sliding_tackle: number | null;
  jumping: number | null;
  stamina: number | null;
  strength: number | null;
  aggression: number | null;
};

type RpcPlayer = {
  id: string;
  name: string | null;
  birth_date: string | null;
  country: string | null;
  nationality_code: string | number | null;
  photo_url: string | null;
  /** TODO(db): not in the payload yet. */
  salary?: number | null;
  status: string | null;
  category: string | null;
  /** Category label ("Senior"). */
  label: string | null;
  position_abbr: string | null;
  positions: string[] | null;
  current_team_id: string | null;
  loaned_team_id: string | null;
  sofifa_link: string | null;
  market_value: number | null;
  rating: number | null;
  sofifa: RpcSofifa | null;
};

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
  const data = await rpc<RpcPlayer | RpcPlayer[] | null>(
    supabase,
    "get_player_by_id",
    { p_player_id: playerId }
  );
  const row = Array.isArray(data) ? data[0] : data;
  return row ?? null;
}

/** EA/SoFIFA preferred-foot code. TODO(db): confirm the mapping. */
const footOf = (n: number | null | undefined): "left" | "right" | null =>
  n === 1 ? "right" : n === 2 ? "left" : null;

const workRateOf = (w: string | null | undefined) => {
  const lw = w?.toLowerCase();
  return lw === "low" || lw === "medium" || lw === "high" ? lw : null;
};

/** The 6 attribute groups for the hexagon + grid, from the sofifa block. */
function buildAttributes(s: RpcSofifa | null) {
  if (!s) return null;
  const items = (pairs: [AttributeKey, number | null][]) =>
    pairs.flatMap(([key, value]) => (value != null ? [{ key, value }] : []));
  const groups: AttributeGroup[] = [
    { key: "pace", value: s.pace ?? 0, items: items([["acceleration", s.acceleration], ["sprint_speed", s.sprint_speed]]) },
    { key: "shooting", value: s.shooting ?? 0, items: items([["positioning", s.positioning], ["finishing", s.finishing], ["shot_power", s.shot_power], ["long_shots", s.long_shots], ["volleys", s.volleys], ["penalties", s.penalties]]) },
    { key: "passing", value: s.passing ?? 0, items: items([["vision", s.vision], ["crossing", s.crossing], ["fk_accuracy", s.fk_accuracy], ["short_passing", s.short_passing], ["long_passing", s.long_passing], ["curve", s.curve]]) },
    { key: "dribbling", value: s.dribbling_overall ?? 0, items: items([["agility", s.agility], ["balance", s.balance], ["reactions", s.reactions], ["ball_control", s.ball_control], ["dribbling", s.dribbling], ["composure", s.composure]]) },
    { key: "defending", value: s.defending ?? 0, items: items([["interceptions", s.interceptions], ["heading_accuracy", s.heading], ["def_awareness", s.def_awareness], ["standing_tackle", s.standing_tackle], ["sliding_tackle", s.sliding_tackle]]) },
    { key: "physical", value: s.physical ?? 0, items: items([["jumping", s.jumping], ["stamina", s.stamina], ["strength", s.strength], ["aggression", s.aggression]]) },
  ];
  return groups.some((grp) => grp.value > 0 || grp.items.length > 0) ? groups : null;
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
        ? countRicherPlayers(supabase, player.market_value)
            .then((n) => n + 1)
            .catch(() => null)
        : Promise.resolve(null),
    ]);
    const teamName = teams?.find((t) => t.id === teamId)?.team_name;

    const s = player.sofifa;
    const positions = player.positions ?? [];
    const primary = player.position_abbr ?? positions[0] ?? "—";
    const secondary = positions.filter((p) => p !== primary).join(" · ");

    return {
      id: player.id,
      name: player.name ?? player.id,
      short_name: surname(player.name ?? player.id),
      position: primary,
      secondary_position: secondary || null,
      nationality: player.country,
      nationality_flag: flagEmoji(player.nationality_code),
      birth_date: player.birth_date,
      height_cm: s?.height ?? null,
      foot: footOf(s?.foot),
      salary: player.salary ?? 0, // TODO(db): salary missing from the payload
      joined_season: null, // TODO(db): no squad history per season yet
      team: teamId
        ? {
            id: teamId,
            name: teamName ?? teamId,
            color: clubColor(teamId),
            division_name: player.label,
          }
        : null,
      sofifa_link: player.sofifa_link,
      value: player.market_value,
      value_rank: rank,
      position_avg_value: null, // TODO(db): needs an aggregate function
      overall: player.rating ?? s?.overall_rating ?? 0,
      potential: s?.potential ?? null,
      skill_moves: s?.skill_moves ?? null,
      weak_foot: s?.weak_foot ?? null,
      attacking_rate: workRateOf(s?.atk_work_rate),
      defensive_rate: workRateOf(s?.def_work_rate),
      attributes: buildAttributes(s),
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
        division_name: player.label ?? "—",
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

  /**
   * Transfer history via get_player_transfers(p_player_id), newest first.
   * Known DB-side issue (same as get_latest_transfers had): some rows come
   * duplicated — shown as-is by request, fix pending in the function.
   */
  async getTransfers(
    supabase: TypedSupabaseClient,
    playerId: string
  ): Promise<PlayerTransfer[]> {
    const rows =
      (await rpc<
        | {
            id: string;
            date: string;
            kind: string | null;
            fee: number | null;
            from_team_id: string;
            from_team_name: string | null;
            to_team_id: string;
            to_team_name: string | null;
          }[]
        | null
      >(supabase, "get_player_transfers", { p_player_id: playerId })) ?? [];

    // "TRF-Temp 31-TRF-…" → "T31".
    const seasonOf = (id: string) => {
      const m = id.match(/Temp\s*(\d+)/i);
      return m ? `T${m[1]}` : "—";
    };

    return rows
      .sort((a, b) => b.date.localeCompare(a.date))
      .map((r) => ({
        id: r.id,
        season: seasonOf(r.id),
        date: r.date,
        kind: transferKindOf(r.kind),
        fee: r.fee,
        from: {
          id: r.from_team_id,
          name: r.from_team_name ?? r.from_team_id,
          color: clubColor(r.from_team_id),
        },
        to: {
          id: r.to_team_id,
          name: r.to_team_name ?? r.to_team_id,
          color: clubColor(r.to_team_id),
        },
      }));
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
    const [top, teams, player] = await Promise.all([
      supabase
        .rpc("get_players", PLAYERS_ARGS)
        .order("market_value", { ascending: false, nullsFirst: false })
        .range(0, 4)
        .then(({ data, error }) => {
          if (error) throw error;
          return (data as PlayerRow[] | null) ?? [];
        }),
      rpc<RpcTeamRow[] | null>(supabase, "get_all_teams"),
      getPlayerRaw(supabase, playerId),
    ]);
    const teamName = (id: string | null) =>
      teams?.find((t) => t.id === id)?.team_name ?? "—";

    const toRow = (
      p: { id: string | null; name: string | null; current_team_id: string | null; market_value: number | null },
      position: number
    ): ValueRankRow => ({
      position,
      player_id: p.id ?? "",
      name: p.name ? `${initials(p.name, 1)}. ${surname(p.name)}` : "—",
      team_name: teamName(p.current_team_id),
      value: p.market_value ?? 0,
      is_self: p.id === playerId,
    });

    const rows = top.map((p, i) => toRow(p, i + 1));
    if (!rows.some((r) => r.is_self) && player?.market_value != null) {
      const richer = await countRicherPlayers(supabase, player.market_value);
      rows.push(
        toRow(
          {
            id: player.id,
            name: player.name,
            current_team_id: player.current_team_id,
            market_value: player.market_value,
          },
          richer + 1
        )
      );
    }
    return rows;
  },
};
