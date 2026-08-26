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

/**
 * Player profile page body. Blocks whose data the DB cannot provide yet
 * (attributes, transfers, value history) hide themselves when empty.
 */
export function PlayerProfile({ playerId }: { playerId: string }) {
  const t = useTranslations("playerProfile");

  const profile = usePlayerProfile(playerId);
  const seasons = usePlayerSeasons(playerId);
  const transfers = usePlayerTransfers(playerId);
  const values = usePlayerValueHistory(playerId);
  const ranking = useValueRanking(playerId);

  if (profile.isError || (profile.isSuccess && !profile.data)) {
    return (
      <EmptyState icon={UserRound} title={t("notFound")}>
        <Button variant="outline" nativeButton={false} render={<Link href="/players" />}>
          {t("backToPlayers")}
        </Button>
      </EmptyState>
    );
  }

  const showSeasons = seasons.isLoading || (seasons.data?.length ?? 0) > 0;
  const showTransfers = (transfers.data?.length ?? 0) > 0;
  const showChart = (values.data?.length ?? 0) > 0;

  return (
    <div className="flex flex-col gap-5">
      {profile.data ? (
        <PlayerHero player={profile.data} />
      ) : (
        <Skeleton className="h-72 rounded-2xl" />
      )}
      {profile.data && <PlayerAttributes player={profile.data} />}

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="flex min-w-0 flex-col gap-5">
          {showSeasons && (
            <PlayerSeasonsTable seasons={seasons.data} isLoading={seasons.isLoading} />
          )}
          {showTransfers && (
            <PlayerTransfers transfers={transfers.data} isLoading={transfers.isLoading} />
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-5">
          {showChart && (
            <PlayerValueChart points={values.data} isLoading={values.isLoading} />
          )}
          <PlayerValueRanking rows={ranking.data} isLoading={ranking.isLoading} />
        </div>
      </div>
    </div>
  );
}
