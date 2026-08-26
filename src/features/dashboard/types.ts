/** Season header info for the home hero. */
export type SeasonInfo = {
  id: string;
  name: string;
  status: string;
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
