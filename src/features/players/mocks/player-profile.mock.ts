/**
 * MOCK DATA for the player profile page.
 *
 * Everything in this file disappears once the DB exposes the player RPCs —
 * see `services/player-profile.service.ts` for the function ↔ RPC mapping.
 * Shapes mirror what the RPCs must return (`../types.ts`).
 */
import type {
  PlayerClubRef,
  PlayerProfile,
  PlayerSeason,
  PlayerTransfer,
  PlayerValuePoint,
  ValueRankRow,
} from "../types";

const CLUBS: Record<string, PlayerClubRef> = {
  salzburg: { id: "rb-salzburgo", name: "RB Salzburgo", color: "#c8102e" },
  dortmund: { id: "b-dortmund", name: "B. Dortmund", color: "#e5b800" },
  city: { id: "manchester-city", name: "Manchester City", color: "#6cabdd" },
  river: { id: "river-plate", name: "River Plate", color: "#d11b2e" },
};

export const MOCK_PLAYER: PlayerProfile = {
  id: "haaland",
  name: "Erling Haaland",
  short_name: "Haaland",
  position: "DC",
  position_label: "Delantero Centro",
  secondary_position: null,
  nationality: "Noruega",
  nationality_flag: "🇳🇴",
  birth_date: "2000-07-21",
  height_cm: 195,
  foot: "left",
  salary: 450_000,
  joined_season: "T8",
  team: { ...CLUBS.river, division_name: "Primera División Mayores" },
  value: 180_000_000,
  value_rank: 1,
  position_avg_value: 53_000_000,
  overall: 94,
  potential: 95,
  skill_moves: 3,
  weak_foot: 3,
  attacking_rate: "high",
  defensive_rate: "medium",
  attributes: [
    { key: "pace", value: 89, items: [{ key: "acceleration", value: 87 }, { key: "sprint_speed", value: 90 }] },
    {
      key: "shooting",
      value: 95,
      items: [
        { key: "positioning", value: 96 }, { key: "finishing", value: 96 }, { key: "shot_power", value: 94 },
        { key: "long_shots", value: 88 }, { key: "volleys", value: 90 }, { key: "penalties", value: 85 },
      ],
    },
    {
      key: "passing",
      value: 70,
      items: [
        { key: "vision", value: 72 }, { key: "crossing", value: 60 }, { key: "fk_accuracy", value: 65 },
        { key: "short_passing", value: 76 }, { key: "long_passing", value: 68 }, { key: "curve", value: 74 },
      ],
    },
    {
      key: "dribbling",
      value: 80,
      items: [
        { key: "agility", value: 78 }, { key: "balance", value: 74 }, { key: "reactions", value: 93 },
        { key: "ball_control", value: 84 }, { key: "dribbling", value: 79 }, { key: "composure", value: 88 },
      ],
    },
    {
      key: "defending",
      value: 45,
      items: [
        { key: "interceptions", value: 40 }, { key: "heading_accuracy", value: 85 }, { key: "def_awareness", value: 38 },
        { key: "standing_tackle", value: 42 }, { key: "sliding_tackle", value: 35 },
      ],
    },
    {
      key: "physical",
      value: 91,
      items: [
        { key: "jumping", value: 92 }, { key: "stamina", value: 88 }, { key: "strength", value: 94 }, { key: "aggression", value: 87 },
      ],
    },
  ],
};

const C = (
  competition: string,
  competition_kind: PlayerSeason["competitions"][number]["competition_kind"],
  stage: string,
  played: number, goals: number, assists: number, yellow_cards: number, red_cards: number
) => ({ competition, competition_kind, stage, played, goals, assists, yellow_cards, red_cards });

const S = (
  season: string, team: PlayerClubRef, division_name: string, rating: number,
  played: number, goals: number, assists: number, yellow_cards: number, red_cards: number, valueM: number,
  competitions: PlayerSeason["competitions"]
): PlayerSeason => ({
  season, team, division_name, rating, played, goals, assists, yellow_cards, red_cards,
  value: valueM * 1_000_000, competitions,
});

export const MOCK_PLAYER_SEASONS: PlayerSeason[] = [
  S("T8", CLUBS.river, "Primera", 94, 15, 24, 5, 2, 0, 180, [C("Liga Primera", "league", "1° (en curso)", 11, 18, 4, 2, 0), C("Copa Kempes", "cup", "Semifinal", 4, 6, 1, 0, 0)]),
  S("T7", CLUBS.city, "Primera", 93, 22, 31, 7, 3, 0, 165, [C("Liga Primera", "league", "Campeón", 18, 26, 6, 3, 0), C("Copa Kempes", "cup", "Cuartos", 4, 5, 1, 0, 0)]),
  S("T6", CLUBS.city, "Primera", 90, 20, 26, 6, 2, 0, 120, [C("Liga Primera", "league", "3°", 16, 20, 5, 2, 0), C("Copa Kempes", "cup", "Campeón", 4, 6, 1, 0, 0)]),
  S("T5", CLUBS.dortmund, "Primera", 88, 21, 22, 5, 4, 1, 90, [C("Liga Primera", "league", "2°", 17, 17, 4, 3, 1), C("Copa de Oro", "gold", "Campeón", 4, 5, 1, 1, 0)]),
  S("T4", CLUBS.dortmund, "Primera", 86, 19, 19, 4, 3, 0, 60, [C("Liga Primera", "league", "Campeón", 16, 16, 3, 3, 0), C("Copa Kempes", "cup", "Semifinal", 3, 3, 1, 0, 0)]),
  S("T3", CLUBS.dortmund, "Primera", 84, 18, 15, 3, 2, 0, 35, [C("Liga Primera", "league", "5°", 15, 12, 3, 2, 0), C("Copa de Plata", "silver", "Final", 3, 3, 0, 0, 0)]),
  S("T2", CLUBS.salzburg, "Segunda", 79, 17, 14, 3, 2, 0, 12, [C("Liga Segunda", "league", "Campeón", 14, 11, 2, 2, 0), C("Kempesita", "youth", "Fase de grupos", 3, 3, 1, 0, 0)]),
  S("T1", CLUBS.salzburg, "Segunda", 77, 16, 7, 1, 1, 0, 5, [C("Liga Segunda", "league", "3°", 13, 6, 1, 1, 0), C("Kempesita", "youth", "Octavos", 3, 1, 0, 0, 0)]),
];

export const MOCK_PLAYER_TRANSFERS: PlayerTransfer[] = [
  { id: "t1", season: "T8", date: "2026-01-14", from: CLUBS.city, to: CLUBS.river, kind: "purchase", fee: 180_000_000 },
  { id: "t2", season: "T6", date: "2024-07-02", from: CLUBS.dortmund, to: CLUBS.city, kind: "purchase", fee: 60_000_000 },
  { id: "t3", season: "T3", date: "2021-07-08", from: CLUBS.salzburg, to: CLUBS.dortmund, kind: "purchase", fee: 22_000_000 },
];

export const MOCK_PLAYER_VALUE_HISTORY: PlayerValuePoint[] = [
  { season: "T1", value: 5_000_000, team: CLUBS.salzburg },
  { season: "T2", value: 12_000_000, team: CLUBS.salzburg },
  { season: "T3", value: 35_000_000, team: CLUBS.dortmund },
  { season: "T4", value: 60_000_000, team: CLUBS.dortmund },
  { season: "T5", value: 90_000_000, team: CLUBS.dortmund },
  { season: "T6", value: 120_000_000, team: CLUBS.city },
  { season: "T7", value: 165_000_000, team: CLUBS.city },
  { season: "T8", value: 180_000_000, team: CLUBS.river },
];

export const MOCK_VALUE_RANKING: ValueRankRow[] = [
  { position: 1, player_id: "haaland", name: "E. Haaland", team_name: "River", value: 180_000_000, is_self: true },
  { position: 2, player_id: "mbappe", name: "K. Mbappé", team_name: "Boca", value: 175_000_000, is_self: false },
  { position: 3, player_id: "bellingham", name: "J. Bellingham", team_name: "Racing", value: 150_000_000, is_self: false },
  { position: 4, player_id: "vinicius", name: "Vinícius Jr.", team_name: "Boca", value: 140_000_000, is_self: false },
  { position: 5, player_id: "foden", name: "P. Foden", team_name: "River", value: 110_000_000, is_self: false },
];
