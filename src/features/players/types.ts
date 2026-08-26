import type { CompetitionKind } from "@/lib/football";
import type { Views } from "@/types/database.types";

/** Row of the players list (`get_players` → SETOF v_players_full). */
export type PlayerListItem = Views<"v_players_full">;

/* -------------------------------------------------------------------------- */
/*  Player profile                                                            */
/*                                                                            */
/*  Shape consumed by the profile page. Fields the DB cannot provide yet are  */
/*  nullable and their UI blocks hide themselves — see                        */
/*  services/player-profile.service.ts for what is real vs pending.           */
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
  /** Primary position code as stored in the DB ("DC", "MC", "ARQ"...). */
  position: string;
  /** Other playable positions ("LD · MD"), if any. */
  secondary_position: string | null;
  nationality: string | null;
  nationality_flag: string;
  /** ISO date, when known. */
  birth_date: string | null;
  height_cm: number | null;
  foot: Foot | null;
  salary: number;
  /** Season label in which the player joined the current club (TODO(db)). */
  joined_season: string | null;
  team: (PlayerClubRef & { division_name: string | null }) | null;
  /** External profile (SoFIFA), when scraped. */
  sofifa_link: string | null;
  value: number | null;
  /** Rank by market value across the whole league system (1 = top). */
  value_rank: number | null;
  /** Average value of players with the same position (TODO(db)). */
  position_avg_value: number | null;
  overall: number;
  potential: number | null;
  skill_moves: number | null;
  weak_foot: number | null;
  attacking_rate: WorkRate | null;
  defensive_rate: WorkRate | null;
  /** null until the DB exposes players_scrapped_stats. */
  attributes: AttributeGroup[] | null;
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
  value: number | null;
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
