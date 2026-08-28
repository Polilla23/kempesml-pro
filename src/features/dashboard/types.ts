import type { CompetitionKind } from "@/lib/football";

/** Season header info for the home hero. */
export type SeasonInfo = {
  id: string;
  name: string;
  status: string;
};

/** Hero KPIs. Transfer metrics are null until the transfers table exists. */
export type SeasonSummary = {
  season_id: string;
  matches_played: number;
  matches_total: number;
  transfers_count: number | null;
  transfers_amount: number | null;
};

/** Reigning champion of one tournament (last finished season). */
export type SeasonChampion = {
  tournament_id: string;
  tournament_name: string;
  kind: CompetitionKind;
  team_id: string;
  team_name: string;
};

/** One card of the global "últimos resultados" carousel. */
export type LatestResult = {
  id: string;
  competition: string;
  competition_kind: CompetitionKind;
  division: string | null;
  plazo: string | null;
  home_team_id: string;
  home_team_name: string;
  home_score: number;
  away_team_id: string;
  away_team_name: string;
  away_score: number;
  /** When the result was loaded (orders the feed). */
  loaded_at: string;
};

/** Current matchday window and the user's team progress in it. */
export type PlazoInfo = {
  plazo: string;
  /** "Fechas 13–14". */
  label: string;
  /** ISO deadline. */
  deadline: string;
  /** Matches of the user's team already loaded in this window. */
  loaded: number;
  total: number;
};

export type TransferFeedItem = {
  id: string;
  player_id: string;
  player_name: string;
  /** Player portrait URL (may 404 for players without an uploaded photo). */
  photo_url: string | null;
  position: string;
  kind: "purchase" | "loan" | "free";
  fee: number | null;
  /** ISO datetime. */
  date: string;
  from_team_id: string;
  from_team_name: string;
  from_team_logo: string | null;
  to_team_id: string;
  to_team_name: string;
  to_team_logo: string | null;
};

export type NewsItem = {
  id: string;
  title: string;
  tag: string;
  tone: "blue" | "green" | "sky" | "amber" | "gold";
  /** ISO datetime. */
  created_at: string;
};

export type HomeStandingRow = {
  position: number;
  team_id: string;
  team_name: string;
  /** Manager username, resolved from the teams list. */
  manager_name: string | null;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goal_diff: number;
  points: number;
};

/** One league table for the home carousel. */
export type LeagueTable = {
  tournament_id: string;
  name: string;
  division: string | null;
  category: string | null;
  rows: HomeStandingRow[];
};
