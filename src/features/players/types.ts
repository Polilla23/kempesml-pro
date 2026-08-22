import type { CompetitionKind } from "@/lib/football";

/* -------------------------------------------------------------------------- */
/*  Player profile                                                            */
/*                                                                            */
/*  JSON shapes the player RPCs are expected to return — see                  */
/*  services/player-profile.service.ts. snake_case on purpose (Postgres       */
/*  `jsonb_build_object`) so the swap from mocks to RPCs does not touch UI.   */
/* -------------------------------------------------------------------------- */

/** Minimal club reference embedded in player payloads. */
export type PlayerClubRef = {
  id: string;
  name: string;
  /** CSS color for the club avatar. */
  color: string;
};

export type Foot = "left" | "right" | "both";
export type WorkRate = "low" | "medium" | "high";

export type AttributeGroupKey =
  | "pace"
  | "shooting"
  | "passing"
  | "dribbling"
  | "defending"
  | "physical";

/** Sub-attribute keys, translated in `playerProfile.attributes.items.*`. */
export type AttributeKey =
  | "acceleration"
  | "sprint_speed"
  | "positioning"
  | "finishing"
  | "shot_power"
  | "long_shots"
  | "volleys"
  | "penalties"
  | "vision"
  | "crossing"
  | "fk_accuracy"
  | "short_passing"
  | "long_passing"
  | "curve"
  | "agility"
  | "balance"
  | "reactions"
  | "ball_control"
  | "dribbling"
  | "composure"
  | "interceptions"
  | "heading_accuracy"
  | "def_awareness"
  | "standing_tackle"
  | "sliding_tackle"
  | "jumping"
  | "stamina"
  | "strength"
  | "aggression";

export type AttributeGroup = {
  key: AttributeGroupKey;
  value: number;
  items: { key: AttributeKey; value: number }[];
};

export type PlayerProfile = {
  id: string;
  name: string;
  /** Surname / short display name for the card. */
  short_name: string;
  /** Position code as stored in the DB ("DC", "MC", "POR"...). */
  position: string;
  /** Human label ("Delantero Centro"). */
  position_label: string;
  secondary_position: string | null;
  nationality: string;
  nationality_flag: string;
  /** ISO date. */
  birth_date: string;
  height_cm: number;
  foot: Foot;
  salary: number;
  /** Season label in which the player joined the current club. */
  joined_season: string;
  team: PlayerClubRef & { division_name: string };
  value: number;
  /** Rank by market value within the team's league (1 = most valuable). */
  value_rank: number;
  /** Average value of players with the same position in the league. */
  position_avg_value: number;
  overall: number;
  potential: number;
  /** 1–5 stars. */
  skill_moves: number;
  weak_foot: number;
  attacking_rate: WorkRate;
  defensive_rate: WorkRate;
  attributes: AttributeGroup[];
};

export type PlayerSeasonCompetition = {
  competition: string;
  competition_kind: CompetitionKind;
  /** "Campeón", "Semifinal", "3°"... */
  stage: string;
  played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
};

export type PlayerSeason = {
  season: string;
  team: PlayerClubRef;
  division_name: string;
  rating: number;
  played: number;
  goals: number;
  assists: number;
  yellow_cards: number;
  red_cards: number;
  value: number;
  competitions: PlayerSeasonCompetition[];
};

export type TransferKind = "purchase" | "loan" | "free";

export type PlayerTransfer = {
  id: string;
  season: string;
  /** ISO date. */
  date: string;
  from: PlayerClubRef;
  to: PlayerClubRef;
  kind: TransferKind;
  fee: number;
};

export type PlayerValuePoint = {
  season: string;
  value: number;
  team: PlayerClubRef;
};

export type ValueRankRow = {
  position: number;
  player_id: string;
  name: string;
  team_name: string;
  value: number;
  is_self: boolean;
};
