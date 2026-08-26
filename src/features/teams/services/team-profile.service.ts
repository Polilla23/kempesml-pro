/* eslint-disable @typescript-eslint/no-unused-vars -- unused `_supabase`/`_teamId` params on the 3 still-mocked methods; remove when they get real RPCs */
import {
  clubColor,
  competitionKindOf,
  positionGroupOf,
  type MatchResult,
} from "@/lib/football";
import { flagEmoji } from "@/lib/format";
import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables, Views } from "@/types/database.types";

import {
  MOCK_TEAM_FINANCES,
  MOCK_TEAM_HISTORY,
  MOCK_TEAM_RECORDS,
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

/* -------------------------------------------------------------------------- */
/*  Raw RPC payloads (jsonb functions — not covered by generated types)       */
/* -------------------------------------------------------------------------- */

type RpcSeason = { id: string; name: string; status: string };

type RpcTeamProfile = {
  id: string;
  name: string;
  manager_name: string | null;
  season_label: string | null;
  formation: string | null;
  avg_age: number | null;
  squad_size: number | null;
  squad_value: number | null;
  squad_rating: number | null;
  record: {
    won: number;
    lost: number;
    drawn: number;
    played: number;
    points: number;
  } | null;
  team_form:
    | { result: "win" | "draw" | "lose"; home_team_id: string; away_team_id: string }[]
    | null;
  tournaments:
    | { position: string | null; tournament_id: string; tournament_name: string }[]
    | null;
};

type RpcTrophy = {
  kind: "LEAGUE" | "CUP";
  competition: string;
  division: string | null;
  seasons: string[] | null;
  total_trophies: number;
};

type RpcSquadPlayer = {
  id: string;
  name: string;
  rating: number | null;
  salary: number | null;
  status: string | null;
  positions: string[] | null;
  primary_position: string | null;
  nationality_code: string | null;
  market_value: number | null;
};

type RpcFixture = {
  id: string;
  is_home: boolean;
  rival_id: string;
  rival_team_name: string | null;
  rival_manager_name: string | null;
  competition: string;
  competition_kind: string | null;
  competition_division: string | null;
};

type RpcResult = {
  id: string;
  result: "W" | "D" | "L";
  rival_id: string;
  rival_team_name: string | null;
  goals_for: number;
  goals_against: number;
  competition: string;
  competition_kind: string | null;
  competition_division: string | null;
};

type StandingRowRaw = Views<"v_standings_full">;
type PlayerStatRow = Views<"v_tournament_player_stats">;
type TournamentRow = Tables<"tournaments">;

/* -------------------------------------------------------------------------- */
/*  Cached RPC helper                                                         */
/*                                                                            */
/*  Several profile blocks share prerequisites (team profile, season, team    */
/*  list, per-tournament stats). Each hook has its own TanStack cache, so     */
/*  without this the same RPC would fire once per section. Short TTL: this    */
/*  only dedupes calls within one page visit.                                 */
/* -------------------------------------------------------------------------- */

const TTL_MS = 60_000;
const rpcCache = new Map<string, { at: number; promise: Promise<unknown> }>();

function rpc<T>(
  supabase: TypedSupabaseClient,
  fn: string,
  args: Record<string, unknown> = {}
): Promise<T> {
  const key = `${fn}:${JSON.stringify(args)}`;
  const hit = rpcCache.get(key);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.promise as Promise<T>;
  const promise = Promise.resolve(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- fn names are dynamic here; payload types are asserted per call site
    supabase.rpc(fn as any, args as any)
  ).then(({ data, error }) => {
    if (error) {
      rpcCache.delete(key);
      throw error;
    }
    return data as T;
  });
  rpcCache.set(key, { at: Date.now(), promise });
  return promise as Promise<T>;
}

/* ----------------------------- shared lookups ----------------------------- */

const getActiveSeason = (sb: TypedSupabaseClient) =>
  rpc<RpcSeason>(sb, "get_active_season");

const getProfileRaw = (sb: TypedSupabaseClient, teamId: string) =>
  rpc<RpcTeamProfile | null>(sb, "get_team_profile", { p_team_id: teamId });

const getSquadRaw = (sb: TypedSupabaseClient, teamId: string) =>
  rpc<RpcSquadPlayer[] | null>(sb, "get_squad", { p_team_id: teamId });

async function getSeasonTournaments(sb: TypedSupabaseClient) {
  const season = await getActiveSeason(sb);
  const rows = await rpc<TournamentRow[] | null>(sb, "get_tournaments_by_season", {
    p_season_id: season.id,
  });
  return { season, tournaments: rows ?? [] };
}

/** Season stats per player, aggregated across the team's tournaments. */
async function getAggregatedStats(sb: TypedSupabaseClient, teamId: string) {
  const profile = await getProfileRaw(sb, teamId);
  const tournaments = profile?.tournaments ?? [];
  const perTournament = await Promise.all(
    tournaments.map((t) =>
      rpc<PlayerStatRow[] | null>(sb, "get_player_stats_by_tournament", {
        p_tournament_id: t.tournament_id,
        p_team_id: teamId,
      })
    )
  );
  const agg = new Map<
    string,
    { played: number; goals: number; assists: number; mvps: number }
  >();
  for (const row of perTournament.flatMap((r) => r ?? [])) {
    if (!row.player_id) continue;
    const cur = agg.get(row.player_id) ?? { played: 0, goals: 0, assists: 0, mvps: 0 };
    cur.played += row.matches_played ?? 0;
    cur.goals += row.goals ?? 0;
    cur.assists += row.assists ?? 0;
    cur.mvps += row.mvps ?? 0;
    agg.set(row.player_id, cur);
  }
  return agg;
}

/* -------------------------------- mappers --------------------------------- */

const positionLabel = (position: string | null) =>
  position && /^\d+$/.test(position) ? `${position}°` : (position ?? "—");

const formToResult = (r: "win" | "draw" | "lose"): MatchResult =>
  r === "win" ? "W" : r === "draw" ? "D" : "L";

/** "Artem Dovbyk" → "Dovbyk" (pitch labels). */
const surname = (name: string) => name.trim().split(/\s+/).at(-1) ?? name;

/** Preferred position codes per slot (0 = GK, then back → front lines). */
const XI_SLOTS: Record<string, string[][]> = {
  "4-3-3": [
    ["ARQ"],
    ["LI"], ["DFC"], ["DFC"], ["LD"],
    ["MCD", "MC"], ["MC", "MCO", "MI"], ["MC", "MCO", "MD"],
    ["EI", "MI"], ["DC"], ["ED", "MD"],
  ],
  "4-4-2": [
    ["ARQ"],
    ["LI"], ["DFC"], ["DFC"], ["LD"],
    ["MI", "EI"], ["MC", "MCD"], ["MC", "MCO"], ["MD", "ED"],
    ["DC"], ["DC", "MCO"],
  ],
  "3-5-2": [
    ["ARQ"],
    ["DFC"], ["DFC"], ["DFC"],
    ["MI", "LI"], ["MC", "MCD"], ["MCD", "MC"], ["MC", "MCO"], ["MD", "LD"],
    ["DC"], ["DC", "MCO"],
  ],
};

/* -------------------------------------------------------------------------- */
/*  Public service                                                            */
/*                                                                            */
/*  History, records and finances are still MOCKED — the DB has no functions  */
/*  for them yet (see TODO(db) on each). Everything else hits real RPCs.      */
/* -------------------------------------------------------------------------- */

export const teamProfileService = {
  /** get_team_profile + get_team_trophies + season tournaments (division). */
  async getHeader(
    supabase: TypedSupabaseClient,
    teamId: string
  ): Promise<TeamProfileHeader | null> {
    const [profile, trophies, { season, tournaments }] = await Promise.all([
      getProfileRaw(supabase, teamId),
      rpc<RpcTrophy[] | null>(supabase, "get_team_trophies", { p_team_id: teamId }),
      getSeasonTournaments(supabase),
    ]);
    if (!profile) return null;

    // The team's league this season (senior league first) → hero badge.
    const byId = new Map(tournaments.map((t) => [t.id, t]));
    const myLeagues = (profile.tournaments ?? [])
      .map((m) => ({ m, t: byId.get(m.tournament_id) }))
      .filter((x) => x.t?.type === "LEAGUE")
      .sort((a, b) =>
        (a.t?.category === "senior" ? 0 : 1) - (b.t?.category === "senior" ? 0 : 1)
      );
    const league = myLeagues[0];

    const record = profile.record ?? { won: 0, lost: 0, drawn: 0, played: 0, points: 0 };
    return {
      id: profile.id,
      name: profile.name,
      color: clubColor(profile.id),
      manager_name: profile.manager_name ?? "—",
      season_label: profile.season_label ?? season.id,
      formation: profile.formation ?? "4-3-3",
      division_name: league?.t
        ? `${league.t.name}${league.t.division ? ` · ${league.t.division}` : ""}`
        : season.name,
      division_position: positionLabel(league?.m.position ?? null),
      squad_rating: profile.squad_rating ?? 0,
      squad_value: profile.squad_value ?? 0,
      squad_size: profile.squad_size ?? 0,
      avg_age: profile.avg_age ?? 0,
      form: (profile.team_form ?? []).map((f) => formToResult(f.result)),
      record: {
        played: record.played,
        won: record.won,
        drawn: record.drawn,
        lost: record.lost,
        points: record.points,
      },
      trophies: (trophies ?? []).map((tr) => ({
        competition: tr.competition,
        short_name: tr.division ? `${tr.competition} ${tr.division}` : tr.competition,
        kind:
          tr.kind === "LEAGUE" ? "league" : competitionKindOf("CUP", tr.competition),
        seasons: tr.seasons ?? [],
      })),
    };
  },

  /** get_team_fixtures(p_team_id, p_limit): next matches with rival resolved. */
  async getFixtures(
    supabase: TypedSupabaseClient,
    teamId: string,
    limit = 6
  ): Promise<TeamFixture[]> {
    const rows =
      (await rpc<RpcFixture[] | null>(supabase, "get_team_fixtures", {
        p_team_id: teamId,
        p_limit: limit,
      })) ?? [];
    return rows.map((m) => ({
      id: m.id,
      competition: m.competition,
      competition_kind: competitionKindOf(m.competition_kind, m.competition),
      // TODO(db): the RPC has no date/matchday yet — cards show "TBD".
      kickoff_at: null,
      plazo: null,
      is_home: m.is_home,
      rival: {
        id: m.rival_id,
        name: m.rival_team_name ?? m.rival_id,
        color: clubColor(m.rival_id),
        manager_name: m.rival_manager_name ?? "—",
      },
    }));
  },

  /** get_team_results(p_team_id, p_limit): last played matches, newest first. */
  async getResults(
    supabase: TypedSupabaseClient,
    teamId: string,
    limit = 5
  ): Promise<TeamMatchResult[]> {
    const rows =
      (await rpc<RpcResult[] | null>(supabase, "get_team_results", {
        p_team_id: teamId,
        p_limit: limit,
      })) ?? [];
    return rows.map((m) => ({
      id: m.id,
      result: m.result,
      is_home: null, // TODO(db): not exposed by the RPC yet
      rival_name: m.rival_team_name ?? m.rival_id,
      competition: m.competition,
      played_at: null, // TODO(db): matches carry no real date yet
      goals_for: m.goals_for,
      goals_against: m.goals_against,
    }));
  },

  /** Best XI computed from the squad (highest rating fitting each slot). */
  async getBestXi(supabase: TypedSupabaseClient, teamId: string): Promise<BestXi> {
    const [profile, squad] = await Promise.all([
      getProfileRaw(supabase, teamId),
      getSquadRaw(supabase, teamId),
    ]);
    const formation =
      profile?.formation && XI_SLOTS[profile.formation] ? profile.formation : "4-3-3";
    const slots = XI_SLOTS[formation];
    const pool = (squad ?? [])
      .map((p) => ({
        ...p,
        codes: p.positions?.length ? p.positions : p.primary_position ? [p.primary_position] : [],
      }))
      .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

    const used = new Set<string>();
    const pick = (accepted: string[]) => {
      const exact = pool.find(
        (p) => !used.has(p.id) && p.codes.some((c) => accepted.includes(c))
      );
      const chosen =
        exact ??
        pool.find(
          (p) =>
            !used.has(p.id) &&
            p.codes.some((c) => positionGroupOf(c) === positionGroupOf(accepted[0]))
        ) ??
        pool.find((p) => !used.has(p.id));
      if (chosen) used.add(chosen.id);
      return chosen;
    };

    return {
      formation,
      players: slots.flatMap((accepted, slot) => {
        const p = pick(accepted);
        return p
          ? [{ player_id: p.id, short_name: surname(p.name), rating: p.rating ?? 0, slot }]
          : [];
      }),
    };
  },

  /** One standings table per tournament the team plays this season. */
  async getStandings(
    supabase: TypedSupabaseClient,
    teamId: string
  ): Promise<StandingsTable[]> {
    const [profile, { tournaments }] = await Promise.all([
      getProfileRaw(supabase, teamId),
      getSeasonTournaments(supabase),
    ]);
    const mine = profile?.tournaments ?? [];
    const typeById = new Map(tournaments.map((t) => [t.id, t.type]));
    const tables = await Promise.all(
      mine.map(async (t) => {
        const rows =
          (await rpc<StandingRowRaw[] | null>(supabase, "get_standings_by_tournament", {
            p_tournament_id: t.tournament_id,
          })) ?? [];
        return {
          competition_id: t.tournament_id,
          competition_name: t.tournament_name,
          rows: rows
            .sort((a, b) => (a.position ?? 99) - (b.position ?? 99))
            .map((r) => ({
              position: r.position ?? 0,
              team_id: r.team_id ?? "",
              team_name: r.team_name ?? r.team_id ?? "—",
              played: r.played ?? 0,
              goal_diff: r.goal_difference ?? 0,
              points: r.points ?? 0,
              note: null,
              is_self: r.team_id === teamId,
            })),
        };
      })
    );
    // Leagues first (senior league is usually the one the user cares about).
    return tables
      .filter((t) => t.rows.length > 0)
      .sort(
        (a, b) =>
          (typeById.get(a.competition_id) === "LEAGUE" ? 0 : 1) -
          (typeById.get(b.competition_id) === "LEAGUE" ? 0 : 1)
      );
  },

  /** get_squad + season stats aggregated across tournaments. */
  async getSquad(supabase: TypedSupabaseClient, teamId: string): Promise<SquadPlayer[]> {
    const [squad, stats] = await Promise.all([
      getSquadRaw(supabase, teamId),
      getAggregatedStats(supabase, teamId),
    ]);
    return (squad ?? [])
      .map((p) => {
        const s = stats.get(p.id);
        const position = p.primary_position ?? p.positions?.[0] ?? null;
        return {
          player_id: p.id,
          name: p.name,
          nationality_flag: flagEmoji(p.nationality_code),
          position: position ?? "—",
          position_group: positionGroupOf(position),
          rating: p.rating ?? 0,
          played: s?.played ?? 0,
          goals: s?.goals ?? 0,
          assists: s?.assists ?? 0,
          salary: p.salary ?? 0,
          value: p.market_value ?? 0,
          // TODO(db): no transferable flag in the DB yet — expose it on
          // players (or get_squad) and map it here.
          transferable: false,
        };
      })
      .sort((a, b) => b.rating - a.rating);
  },

  /** Top scorer (goals) and MVP (mvps) from the aggregated season stats. */
  async getHighlights(
    supabase: TypedSupabaseClient,
    teamId: string
  ): Promise<TeamHighlights> {
    const [squad, stats] = await Promise.all([
      getSquadRaw(supabase, teamId),
      getAggregatedStats(supabase, teamId),
    ]);
    const byId = new Map((squad ?? []).map((p) => [p.id, p]));
    const rows = [...stats.entries()].map(([id, s]) => ({ id, ...s }));
    const top = (key: "goals" | "mvps") =>
      [...rows].sort((a, b) => b[key] - a[key])[0];

    const scorer = top("goals");
    const mvp = top("mvps") ?? scorer;
    const info = (id?: string) => (id ? byId.get(id) : undefined);
    const sp = info(scorer?.id);
    const mp = info(mvp?.id);
    return {
      top_scorer: {
        player_id: scorer?.id ?? "",
        name: sp?.name ?? "—",
        position: sp?.primary_position ?? "—",
        rating: sp?.rating ?? 0,
        played: scorer?.played ?? 0,
        goals: scorer?.goals ?? 0,
      },
      mvp: {
        player_id: mvp?.id ?? "",
        name: mp?.name ?? "—",
        position: mp?.primary_position ?? "—",
        rating: mp?.rating ?? 0,
        goals: mvp?.goals ?? 0,
        assists: mvp?.assists ?? 0,
        mvp_awards: mvp?.mvps ?? 0,
      },
    };
  },

  /**
   * TODO(db): still MOCKED. Needs per-season history (standings + stage per
   * tournament for past seasons) — e.g. `get_team_history(p_team_id)`.
   */
  async getHistory(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<TeamSeasonEntry[]> {
    return MOCK_TEAM_HISTORY;
  },

  /**
   * TODO(db): still MOCKED. Needs all-time records —
   * e.g. `get_team_records(p_team_id)`.
   */
  async getRecords(
    _supabase: TypedSupabaseClient,
    _teamId: string
  ): Promise<TeamRecord[]> {
    return MOCK_TEAM_RECORDS;
  },

  /**
   * TODO(db): still MOCKED. Needs finances —
   * e.g. `get_team_finances(p_team_id, p_season_id)` guarded by
   * manages_team()/is_admin().
   */
  async getFinances(
    _supabase: TypedSupabaseClient,
    _teamId: string,
    _seasonId?: string
  ): Promise<TeamFinances> {
    return MOCK_TEAM_FINANCES;
  },
};
