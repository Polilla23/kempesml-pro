/**
 * MOCK DATA for the club profile page.
 *
 * Everything in this file disappears once the DB exposes the profile RPCs —
 * see `services/team-profile.service.ts` for the function ↔ RPC mapping.
 * Shapes mirror what the RPCs must return (`../types.ts`).
 */
import type {
  BestXi,
  SquadPlayer,
  StandingsTable,
  TeamFinances,
  TeamFixture,
  TeamHighlights,
  TeamMatchResult,
  TeamProfileHeader,
  TeamRecord,
  TeamSeasonEntry,
} from "../types";

const RIVALS = {
  boca: { id: "boca-juniors", name: "Boca Juniors", color: "#1d3f8a" },
  racing: { id: "racing", name: "Racing", color: "#5aa0d8" },
  sanlo: { id: "san-lorenzo", name: "San Lorenzo", color: "#9a2a2a" },
  inde: { id: "independiente", name: "Independiente", color: "#c0262c" },
  velez: { id: "velez", name: "Vélez", color: "#3b4b8a" },
} as const;

export const MOCK_TEAM_HEADER: TeamProfileHeader = {
  id: "river-plate",
  name: "River Plate",
  color: "#d11b2e",
  manager_name: "xPedro_92",
  season_label: "T8",
  formation: "4-3-3",
  division_name: "Primera División Mayores",
  division_position: 1,
  squad_rating: 84,
  squad_value: 612_000_000,
  squad_size: 16,
  avg_age: 26.4,
  form: ["W", "W", "D", "W", "W"],
  record: { played: 18, won: 14, drawn: 3, lost: 1, points: 45 },
  trophies: [
    { competition: "Liga Primera División", short_name: "Liga 1ª", kind: "league", seasons: ["T4", "T7"] },
    { competition: "Liga Segunda División", short_name: "Liga 2ª", kind: "league", seasons: ["T2"] },
    { competition: "Copa Kempes", short_name: "C. Kempes", kind: "cup", seasons: ["T6"] },
    { competition: "Copa de Oro", short_name: "C. de Oro", kind: "gold", seasons: ["T5"] },
    { competition: "Copa de Plata", short_name: "C. de Plata", kind: "silver", seasons: ["T3"] },
  ],
};

export const MOCK_TEAM_FIXTURES: TeamFixture[] = [
  { id: "fx1", competition: "Liga", competition_kind: "league", kickoff_at: "2026-08-24T21:00:00", is_home: true, rival: { ...RIVALS.boca, manager_name: "eltano_dt" } },
  { id: "fx2", competition: "Copa Kempes", competition_kind: "cup", kickoff_at: "2026-08-27T22:00:00", is_home: false, rival: { ...RIVALS.racing, manager_name: "avestruz99" } },
  { id: "fx3", competition: "Liga", competition_kind: "league", kickoff_at: "2026-08-31T21:30:00", is_home: false, rival: { ...RIVALS.sanlo, manager_name: "cuervo_gonza" } },
  { id: "fx4", competition: "Liga", competition_kind: "league", kickoff_at: "2026-09-03T22:00:00", is_home: true, rival: { ...RIVALS.inde, manager_name: "rojo_leo" } },
  { id: "fx5", competition: "Liga", competition_kind: "league", kickoff_at: "2026-09-07T20:00:00", is_home: true, rival: { ...RIVALS.velez, manager_name: "fortinero_v" } },
];

export const MOCK_TEAM_RESULTS: TeamMatchResult[] = [
  { id: "r1", result: "W", is_home: true, rival_name: "Boca Juniors", competition: "Liga", played_at: "2026-08-15", goals_for: 3, goals_against: 1 },
  { id: "r2", result: "W", is_home: false, rival_name: "Racing", competition: "Liga", played_at: "2026-08-12", goals_for: 2, goals_against: 0 },
  { id: "r3", result: "D", is_home: true, rival_name: "Independiente", competition: "Copa Kempes", played_at: "2026-08-08", goals_for: 1, goals_against: 1 },
  { id: "r4", result: "W", is_home: false, rival_name: "San Lorenzo", competition: "Liga", played_at: "2026-08-05", goals_for: 4, goals_against: 2 },
  { id: "r5", result: "W", is_home: true, rival_name: "Vélez", competition: "Liga", played_at: "2026-08-02", goals_for: 2, goals_against: 1 },
];

export const MOCK_TEAM_BEST_XI: BestXi = {
  formation: "4-3-3",
  players: [
    { player_id: "ederson", short_name: "Ederson", rating: 88, slot: 0 },
    { player_id: "gvardiol", short_name: "Gvardiol", rating: 84, slot: 1 },
    { player_id: "dias", short_name: "Dias", rating: 87, slot: 2 },
    { player_id: "stones", short_name: "Stones", rating: 85, slot: 3 },
    { player_id: "walker", short_name: "Walker", rating: 84, slot: 4 },
    { player_id: "rodri", short_name: "Rodri", rating: 91, slot: 5 },
    { player_id: "de-bruyne", short_name: "De Bruyne", rating: 91, slot: 6 },
    { player_id: "b-silva", short_name: "B. Silva", rating: 88, slot: 7 },
    { player_id: "foden", short_name: "Foden", rating: 88, slot: 8 },
    { player_id: "haaland", short_name: "Haaland", rating: 94, slot: 9 },
    { player_id: "doku", short_name: "Doku", rating: 83, slot: 10 },
  ],
};

const row = (
  position: number,
  team_id: string,
  team_name: string,
  played: number,
  goal_diff: number,
  points: number,
  note: string | null,
  is_self = false
) => ({ position, team_id, team_name, played, goal_diff, points, note, is_self });

export const MOCK_TEAM_STANDINGS: StandingsTable[] = [
  {
    competition_id: "liga-1-t8",
    competition_name: "Liga Primera Mayores",
    rows: [
      row(1, "river-plate", "River Plate", 18, 30, 45, "Campeón", true),
      row(2, "boca-juniors", "Boca Juniors", 18, 18, 40, "Copa Oro"),
      row(3, "racing", "Racing", 18, 10, 34, null),
      row(4, "san-lorenzo", "San Lorenzo", 18, 2, 28, null),
      row(5, "independiente", "Independiente", 18, -6, 22, null),
      row(6, "velez", "Vélez", 18, -12, 17, "Descenso"),
    ],
  },
  {
    competition_id: "kempes-t8-b",
    competition_name: "Copa Kempes · Grupo B",
    rows: [
      row(1, "river-plate", "River Plate", 3, 5, 7, "Clasifica", true),
      row(2, "estudiantes", "Estudiantes", 3, 2, 6, "Clasifica"),
      row(3, "huracan", "Huracán", 3, -2, 3, null),
      row(4, "lanus", "Lanús", 3, -5, 1, null),
    ],
  },
  {
    competition_id: "kempesita-t8-a",
    competition_name: "Kempesita · Grupo A",
    rows: [
      row(1, "river-plate", "River Plate", 5, 11, 13, "Clasifica", true),
      row(2, "boca-juniors", "Boca Juniors", 5, 6, 10, "Clasifica"),
      row(3, "racing", "Racing", 5, -1, 7, null),
      row(4, "tigre", "Tigre", 5, -7, 3, null),
    ],
  },
];

const P = (
  player_id: string,
  name: string,
  nationality_flag: string,
  position: string,
  position_group: SquadPlayer["position_group"],
  rating: number,
  played: number,
  goals: number,
  assists: number,
  salaryK: number,
  valueM: number,
  transferable: boolean
): SquadPlayer => ({
  player_id, name, nationality_flag, position, position_group, rating, played, goals, assists,
  salary: salaryK * 1_000, value: valueM * 1_000_000, transferable,
});

export const MOCK_TEAM_SQUAD: SquadPlayer[] = [
  P("ederson", "Ederson", "🇧🇷", "POR", "GK", 88, 18, 0, 1, 200, 40, false),
  P("ortega", "Ortega", "🇦🇷", "POR", "GK", 82, 3, 0, 0, 100, 8, true),
  P("walker", "Kyle Walker", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "LD", "DEF", 84, 17, 1, 3, 180, 24, false),
  P("dias", "Rúben Dias", "🇵🇹", "DFC", "DEF", 87, 18, 2, 0, 240, 60, false),
  P("stones", "John Stones", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "DFC", "DEF", 85, 16, 1, 1, 200, 38, false),
  P("gvardiol", "Josko Gvardiol", "🇭🇷", "LI", "DEF", 84, 18, 3, 2, 160, 36, false),
  P("akanji", "Akanji", "🇨🇭", "DFC", "DEF", 84, 8, 0, 0, 140, 28, true),
  P("rodri", "Rodri", "🇪🇸", "MCD", "MID", 91, 18, 5, 8, 340, 95, false),
  P("de-bruyne", "Kevin De Bruyne", "🇧🇪", "MC", "MID", 91, 17, 7, 14, 380, 70, false),
  P("b-silva", "Bernardo Silva", "🇵🇹", "MC", "MID", 88, 18, 4, 6, 280, 55, false),
  P("kovacic", "Kovacic", "🇭🇷", "MC", "MID", 84, 12, 2, 3, 180, 28, true),
  P("foden", "Phil Foden", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "EI", "FWD", 88, 18, 9, 5, 290, 110, false),
  P("haaland", "Erling Haaland", "🇳🇴", "DC", "FWD", 94, 15, 24, 5, 450, 180, false),
  P("doku", "Jeremy Doku", "🇧🇪", "ED", "FWD", 83, 15, 3, 7, 150, 45, false),
  P("grealish", "Grealish", "🏴󠁧󠁢󠁥󠁮󠁧󠁿", "EI", "FWD", 84, 10, 2, 2, 220, 30, true),
  P("j-alvarez", "Julián Álvarez", "🇦🇷", "DC", "FWD", 85, 14, 6, 3, 220, 65, true),
];

export const MOCK_TEAM_HIGHLIGHTS: TeamHighlights = {
  top_scorer: { player_id: "haaland", name: "Erling Haaland", position: "DC", rating: 94, played: 15, goals: 24 },
  mvp: { player_id: "de-bruyne", name: "Kevin De Bruyne", position: "MC", rating: 91, goals: 7, assists: 14, mvp_awards: 6 },
};

const H = (
  season: string,
  competition_kind: TeamSeasonEntry["competition_kind"],
  competition: string,
  position_label: string,
  played: number, won: number, drawn: number, lost: number,
  goals_for: number, goals_against: number,
  achievement: string,
  achievement_kind: TeamSeasonEntry["achievement_kind"]
): TeamSeasonEntry => ({
  season, competition, competition_kind, position_label, played, won, drawn, lost,
  goals_for, goals_against, achievement, achievement_kind,
});

export const MOCK_TEAM_HISTORY: TeamSeasonEntry[] = [
  H("T8", "league", "Liga Primera Mayores", "1°", 18, 14, 3, 1, 42, 12, "🏆 Campeón (en curso)", "gold"),
  H("T8", "cup", "Copa Kempes", "Semifinal", 4, 3, 0, 1, 9, 4, "En juego", "ok"),
  H("T8", "youth", "Kempesita", "Campeón", 5, 5, 0, 0, 14, 3, "🏅 Título juvenil", "gold"),
  H("T7", "league", "Liga Primera Mayores", "1°", 22, 17, 3, 2, 51, 18, "🏆 Campeón de Liga", "gold"),
  H("T7", "cup", "Copa Kempes", "Cuartos", 3, 1, 1, 1, 5, 5, "Eliminado", "none"),
  H("T7", "youth", "Kempesita", "Octavos", 1, 0, 0, 1, 1, 2, "Eliminado", "none"),
  H("T6", "league", "Liga Primera Mayores", "3°", 22, 12, 6, 4, 40, 26, "Clasificó a Copa Kempes", "ok"),
  H("T6", "cup", "Copa Kempes", "Campeón", 6, 5, 1, 0, 15, 6, "🏆 Copa Kempes", "gold"),
  H("T6", "youth", "Kempesita", "Final", 6, 4, 1, 1, 12, 6, "🥈 Subcampeón", "ok"),
  H("T5", "league", "Liga Primera Mayores", "2°", 22, 14, 4, 4, 44, 22, "Subcampeón de Liga", "ok"),
  H("T5", "gold", "Copa de Oro", "Campeón", 5, 4, 1, 0, 11, 3, "🥇 Copa de Oro", "gold"),
  H("T5", "youth", "Kempesita", "Cuartos", 3, 2, 0, 1, 6, 4, "Eliminado", "none"),
  H("T4", "league", "Liga Primera Mayores", "1°", 22, 16, 4, 2, 48, 19, "🏆 Campeón de Liga", "gold"),
  H("T4", "cup", "Copa Kempes", "Semifinal", 4, 2, 1, 1, 7, 6, "Eliminado", "none"),
  H("T3", "league", "Liga Primera Mayores", "5°", 22, 9, 6, 7, 31, 29, "—", "none"),
  H("T3", "silver", "Copa de Plata", "Final", 6, 4, 1, 1, 10, 7, "🥈 Subcampeón Copa de Plata", "ok"),
  H("T2", "league", "Liga Segunda Mayores", "1°", 20, 15, 3, 2, 45, 15, "🏆 Campeón · Ascenso", "gold"),
  H("T2", "youth", "Kempesita", "Fase de grupos", 3, 1, 1, 1, 4, 4, "Eliminado", "none"),
  H("T1", "league", "Liga Segunda Mayores", "3°", 20, 11, 5, 4, 34, 21, "—", "none"),
  H("T1", "youth", "Kempesita", "Octavos", 1, 0, 0, 1, 0, 1, "Eliminado", "none"),
];

export const MOCK_TEAM_RECORDS: TeamRecord[] = [
  { key: "top_scorer", label: "Máximo goleador histórico", value: "Haaland · 46 goles", detail: "Desde T6 · 24 en T8", tone: "green" },
  { key: "top_signing", label: "Fichaje más caro", value: "€180M · Haaland", detail: "Desde Manchester City · T8", tone: "blue" },
  { key: "top_sale", label: "Venta más cara", value: "€95M · Julián Álvarez", detail: "A Real Madrid · T6", tone: "blue" },
  { key: "best_season", label: "Mejor temporada", value: "T7 · 54 pts", detail: "17G 3E 2P · Campeón invicto de local", tone: "gold" },
];

export const MOCK_TEAM_FINANCES: TeamFinances = {
  season_label: "T8",
  income: 245_000_000,
  expenses: 198_000_000,
  balance: 47_000_000,
  budget: 82_000_000,
  movements: [
    { id: "m1", kind: "out", concept: "Compra: Erling Haaland", detail: "Transferencia desde Manchester City", date: "2026-01-14", amount: 180_000_000 },
    { id: "m2", kind: "in", concept: "Venta: Cole Palmer", detail: "Transferencia a Chelsea", date: "2025-12-28", amount: 48_000_000 },
    { id: "m3", kind: "in", concept: "Cesión: Julián Álvarez", detail: "Préstamo con cargo a Atlético", date: "2025-12-20", amount: 5_000_000 },
    { id: "m4", kind: "in", concept: "Premios de liga", detail: "Campeón T7 + posición T8", date: "2025-12-10", amount: 35_000_000 },
    { id: "m5", kind: "in", concept: "Derechos de TV", detail: "Reparto Primera División", date: "2025-12-01", amount: 25_000_000 },
    { id: "m6", kind: "out", concept: "Salarios del plantel", detail: "Acumulado Temporada 8", date: null, amount: 18_000_000 },
    { id: "m7", kind: "in", concept: "Taquilla y estadio", detail: "9 partidos de local", date: null, amount: 12_000_000 },
  ],
};
