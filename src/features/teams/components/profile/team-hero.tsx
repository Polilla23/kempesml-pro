"use client";

import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { ResultPill } from "@/components/common/result-pill";
import { Badge } from "@/components/ui/badge";
import { competitionIcon, trophyChipClass } from "@/lib/football";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { TeamProfileHeader } from "../../types";

function Stat({ label, value, accent }: { label: string; value: React.ReactNode; accent?: boolean }) {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-extrabold", accent && "text-primary")}>
        {value}
      </span>
    </div>
  );
}

export function TeamHero({ team }: { team: TeamProfileHeader }) {
  const t = useTranslations("teamProfile.hero");
  const { record } = team;
  const titles = team.trophies.reduce((n, tr) => n + tr.seasons.length, 0);

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-linear-to-r from-primary/25 via-primary/8 to-card p-4 ring-1 ring-foreground/10 md:gap-5 md:p-7">
      <div className="flex flex-wrap items-center gap-4 md:gap-6">
        <ClubAvatar name={team.name} color={team.color} size="xl" className="shadow-lg" />

        <div className="flex min-w-0 flex-1 basis-64 flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2 md:gap-3">
            <h1 className="text-2xl font-black tracking-tight md:text-3xl">{team.name}</h1>
            <Badge variant="secondary" className="font-bold">
              {t("rank", { position: team.division_position, division: team.division_name })}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("manager")}:{" "}
            <span className="font-bold text-primary">{team.manager_name}</span>
            {" · "}
            {t("season", { season: team.season_label })}
            {" · "}
            {t("formation", { formation: team.formation })}
          </p>
          <div className="mt-1 flex flex-wrap gap-x-6 gap-y-2">
            <Stat label={t("squadRating")} value={team.squad_rating} />
            <Stat label={t("squadValue")} value={formatMoney(team.squad_value)} accent />
            <Stat
              label={t("squad")}
              value={t("squadMeta", { count: team.squad_size, age: team.avg_age })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:items-end">
          <span className="text-[11px] tracking-wider text-muted-foreground uppercase">{t("form")}</span>
          <div className="flex gap-1.5">
            {team.form.map((r, i) => (
              <ResultPill key={i} result={r} className="size-7 rounded-lg text-xs" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {t("record", {
              played: record.played,
              won: record.won,
              drawn: record.drawn,
              lost: record.lost,
              points: record.points,
            })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-t border-foreground/10 pt-4">
        {team.trophies.map((tr) => {
          const cls = trophyChipClass(tr.kind);
          return (
            <div
              key={tr.competition}
              title={`${tr.competition} · ${tr.seasons.join(", ")}`}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-xl border px-3.5 pt-2 pb-1.5",
                cls.chip
              )}
            >
              <span className="text-2xl leading-none">{competitionIcon(tr.kind)}</span>
              <span className="text-[10px] font-bold whitespace-nowrap text-muted-foreground">
                {tr.short_name}
              </span>
              <span
                className={cn(
                  "absolute -top-2 -right-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-black",
                  cls.count
                )}
              >
                {tr.seasons.length}
              </span>
            </div>
          );
        })}
        <span className="ml-1 text-xs text-muted-foreground">{t("titles", { count: titles })}</span>
      </div>
    </section>
  );
}
