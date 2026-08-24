/**
 * MOCK DATA for the club-profile sections that have no DB functions yet:
 * history, records and finances. The rest of the page is wired to real RPCs
 * (see `services/team-profile.service.ts`). Delete each block here when its
 * backing function lands.
 */
import type { TeamFinances, TeamRecord, TeamSeasonEntry } from "../types";

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
