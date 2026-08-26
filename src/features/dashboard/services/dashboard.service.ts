import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables, Views } from "@/types/database.types";

import type { LeagueTable, SeasonInfo } from "../types";

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
 * Blocks of the design that still need DB endpoints (see
 * docs/db-pending-home.md) and are NOT rendered yet:
 *  - TODO(db): `get_season_summary`      → hero KPIs (partidos jugados/total,
 *    transferencias y dinero movido de la temporada anterior).
 *  - TODO(db): `get_season_champions`    → campeones vigentes del hero.
 *  - TODO(db): `get_latest_results`      → carrusel global de resultados.
 *  - TODO(db): `get_latest_transfers`    → carrusel de transferencias
 *    (depende de la tabla `transfers`).
 *  - TODO(db): tabla `news` + `get_news` → grilla de noticias.
 *  - TODO(db): plazo vigente + deadline  → "Plazo 7 · vence en 2d 14h" del
 *    hero y el chip de "Tus partidos".
 */
export const dashboardService = {
  /** Active season via get_active_season(). */
  async getSeasonInfo(supabase: TypedSupabaseClient): Promise<SeasonInfo> {
    const s = await rpc<SeasonInfo>(supabase, "get_active_season");
    return { id: s.id, name: s.name, status: s.status };
  },

  /**
   * Every LEAGUE standings table of the active season (senior first), with
   * manager names resolved from the teams list.
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
      .filter((t) => t.type === "LEAGUE")
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
};
