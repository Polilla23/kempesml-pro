"use client";

import { HomeHero } from "./home-hero";
import { LeagueTablesCard } from "./league-tables-card";
import { MyMatchesCard } from "./my-matches-card";

/**
 * Home page body (Claude Design "Home"). Blocks whose data the DB cannot
 * provide yet are not mounted — each TODO(db) names the endpoint that
 * unblocks it (spec: docs/db-pending-home.md).
 */
export function DashboardHome() {
  return (
    <div className="flex flex-col gap-5">
      <HomeHero />

      {/* TODO(db): carrusel "Últimos resultados cargados" (global, todas las
          divisiones) — get_latest_results (docs/db-pending-home.md §3). */}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
        <LeagueTablesCard />
        <MyMatchesCard />
      </div>

      {/* TODO(db): carrusel "Últimas transferencias" — get_latest_transfers,
          depende de la tabla transfers (docs/db-pending-home.md §5). */}

      {/* TODO(db): grilla "Noticias" — tabla news + get_news
          (docs/db-pending-home.md §6). */}
    </div>
  );
}
