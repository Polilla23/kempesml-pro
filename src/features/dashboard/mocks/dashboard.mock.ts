/**
 * MOCK DATA for the home blocks that have no DB endpoints yet. Each constant
 * dies when its function lands — the mapping lives as TODO(db) comments in
 * `../services/dashboard.service.ts`, spec in docs/db-pending-home.md.
 * Club/player names are real ones from the league so the page feels honest.
 */
import type { TeamFixture } from "@/features/teams";
import { clubColor } from "@/lib/football";

import type { NewsItem, PlazoInfo } from "../types";

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
