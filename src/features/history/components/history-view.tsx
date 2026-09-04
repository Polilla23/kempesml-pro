"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { PillTabsList } from "@/components/common/pill-tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import { usePalmares } from "../hooks/use-history";
import { PalmaresView } from "./palmares-view";

type Tab = "palmares" | "champions" | "records";
const TABS: Tab[] = ["palmares", "champions", "records"];

/** "Historia" page: all-time palmarés + placeholders for the next two tabs. */
export function HistoryView() {
  const t = useTranslations("history");
  const [tab, setTab] = useState<Tab>("palmares");
  // Shares the palmarés query (same key) — only feeds the subtitle counters.
  const palmares = usePalmares();

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
        {palmares.data ? (
          <p className="mt-1 text-[13px] text-muted-foreground">
            {t("subtitle", {
              seasons: palmares.data.seasons_count,
              competitions: palmares.data.competitions_count,
            })}
          </p>
        ) : (
          <Skeleton className="mt-1.5 h-4 w-72" />
        )}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)} className="gap-5">
        <PillTabsList
          items={TABS.map((id) => ({ value: id, label: t(`tabs.${id}`) }))}
        />

        <TabsContent value="palmares">
          <PalmaresView />
        </TabsContent>
        {/* TODO: "Campeones por temporada" — get_season_champions already
            covers it (a season picker + grid); design pending. */}
        <TabsContent value="champions">
          <div className="rounded-xl bg-card p-6 text-[13px] text-muted-foreground ring-1 ring-foreground/10">
            {t("soon.champions")}
          </div>
        </TabsContent>
        {/* TODO(db): "Récords" needs get_team_records-style global records. */}
        <TabsContent value="records">
          <div className="rounded-xl bg-card p-6 text-[13px] text-muted-foreground ring-1 ring-foreground/10">
            {t("soon.records")}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
