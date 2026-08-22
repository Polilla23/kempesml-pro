import type {
  CompetitionKind,
  MatchResult,
  PositionGroup,
} from "@/lib/football";
import type {
  Tables,
  TablesInsert,
  TablesUpdate,
} from "@/types/database.types";

export type Team = Tables<"teams">;
export type TeamInsert = TablesInsert<"teams">;
export type TeamUpdate = TablesUpdate<"teams">;

/* -------------------------------------------------------------------------- */
/*  Team profile (club page)                                                   */
/*                                                                            */
/*  These are the JSON shapes the profile RPCs are expected to return (see    */
/*  services/team-profile.service.ts). snake_case on purpose: it is what      */
/*  `jsonb_build_object` in Postgres will produce, so the swap from mocks to  */
/*  RPCs does not touch the UI.                                               */
/* -------------------------------------------------------------------------- */

/** Minimal club reference embedded in other payloads (rivals, transfers...). */
export type TeamRef = {
  id: string;
  name: string;
  /** CSS color used for the club avatar. */
  color: string;
  manager_name?: string | null;
};

export type TeamTrophy = {
  competition: string;
  /** Short label for the chip ("Liga 1ª"). */
  short_name: string;
  kind: CompetitionKind;
  /** Seasons in which it was won, e.g. ["T4", "T7"]. */
  seasons: string[];
};

export type TeamProfileHeader = TeamRef & {
  manager_name: string;
  season_label: string;
  formation: string;
  division_name: string;
  division_position: number;
  squad_rating: number;
  squad_value: number;
  squad_size: number;
  avg_age: number;
  /** Last 5 results, oldest → newest. */
  form: MatchResult[];
  record: {
    played: number;
    won: number;
    drawn: number;
    lost: number;
    points: number;
  };
  trophies: TeamTrophy[];
};

export type { CompetitionKind };

export type TeamFixture = {
  id: string;
  competition: string;
  competition_kind: CompetitionKind;
  /** ISO datetime. */
  kickoff_at: string;
  is_home: boolean;
  rival: TeamRef;
};

export type TeamMatchResult = {
  id: string;
  result: MatchResult;
  is_home: boolean;
  rival_name: string;
  competition: string;
  /** ISO date. */
  played_at: string;
  goals_for: number;
  goals_against: number;
};

export type BestXiPlayer = {
  player_id: string;
  short_name: string;
  rating: number;
  /** Index into `FORMATION_SLOTS[formation]` (0 = goalkeeper). */
  slot: number;
};

export type BestXi = {
  formation: string;
  players: BestXiPlayer[];
};

export type StandingRow = {
  position: number;
  team_id: string;
  team_name: string;
  played: number;
  goal_diff: number;
  points: number;
  /** Free text from the DB: "Campeón", "Descenso", "Clasifica"... */
  note: string | null;
  is_self: boolean;
};

export type StandingsTable = {
  competition_id: string;
  competition_name: string;
  rows: StandingRow[];
};

export type SquadPlayer = {
  player_id: string;
  name: string;
  nationality_flag: string;
  position: string;
  position_group: PositionGroup;
  rating: number;
  played: number;
  goals: number;
  assists: number;
  salary: number;
  value: number;
  transferable: boolean;
};

export type TeamHighlights = {
  top_scorer: {
    player_id: string;
    name: string;
    position: string;
    rating: number;
    played: number;
    goals: number;
  };
  mvp: {
    player_id: string;
    name: string;
    position: string;
    rating: number;
    goals: number;
    assists: number;
    mvp_awards: number;
  };
};

export type AchievementKind = "gold" | "ok" | "none";

export type TeamSeasonEntry = {
  season: string;
  competition: string;
  competition_kind: CompetitionKind;
  /** "1°", "Semifinal", "Campeón"... */
  position_label: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  achievement: string;
  achievement_kind: AchievementKind;
};

export type TeamRecord = {
  key: string;
  label: string;
  value: string;
  detail: string;
  tone: "green" | "blue" | "gold";
};

export type FinanceMovement = {
  id: string;
  kind: "in" | "out";
  concept: string;
  detail: string;
  /** ISO date or null for accumulated items. */
  date: string | null;
  amount: number;
};

export type TeamFinances = {
  season_label: string;
  income: number;
  expenses: number;
  balance: number;
  budget: number;
  movements: FinanceMovement[];
};
