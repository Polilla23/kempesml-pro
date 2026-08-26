"use client";

import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { clubColor, competitionIcon } from "@/lib/football";
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
    <div className="flex flex-col items-center rounded-xl border bg-card/90 px-3 py-3 text-center">
      <div className="text-[11px] text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-2xl font-black tabular-nums">{value}</div>
      <div className="text-[10px] text-muted-foreground">{detail}</div>
    </div>
  );
}

export function HomeHero() {
  const t = useTranslations("home");
  const season = useSeasonInfo();
  // TODO(db): summary, champions and plazo are MOCKED — get_season_summary /
  // get_season_champions / get_current_plazo (docs/db-pending-home.md §1 §2 §4).
  const summary = useSeasonSummary();
  const champions = useChampions();
  const plazo = useCurrentPlazo();

  const timeLeft = plazo.data ? formatTimeLeft(plazo.data.deadline) : null;

  return (
    <section className="rounded-2xl bg-linear-to-br from-primary/30 via-primary/10 to-card p-6 ring-1 ring-foreground/10 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-8">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[13px] text-foreground/75">
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
          <h1 className="text-4xl leading-[1.02] font-black tracking-tight md:text-5xl">
            KEMPES
            <br />
            <span className="text-primary">MASTER LEAGUE</span>
          </h1>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {summary.isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-22 w-36 rounded-xl" />
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
                    detail={t("kpis.prevSeason")}
                  />
                )}
                {summary.data.transfers_amount != null && (
                  <Kpi
                    label={`💶 ${t("kpis.money")}`}
                    value={formatMoney(summary.data.transfers_amount)}
                    detail={t("kpis.prevSeason")}
                  />
                )}
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {champions.data?.map((ch) => (
              <Link
                key={ch.tournament_id}
                href={`/teams/${ch.team_id}`}
                className="flex flex-col items-center gap-1.5 rounded-xl border bg-card/90 px-2.5 py-3 text-center transition-colors hover:bg-card"
              >
                <span className="text-[10px] whitespace-nowrap text-muted-foreground">
                  {competitionIcon(ch.kind)} {ch.tournament_name}
                </span>
                <ClubAvatar name={ch.team_name} color={clubColor(ch.team_id)} size="md" />
                <span className="max-w-full truncate text-xs font-extrabold">
                  {ch.team_name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
