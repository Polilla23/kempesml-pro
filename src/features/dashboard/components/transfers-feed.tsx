"use client";

import { useTranslations } from "next-intl";

import { AutoCarousel } from "@/components/common/auto-carousel";
import { ClubAvatar } from "@/components/common/club-avatar";
import { PlayerAvatar } from "@/components/common/player-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { clubColor } from "@/lib/football";
import { formatMoney } from "@/lib/format";

import { useLatestTransfers } from "../hooks/use-dashboard";

/** Market feed (real, get_latest_transfers) with crests from the RPC. */
export function TransfersFeed() {
  const t = useTranslations("home.transfers");
  const tk = useTranslations("playerProfile.transfers.kinds");
  const transfers = useLatestTransfers();

  return (
    <SectionCard
      title={t("title")}
      action={
        // TODO: point to the market page when it exists (/transfers is ComingSoon).
        <Link href="/transfers" className="text-xs font-bold text-primary hover:underline">
          {t("goToMarket")} ›
        </Link>
      }
    >
      {transfers.isLoading && (
        <div className="flex gap-3 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-22 w-72 shrink-0 rounded-xl" />
          ))}
        </div>
      )}
      {transfers.data && (
        <AutoCarousel speed={0.45}>
          {transfers.data.map((tr) => (
            <article
              key={tr.id}
              className="flex w-72 shrink-0 items-center gap-3 rounded-xl border bg-background/40 p-3.5"
            >
              <PlayerAvatar name={tr.player_name} src={tr.photo_url} />
              <div className="min-w-0 flex-1">
                <Link
                  href={`/players/${tr.player_id}`}
                  className="block truncate text-sm font-extrabold hover:underline"
                >
                  {tr.player_name}
                </Link>
                <div className="mt-2 flex items-center gap-2.5">
                  <ClubAvatar
                    name={tr.from_team_name}
                    color={clubColor(tr.from_team_id)}
                    src={tr.from_team_logo}
                    size="lg"
                  />
                  <span className="text-base font-black text-primary">→</span>
                  <ClubAvatar
                    name={tr.to_team_name}
                    color={clubColor(tr.to_team_id)}
                    src={tr.to_team_logo}
                    size="lg"
                  />
                </div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-base font-black text-primary">
                  {tr.fee != null ? formatMoney(tr.fee) : "—"}
                </div>
                <div className="text-[9px] font-bold text-muted-foreground uppercase">
                  {tk(tr.kind)}
                </div>
              </div>
            </article>
          ))}
        </AutoCarousel>
      )}
    </SectionCard>
  );
}
