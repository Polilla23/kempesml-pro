"use client";

import { useLocale, useTranslations } from "next-intl";

import { AutoCarousel } from "@/components/common/auto-carousel";
import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { clubColor } from "@/lib/football";
import { formatMoney, formatRelativeTime, initials } from "@/lib/format";

import { useLatestTransfers } from "../hooks/use-dashboard";

/**
 * TODO(db): MOCKED feed — swap to `get_latest_transfers` once the transfers
 * table exists (docs/db-pending-home.md §5); only the service changes.
 */
export function TransfersFeed() {
  const t = useTranslations("home.transfers");
  const tk = useTranslations("playerProfile.transfers.kinds");
  const locale = useLocale();
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
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted text-base font-black text-muted-foreground">
                {initials(tr.player_name)}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/players/${tr.player_id}`}
                  className="block truncate text-sm font-extrabold hover:underline"
                >
                  {tr.player_name}
                </Link>
                <div className="text-[10px] text-muted-foreground">
                  {tr.position} · {formatRelativeTime(tr.date, locale)}
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <ClubAvatar name={tr.from_team_name} color={clubColor(tr.from_team_id)} size="xs" />
                  <span className="text-xs font-black text-primary">→</span>
                  <ClubAvatar name={tr.to_team_name} color={clubColor(tr.to_team_id)} size="xs" />
                  <span className="truncate text-[10px] text-muted-foreground">{tr.to_team_name}</span>
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
