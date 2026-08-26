"use client";

import { HomeHero } from "./home-hero";
import { LatestResultsCarousel } from "./latest-results-carousel";
import { LeagueTablesCard } from "./league-tables-card";
import { MyMatchesCard } from "./my-matches-card";
import { NewsGrid } from "./news-grid";
import { TransfersFeed } from "./transfers-feed";

/**
 * Home page body (Claude Design "Home").
 *
 * Real data: season line, league tables carousel, "Tus partidos".
 * MOCKED until their DB endpoints land (each service method carries the
 * TODO(db); spec in docs/db-pending-home.md): hero KPIs + champions + plazo,
 * latest results feed, transfers feed and news grid.
 */
export function DashboardHome() {
  return (
    <div className="flex flex-col gap-5">
      <HomeHero />
      <LatestResultsCarousel />
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2.4fr)_minmax(0,1fr)]">
        <LeagueTablesCard />
        <MyMatchesCard />
      </div>
      <TransfersFeed />
      <NewsGrid />
    </div>
  );
}
