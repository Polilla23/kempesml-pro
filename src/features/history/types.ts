import type { TitleTone } from "./points";

/** One competition a club has won, with every season it took it. */
export type PalmaresTrophy = {
  competition: string;
  icon: string;
  tone: TitleTone;
  pts: number;
  /** Season labels, oldest first ("T4", "T7"). */
  seasons: string[];
};

export type PalmaresClub = {
  team_id: string;
  team_name: string;
  points: number;
  titles: number;
  /** Sorted by title value (most valuable first). */
  trophies: PalmaresTrophy[];
};

/** Sidebar reference: what each title is worth. */
export type TitleValueRow = {
  competition: string;
  icon: string;
  tone: TitleTone;
  pts: number;
};

export type Palmares = {
  clubs: PalmaresClub[];
  values: TitleValueRow[];
  seasons_count: number;
  competitions_count: number;
};
