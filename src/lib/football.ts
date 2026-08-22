/**
 * Domain helpers shared by the teams/players features: rating colors,
 * position groups, match results and formation layouts.
 */

export type MatchResult = "W" | "D" | "L";

export type PositionGroup = "GK" | "DEF" | "MID" | "FWD";

export const POSITION_GROUPS: PositionGroup[] = ["GK", "DEF", "MID", "FWD"];

/** Text color for a 0–100 rating (gold ≥ 90, green ≥ 84, orange ≥ 70, red below). */
export function ratingTextClass(rating: number) {
  if (rating >= 90) return "text-amber-500 dark:text-amber-400";
  if (rating >= 84) return "text-emerald-600 dark:text-emerald-400";
  if (rating >= 70) return "text-orange-500 dark:text-orange-400";
  return "text-red-600 dark:text-red-400";
}

/** bg+text classes for a small rating chip (attribute values). */
export function ratingChipClass(rating: number) {
  if (rating >= 85)
    return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
  if (rating >= 70)
    return "bg-orange-500/15 text-orange-700 dark:text-orange-400";
  return "bg-red-500/15 text-red-700 dark:text-red-400";
}

/** Stroke/fill CSS color for a rating, for inline SVG charts. */
export function ratingSvgColor(rating: number) {
  if (rating >= 85) return "var(--color-emerald-500)";
  if (rating >= 70) return "var(--color-orange-500)";
  return "var(--color-red-500)";
}

export type CompetitionKind = "league" | "cup" | "youth" | "gold" | "silver";

export function competitionIcon(kind: CompetitionKind) {
  return (
    { league: "🏟️", cup: "🏆", youth: "🏅", gold: "🥇", silver: "🥈" } as const
  )[kind];
}

export function competitionTextClass(kind: CompetitionKind) {
  return (
    {
      league: "text-primary",
      cup: "text-amber-600 dark:text-amber-400",
      youth: "text-emerald-600 dark:text-emerald-400",
      gold: "text-amber-600 dark:text-amber-400",
      silver: "text-muted-foreground",
    } as const
  )[kind];
}

/** Chip classes (border/bg/badge) for a trophy of the given kind. */
export function trophyChipClass(kind: CompetitionKind) {
  if (kind === "silver")
    return {
      chip: "border-zinc-400/40 bg-zinc-400/10",
      count: "bg-zinc-400 text-zinc-950",
    };
  if (kind === "league")
    return {
      chip: "border-primary/40 bg-primary/10",
      count: "bg-primary text-primary-foreground",
    };
  return {
    chip: "border-amber-500/40 bg-amber-500/10",
    count: "bg-amber-400 text-amber-950",
  };
}

export function resultBgClass(r: MatchResult) {
  if (r === "W") return "bg-emerald-500 text-white";
  if (r === "D") return "bg-amber-500 text-white";
  return "bg-red-500 text-white";
}

/**
 * Pitch coordinates (percent top/left) for each slot of a formation.
 * Slot 0 is always the goalkeeper; the rest follow the lines back → front.
 * The DB only needs to return `slot` per player of the best XI.
 */
export const FORMATION_SLOTS: Record<string, { top: number; left: number }[]> =
  {
    "4-3-3": [
      { top: 86, left: 50 },
      { top: 66, left: 14 },
      { top: 70, left: 37 },
      { top: 70, left: 63 },
      { top: 66, left: 86 },
      { top: 51, left: 50 },
      { top: 38, left: 28 },
      { top: 38, left: 72 },
      { top: 18, left: 15 },
      { top: 11, left: 50 },
      { top: 18, left: 85 },
    ],
    "4-4-2": [
      { top: 86, left: 50 },
      { top: 66, left: 14 },
      { top: 70, left: 37 },
      { top: 70, left: 63 },
      { top: 66, left: 86 },
      { top: 42, left: 14 },
      { top: 46, left: 37 },
      { top: 46, left: 63 },
      { top: 42, left: 86 },
      { top: 16, left: 36 },
      { top: 16, left: 64 },
    ],
    "3-5-2": [
      { top: 86, left: 50 },
      { top: 68, left: 25 },
      { top: 72, left: 50 },
      { top: 68, left: 75 },
      { top: 44, left: 10 },
      { top: 50, left: 32 },
      { top: 54, left: 50 },
      { top: 50, left: 68 },
      { top: 44, left: 90 },
      { top: 16, left: 36 },
      { top: 16, left: 64 },
    ],
  };
