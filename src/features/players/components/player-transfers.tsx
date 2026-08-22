"use client";

import { useLocale, useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatMoney, formatShortDate } from "@/lib/format";

import type { PlayerTransfer } from "../types";

export function PlayerTransfers({
  transfers,
  isLoading,
}: {
  transfers: PlayerTransfer[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("playerProfile.transfers");
  const locale = useLocale();
  const total = transfers?.reduce((n, tr) => n + tr.fee, 0) ?? 0;

  return (
    <SectionCard
      flush
      title={t("title")}
      action={
        transfers && (
          <span className="text-xs text-muted-foreground">
            {t("total")}:{" "}
            <span className="font-bold text-primary">{formatMoney(total)}</span>
          </span>
        )
      }
    >
      {isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
      )}
      {transfers?.map((tr) => (
        <div
          key={tr.id}
          className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t px-4 py-3.5 first:border-t-0 hover:bg-muted/40 md:px-5"
        >
          <div className="w-16 shrink-0">
            <div className="text-xs font-bold">{tr.season}</div>
            <div className="text-[11px] text-muted-foreground">{formatShortDate(tr.date, locale)}</div>
          </div>
          <div className="flex min-w-0 flex-1 basis-56 items-center gap-2.5">
            <ClubAvatar name={tr.from.name} color={tr.from.color} size="sm" />
            <Link href={`/teams/${tr.from.id}`} className="truncate text-[13px] text-foreground/80 hover:underline">
              {tr.from.name}
            </Link>
            <span className="shrink-0 font-extrabold text-primary">→</span>
            <ClubAvatar name={tr.to.name} color={tr.to.color} size="sm" />
            <Link href={`/teams/${tr.to.id}`} className="truncate text-[13px] font-semibold hover:underline">
              {tr.to.name}
            </Link>
          </div>
          <Badge variant="secondary">{t(`kinds.${tr.kind}`)}</Badge>
          <span className="w-19 text-right text-[15px] font-extrabold text-primary">
            {formatMoney(tr.fee)}
          </span>
        </div>
      ))}
    </SectionCard>
  );
}
