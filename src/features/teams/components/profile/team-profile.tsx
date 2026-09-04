"use client";

import { useState } from "react";
import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { PillTabsList } from "@/components/common/pill-tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";
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
        <PillTabsList
          items={TABS.map((id) => ({ value: id, label: t(`tabs.${id}`) }))}
        />

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
