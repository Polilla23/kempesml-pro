import type { TypedSupabaseClient } from "@/lib/supabase/types";
import type { Tables } from "@/types/database.types";

import { TITLE_RULES, titleRuleOf } from "../points";
import type { Palmares, PalmaresClub, PalmaresTrophy } from "../types";

type SeasonRow = Tables<"seasons">;

type ChampionRow = {
  team_id: string;
  team_name: string;
  tournament_id: string;
  tournament_name: string;
  tournament_type: string | null;
  division: string | null;
  category: string | null;
};

/**
 * "Liga Mayores T31" → "Liga Mayores"; appends the division when the name
 * does not carry it ("Liga Mayores" + division "B" → "Liga Mayores B") so
 * titles group consistently across eras.
 */
function baseCompetition(name: string, division: string | null) {
  let base = name.replace(/\s*T\d+$/i, "").trim();
  if (division && !new RegExp(`\\s${division}$`, "i").test(base)) {
    base += ` ${division}`;
  }
  return base;
}

const seasonNumber = (id: string) => Number(id.replace(/\D/g, "")) || 0;

/**
 * Data-access for the Historia page.
 *
 * The all-time palmarés is composed from get_seasons × get_season_champions
 * (the trophies data already lives in the DB). TODO(db): a single
 * `get_palmares()` returning every title in one call would replace the ~32
 * per-season requests; title POINTS are front config until the DB stores
 * points per competition (see ../points.ts).
 */
export const historyService = {
  async getPalmares(supabase: TypedSupabaseClient): Promise<Palmares> {
    const { data: seasonsData, error } = await supabase.rpc("get_seasons", {
      p_status: null as unknown as string,
    });
    if (error) throw error;
    const seasons = (seasonsData as SeasonRow[] | null) ?? [];

    const perSeason = await Promise.all(
      seasons.map((s) =>
        Promise.resolve(
          supabase.rpc("get_season_champions", { p_season_id: s.id })
        )
          .then(({ data }) => {
            const rows = data as ChampionRow[] | ChampionRow | null;
            return (Array.isArray(rows) ? rows : rows ? [rows] : []).map(
              (r) => ({ ...r, season_id: s.id })
            );
          })
          .catch(() => [] as (ChampionRow & { season_id: string })[])
      )
    );
    const titles = perSeason.flat();

    // team → canonical competition → seasons. Titles outside the official
    // seven (see ../points.ts) are excluded from the whole palmarés.
    const byTeam = new Map<
      string,
      { team_name: string; comps: Map<string, string[]> }
    >();
    for (const t of titles) {
      const rule = titleRuleOf(baseCompetition(t.tournament_name, t.division));
      if (!rule) continue;
      const team =
        byTeam.get(t.team_id) ??
        byTeam.set(t.team_id, { team_name: t.team_name, comps: new Map() }).get(t.team_id)!;
      team.comps.set(rule.name, [...(team.comps.get(rule.name) ?? []), t.season_id]);
    }

    const clubs: PalmaresClub[] = [...byTeam.entries()]
      .map(([team_id, { team_name, comps }]) => {
        const trophies: PalmaresTrophy[] = TITLE_RULES.flatMap((rule) => {
          const seasonIds = comps.get(rule.name);
          if (!seasonIds) return [];
          return [
            {
              competition: rule.name,
              icon: rule.icon,
              tone: rule.tone,
              pts: rule.pts,
              seasons: [...seasonIds].sort(
                (a, b) => seasonNumber(a) - seasonNumber(b)
              ),
            },
          ];
        });
        return {
          team_id,
          team_name,
          trophies,
          points: trophies.reduce((n, t) => n + t.pts * t.seasons.length, 0),
          titles: trophies.reduce((n, t) => n + t.seasons.length, 0),
        };
      })
      .sort((a, b) => b.points - a.points || b.titles - a.titles);

    return {
      clubs,
      // The reference sidebar shows exactly the official list, in its order.
      values: TITLE_RULES.map((r) => ({
        competition: r.name,
        icon: r.icon,
        tone: r.tone,
        pts: r.pts,
      })),
      seasons_count: seasons.length,
      competitions_count: TITLE_RULES.length,
    };
  },
};
