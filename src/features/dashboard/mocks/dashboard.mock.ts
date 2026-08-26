/**
 * MOCK DATA for the home blocks that have no DB endpoints yet. Each constant
 * dies when its function lands — the mapping lives as TODO(db) comments in
 * `../services/dashboard.service.ts`, spec in docs/db-pending-home.md.
 * Club/player names are real ones from the league so the page feels honest.
 */
import type { TeamFixture } from "@/features/teams";
import { clubColor } from "@/lib/football";

import type {
  LatestResult,
  NewsItem,
  PlazoInfo,
  SeasonChampion,
  SeasonSummary,
  TransferFeedItem,
} from "../types";

export const MOCK_SEASON_SUMMARY: SeasonSummary = {
  season_id: "T31",
  matches_played: 847,
  matches_total: 1050,
  transfers_count: 234,
  transfers_amount: 1_200_000_000,
};

export const MOCK_CHAMPIONS: SeasonChampion[] = [
  { tournament_id: "T30-LMY-A", tournament_name: "Liga Mayores", kind: "league", team_id: "CMG-FC", team_name: "CMG FC" },
  { tournament_id: "T30-COR", tournament_name: "Copa de Oro", kind: "gold", team_id: "PAMPA-FC", team_name: "Pampa FC" },
  { tournament_id: "T30-LKE-A", tournament_name: "Liga Kempesitas", kind: "youth", team_id: "REINCIDENTES-FC", team_name: "Reincidentes FC" },
  { tournament_id: "T30-SCO", tournament_name: "Super Copa", kind: "cup", team_id: "A-LA-TIBIA", team_name: "A la Tibia" },
];

const LR = (
  id: string,
  competition: string,
  kind: LatestResult["competition_kind"],
  division: string | null,
  plazo: string,
  home_team_id: string,
  home_team_name: string,
  home_score: number,
  away_team_id: string,
  away_team_name: string,
  away_score: number,
  hoursAgo: number
): LatestResult => ({
  id, competition, competition_kind: kind, division, plazo,
  home_team_id, home_team_name, home_score, away_team_id, away_team_name, away_score,
  loaded_at: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
});

export const MOCK_LATEST_RESULTS: LatestResult[] = [
  LR("m1", "Liga Mayores", "league", "A", "12", "CMG-FC", "CMG FC", 3, "PAMPA-FC", "Pampa FC", 1, 2),
  LR("m2", "Liga Mayores", "league", "B", "12", "REINCIDENTES-FC", "Reincidentes FC", 2, "ROMANCE-ETERNO", "Romance Eterno", 2, 5),
  LR("m3", "Copa de Plata", "silver", null, "3", "TERCERA-POSICION", "Tercera Posición", 4, "DAVE-HOLLAND", "Dave Holland", 3, 8),
  LR("m4", "Liga Kempesitas", "youth", "B", "12", "TIKI-TIKI", "Tiki Tiki", 1, "CMG-FC", "CMG FC", 0, 12),
  LR("m5", "Liga Mayores", "league", "C", "12", "MACALIN-SAD", "Macalin SAD", 2, "SIETELIBERTADORES", "Siete Libertadores", 1, 18),
  LR("m6", "Copa Cindor", "cup", null, "2", "ESTUPIDO-FLANDERS", "Estúpido Flanders", 0, "A-LA-TIBIA", "A la Tibia", 2, 26),
  LR("m7", "Liga Mayores", "league", "A", "11", "PAMPA-FC", "Pampa FC", 5, "TIKI-TIKI", "Tiki Tiki", 2, 30),
  LR("m8", "Liga Kempesitas", "youth", "A", "12", "ROMANCE-ETERNO", "Romance Eterno", 3, "MACALIN-SAD", "Macalin SAD", 3, 40),
];

export const MOCK_PLAZO: PlazoInfo = {
  plazo: "7",
  label: "Fechas 13–14",
  deadline: new Date(Date.now() + (2 * 24 + 14) * 3_600_000).toISOString(),
  loaded: 2,
  total: 6,
};

const MF = (
  id: string,
  competition: string,
  kind: TeamFixture["competition_kind"],
  plazo: string,
  is_home: boolean,
  rivalId: string,
  rivalName: string,
  manager: string
): TeamFixture => ({
  id, competition, competition_kind: kind, kickoff_at: null, plazo, is_home,
  rival: { id: rivalId, name: rivalName, color: clubColor(rivalId), manager_name: manager },
});

/** Shown while the user's team has no real pending matches. */
export const MOCK_MY_FIXTURES: TeamFixture[] = [
  MF("mf1", "Liga Mayores · Fecha 13", "league", "7", true, "CMG-FC", "CMG FC", "Cote"),
  MF("mf2", "Copa Cindor · Grupo B", "cup", "7", false, "PAMPA-FC", "Pampa FC", "Pampa"),
  MF("mf3", "Liga Kempesitas · Fecha 13", "youth", "7", true, "TIKI-TIKI", "Tiki Tiki", "Matias"),
  MF("mf4", "Liga Kempesitas · Fecha 14", "youth", "7", false, "ROMANCE-ETERNO", "Romance Eterno", "Roman"),
];

const TR = (
  id: string,
  player_name: string,
  position: string,
  kind: TransferFeedItem["kind"],
  feeM: number | null,
  daysAgo: number,
  from_team_id: string,
  from_team_name: string,
  to_team_id: string,
  to_team_name: string
): TransferFeedItem => ({
  id, player_id: id, player_name, position, kind,
  fee: feeM == null ? null : feeM * 1_000_000,
  date: new Date(Date.now() - daysAgo * 86_400_000).toISOString(),
  from_team_id, from_team_name, to_team_id, to_team_name,
});

export const MOCK_TRANSFERS_FEED: TransferFeedItem[] = [
  TR("t1", "Erling Haaland", "DC", "purchase", 180, 0.2, "CMG-FC", "CMG FC", "REINCIDENTES-FC", "Reincidentes FC"),
  TR("t2", "Cole Palmer", "MCO", "purchase", 48, 1, "REINCIDENTES-FC", "Reincidentes FC", "PAMPA-FC", "Pampa FC"),
  TR("t3", "Julián Álvarez", "DC", "loan", 5, 2, "REINCIDENTES-FC", "Reincidentes FC", "A-LA-TIBIA", "A la Tibia"),
  TR("t4", "Josko Gvardiol", "DFC", "purchase", 75, 3, "TIKI-TIKI", "Tiki Tiki", "CMG-FC", "CMG FC"),
  TR("t5", "Jeremy Doku", "ED", "purchase", 45, 4, "PAMPA-FC", "Pampa FC", "ROMANCE-ETERNO", "Romance Eterno"),
  TR("t6", "Enzo Fernández", "MC", "purchase", 90, 5, "MACALIN-SAD", "Macalin SAD", "PAMPA-FC", "Pampa FC"),
  TR("t7", "Nico Paz", "MCO", "purchase", 38, 6, "DAVE-HOLLAND", "Dave Holland", "REINCIDENTES-FC", "Reincidentes FC"),
  TR("t8", "Thiago Almada", "MCO", "purchase", 42, 6, "TERCERA-POSICION", "Tercera Posición", "MACALIN-SAD", "Macalin SAD"),
  TR("t9", "Claudio Echeverri", "MCO", "purchase", 35, 7, "ROMANCE-ETERNO", "Romance Eterno", "CMG-FC", "CMG FC"),
  TR("t10", "Facundo Buonanotte", "MC", "loan", null, 8, "A-LA-TIBIA", "A la Tibia", "TIKI-TIKI", "Tiki Tiki"),
  TR("t11", "Valentín Barco", "LI", "purchase", 18, 9, "PAMPA-FC", "Pampa FC", "DAVE-HOLLAND", "Dave Holland"),
  TR("t12", "Aaron Anselmino", "DFC", "purchase", 22, 12, "SIETELIBERTADORES", "Siete Libertadores", "ESTUPIDO-FLANDERS", "Estúpido Flanders"),
];

const N = (
  id: string,
  title: string,
  tag: string,
  tone: NewsItem["tone"],
  hoursAgo: number
): NewsItem => ({
  id, title, tag, tone,
  created_at: new Date(Date.now() - hoursAgo * 3_600_000).toISOString(),
});

export const MOCK_NEWS: NewsItem[] = [
  N("n1", "BOMBAZO: Haaland llega a Reincidentes FC por €180M, récord de la KML", "Transferencia", "green", 5),
  N("n2", "Copa Cindor T31: el sorteo de grupos se hace este viernes", "Anuncio", "blue", 2),
  N("n3", "Pampa FC golea 5–2 a Tiki Tiki con hat-trick de Cristiano", "Resultado", "sky", 24),
  N("n4", "Recordatorio: el Plazo 7 vence el domingo a las 23:59", "Recordatorio", "amber", 26),
  N("n5", "Super Copa: A la Tibia campeón tras vencer a CMG en penales", "Título", "gold", 72),
];
