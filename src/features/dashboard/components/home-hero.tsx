"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";
import { TeamAvatar } from "@/features/teams";
import { Link } from "@/i18n/navigation";
import { competitionIcon } from "@/lib/football";
import { formatMoney, formatTimeLeft } from "@/lib/format";

import {
  useChampions,
  useCurrentPlazo,
  useSeasonInfo,
  useSeasonSummary,
} from "../hooks/use-dashboard";

function Kpi({
  label,
  value,
  detail,
}: {
  label: string;
  value: React.ReactNode;
  detail: string;
}) {
  return (
    <div className="flex flex-col items-center justify-between rounded-xl border bg-card/90 px-3 py-2.5 text-center lg:min-w-36">
      <div className="text-[11px] whitespace-nowrap text-muted-foreground">{label}</div>
      <div className="text-xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{detail}</div>
    </div>
  );
}

export function HomeHero() {
  const t = useTranslations("home");
  const season = useSeasonInfo();
  const summary = useSeasonSummary();
  const champions = useChampions();
  // TODO(db): plazo is still MOCKED — get_current_plazo
  // (docs/db-pending-home.md §4).
  const plazo = useCurrentPlazo();

  const timeLeft = plazo.data ? formatTimeLeft(plazo.data.deadline) : null;

  return (
    <section className="rounded-2xl bg-linear-to-br from-primary/30 via-primary/10 to-card p-5 ring-1 ring-foreground/10 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-5">
        <div>
          <div className="mb-2.5 flex items-center gap-2 text-[13px] text-foreground/75">
            <span className="size-2 shrink-0 rounded-full bg-emerald-500" />
            {season.isLoading ? (
              <Skeleton className="h-4 w-64" />
            ) : (
              <span>
                {season.data ? t("seasonActive", { season: season.data.name }) : "—"}
                {plazo.data && timeLeft && (
                  <>
                    {" · "}
                    {t("plazoLine", {
                      plazo: plazo.data.plazo,
                      label: plazo.data.label,
                      time: timeLeft,
                    })}
                  </>
                )}
              </span>
            )}
          </div>
          <h1 className="text-3xl leading-[1.02] font-black tracking-tight md:text-4xl">
            KEMPES
            <br />
            <span className="text-primary">MASTER LEAGUE</span>
          </h1>
        </div>

        {/* One strip: KPIs first, reigning champions to their right. */}
        <div className="grid min-w-0 grid-cols-2 gap-2.5 sm:grid-cols-3 lg:flex lg:flex-wrap lg:items-stretch">
          {(summary.isLoading || champions.isLoading) &&
            Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl lg:w-32" />
            ))}
          {summary.data && season.data && (
            <>
              <Kpi
                label={`📅 ${t("kpis.matches")}`}
                value={
                  <>
                    {summary.data.matches_played}
                    <span className="text-xs font-semibold text-muted-foreground">
                      {" "}/{summary.data.matches_total}
                    </span>
                  </>
                }
                detail={season.data.name}
              />
              {summary.data.transfers_count != null && (
                <Kpi
                  label={`🔁 ${t("kpis.transfers")}`}
                  value={summary.data.transfers_count}
                  detail={season.data.name}
                />
              )}
              {summary.data.transfers_amount != null && (
                <Kpi
                  label={`💶 ${t("kpis.money")}`}
                  value={formatMoney(summary.data.transfers_amount)}
                  detail={season.data.name}
                />
              )}
            </>
          )}
          {champions.data?.map((ch) => (
            <Link
              key={ch.tournament_id}
              href={`/teams/${ch.team_id}`}
              className="flex flex-col items-center justify-between gap-1 rounded-xl border bg-card/90 px-2.5 py-2.5 text-center transition-colors hover:bg-card lg:w-32"
            >
              <span className="max-w-full truncate text-[10px] text-muted-foreground">
                {competitionIcon(ch.kind)} {ch.tournament_name}
              </span>
              <TeamAvatar teamId={ch.team_id} name={ch.team_name} size="sm" />
              <span className="max-w-full truncate text-[11px] font-extrabold">
                {ch.team_name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
