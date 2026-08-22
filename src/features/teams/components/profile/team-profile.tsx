"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "@/i18n/navigation";

import {
  useTeamBestXi,
  useTeamFinances,
  useTeamFixtures,
  useTeamHighlights,
  useTeamHistory,
  useTeamProfileHeader,
  useTeamRecords,
  useTeamResults,
  useTeamSquad,
  useTeamStandings,
} from "../../hooks/use-team-profile";
import { BestXiPitch } from "./best-xi-pitch";
import { FinancesTab } from "./finances-tab";
import { FixturesCarousel } from "./fixtures-carousel";
import { HighlightsCards } from "./highlights-cards";
import { HistoryTab } from "./history-tab";
import { ResultsCard } from "./results-card";
import { SquadTable } from "./squad-table";
import { StandingsCard } from "./standings-card";
import { TeamHero } from "./team-hero";

type Tab = "summary" | "squad" | "history" | "finances";
const TABS: Tab[] = ["summary", "squad", "history", "finances"];

/**
 * Club profile page body. Each block fetches its own data through the
 * `useTeam*` hooks; secondary tabs only fetch once opened.
 */
export function TeamProfile({ teamId }: { teamId: string }) {
  const t = useTranslations("teamProfile");
  const [tab, setTab] = useState<Tab>("summary");

  const header = useTeamProfileHeader(teamId);

  const isSummary = tab === "summary";
  const fixtures = useTeamFixtures(teamId, isSummary);
  const results = useTeamResults(teamId, isSummary);
  const bestXi = useTeamBestXi(teamId, isSummary);
  const standings = useTeamStandings(teamId, isSummary);
  const highlights = useTeamHighlights(teamId, isSummary);
  // Squad is used by the summary (transferables) and the squad tab.
  const squad = useTeamSquad(teamId, isSummary || tab === "squad");
  const history = useTeamHistory(teamId, tab === "history");
  const records = useTeamRecords(teamId, tab === "history");
  const finances = useTeamFinances(teamId, undefined, tab === "finances");

  if (header.isError || (header.isSuccess && !header.data)) {
    return (
      <EmptyState icon={Shield} title={t("notFound")}>
        <Button variant="outline" nativeButton={false} render={<Link href="/teams" />}>
          {t("backToTeams")}
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {header.data ? <TeamHero team={header.data} /> : <Skeleton className="h-64 rounded-2xl" />}

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="gap-5">
        {/* Pill tabs (Claude Design): active = primary, inactive = card + border. */}
        <TabsList className="h-auto w-full flex-wrap gap-1.5 bg-transparent p-0 sm:w-fit">
          {TABS.map((id) => (
            <TabsTrigger
              key={id}
              value={id}
              className="h-auto flex-none rounded-full border-border bg-card px-4.5 py-2 text-[13px] font-bold text-muted-foreground shadow-none transition-colors after:hidden hover:bg-muted hover:text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none dark:text-muted-foreground dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground"
            >
              {t(`tabs.${id}`)}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="summary" className="flex flex-col gap-5">
          <FixturesCarousel fixtures={fixtures.data} isLoading={fixtures.isLoading} />
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
            <BestXiPitch bestXi={bestXi.data} isLoading={bestXi.isLoading} />
            <div className="flex flex-col gap-5">
              <StandingsCard tables={standings.data} isLoading={standings.isLoading} />
              <ResultsCard results={results.data} isLoading={results.isLoading} />
            </div>
          </div>
          <HighlightsCards
            highlights={highlights.data}
            squad={squad.data}
            isLoading={highlights.isLoading || squad.isLoading}
          />
        </TabsContent>

        <TabsContent value="squad">
          <SquadTable squad={squad.data} isLoading={squad.isLoading} />
        </TabsContent>

        <TabsContent value="history">
          <HistoryTab
            history={history.data}
            records={records.data}
            isLoading={history.isLoading || records.isLoading}
          />
        </TabsContent>

        <TabsContent value="finances">
          <FinancesTab finances={finances.data} isLoading={finances.isLoading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
