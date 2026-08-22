"use client";

import { useLocale, useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { TeamFinances } from "../../types";

function Kpi({
  label,
  value,
  className,
  valueClass,
}: {
  label: string;
  value: string;
  className?: string;
  valueClass?: string;
}) {
  return (
    <div className={cn("rounded-xl p-4 ring-1 ring-foreground/10", className)}>
      <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{label}</div>
      <div className={cn("mt-1 text-2xl font-black", valueClass)}>{value}</div>
    </div>
  );
}

export function FinancesTab({
  finances,
  isLoading,
}: {
  finances: TeamFinances | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.finances");
  const locale = useLocale();

  if (isLoading || !finances) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-22 rounded-xl" />)}
      </div>
    );
  }

  const season = finances.season_label;

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label={t("income", { season })}
          value={formatMoney(finances.income)}
          className="bg-emerald-500/10 ring-emerald-500/30"
          valueClass="text-emerald-600 dark:text-emerald-400"
        />
        <Kpi
          label={t("expenses", { season })}
          value={formatMoney(finances.expenses)}
          className="bg-red-500/10 ring-red-500/30"
          valueClass="text-red-600 dark:text-red-400"
        />
        <Kpi
          label={t("balance")}
          value={formatMoney(finances.balance, { signed: true })}
          className="bg-primary/10 ring-primary/30"
          valueClass="text-primary"
        />
        <Kpi label={t("budget")} value={formatMoney(finances.budget)} className="bg-card" />
      </div>

      <SectionCard flush title={t("movements", { season })}>
        {finances.movements.map((m) => {
          const isIn = m.kind === "in";
          return (
            <div
              key={m.id}
              className="flex items-center gap-3 border-t px-4 py-3 text-[13px] first:border-t-0 hover:bg-muted/40 md:px-5"
            >
              <span
                className={cn(
                  "inline-flex size-6.5 shrink-0 items-center justify-center rounded-lg text-sm font-black",
                  isIn
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/15 text-red-600 dark:text-red-400"
                )}
              >
                {isIn ? "+" : "−"}
              </span>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{m.concept}</div>
                <div className="truncate text-[11px] text-muted-foreground">{m.detail}</div>
              </div>
              <span className="hidden text-xs text-muted-foreground sm:block">
                {m.date ? formatShortDate(m.date, locale) : t("accumulated")}
              </span>
              <span
                className={cn(
                  "w-20 text-right font-extrabold",
                  isIn ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                )}
              >
                {formatMoney(m.amount)}
              </span>
            </div>
          );
        })}
      </SectionCard>
    </div>
  );
}
