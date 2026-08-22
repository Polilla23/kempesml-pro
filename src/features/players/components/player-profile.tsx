"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";

import {
  usePlayerProfile,
  usePlayerSeasons,
  usePlayerTransfers,
  usePlayerValueHistory,
  useValueRanking,
} from "../hooks/use-player-profile";
import { PlayerAttributes } from "./player-attributes";
import { PlayerHero } from "./player-hero";
import { PlayerSeasonsTable } from "./player-seasons-table";
import { PlayerTransfers } from "./player-transfers";
import { PlayerValueChart } from "./player-value-chart";
import { PlayerValueRanking } from "./player-value-ranking";

/** Player profile page body; each block fetches through its own hook. */
export function PlayerProfile({ playerId }: { playerId: string }) {
  const t = useTranslations("playerProfile");

  const profile = usePlayerProfile(playerId);
  const seasons = usePlayerSeasons(playerId);
  const transfers = usePlayerTransfers(playerId);
  const values = usePlayerValueHistory(playerId);
  // TODO(db): the ranking scope should be the league competition id; until the
  // header returns one, the team's division name is used as the scope key.
  const ranking = useValueRanking(profile.data?.team.division_name ?? "", playerId);

  if (profile.isError || (profile.isSuccess && !profile.data)) {
    return (
      <EmptyState icon={UserRound} title={t("notFound")}>
        <Button variant="outline" nativeButton={false} render={<Link href="/players" />}>
          {t("backToPlayers")}
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {profile.data ? <PlayerHero player={profile.data} /> : <Skeleton className="h-72 rounded-2xl" />}
      {profile.data ? <PlayerAttributes player={profile.data} /> : <Skeleton className="h-80 rounded-xl" />}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          <PlayerSeasonsTable seasons={seasons.data} isLoading={seasons.isLoading} />
          <PlayerTransfers transfers={transfers.data} isLoading={transfers.isLoading} />
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          <PlayerValueChart points={values.data} isLoading={values.isLoading} />
          <PlayerValueRanking rows={ranking.data} isLoading={ranking.isLoading} />
        </div>
      </div>
    </div>
  );
}
