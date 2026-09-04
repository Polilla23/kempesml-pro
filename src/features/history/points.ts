/**
 * Official palmarés policy (defined by the league, 2026-09-04): ONLY these
 * seven competitions count — anything else (B/C/D leagues, Copa Cindor
 * Kempesitas, Copa Bronce, Next Gen, Eurocopa...) is excluded from the
 * ranking, the trophy chips and the reference table.
 *
 * TODO(db): ideally this config lives in the DB (e.g. a competition-points
 * table) and `get_palmares()` returns it — then this file dies.
 *
 * `test` matches the competition base name (season suffix stripped, division
 * appended); name variants across eras collapse into the canonical `name`.
 */

export type TitleTone = "gold" | "blue" | "green" | "silver" | "plain";

export type TitleRule = {
  test: RegExp;
  /** Canonical display name (variants merge into it). */
  name: string;
  pts: number;
  icon: string;
  tone: TitleTone;
};

/** In the league's official order — the reference sidebar shows exactly this. */
export const TITLE_RULES: TitleRule[] = [
  { test: /^liga mayores( a)?$/i, name: "Liga Mayores A", pts: 10, icon: "🏆", tone: "blue" },
  { test: /^copa de oro$/i, name: "Copa de Oro", pts: 10, icon: "🥇", tone: "gold" },
  { test: /^copa de plata$/i, name: "Copa de Plata", pts: 4, icon: "🥈", tone: "silver" },
  { test: /^copa cindor$/i, name: "Copa Cindor", pts: 4, icon: "⭐", tone: "gold" },
  { test: /^liga (nesquik )?kempesitas( a)?$/i, name: "Liga Nesquik Kempesitas A", pts: 5, icon: "🏅", tone: "green" },
  { test: /^supercopa$/i, name: "Supercopa", pts: 1, icon: "🏆", tone: "plain" },
  // Symbolic: shows in the palmarés but adds no points.
  { test: /^mundial$/i, name: "Mundial", pts: 0, icon: "🌍", tone: "gold" },
];

/** The matching rule, or null when the competition does not count. */
export function titleRuleOf(competition: string): TitleRule | null {
  return TITLE_RULES.find((r) => r.test.test(competition)) ?? null;
}
