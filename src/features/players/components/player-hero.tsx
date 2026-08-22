"use client";

import { useLocale, useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatLongDate, formatMoney, yearsSince } from "@/lib/format";

import type { PlayerProfile } from "../types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-foreground/10 py-1.5 text-[13px] last:border-b-0 sm:nth-last-2:border-b-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

export function PlayerHero({ player }: { player: PlayerProfile }) {
  const t = useTranslations("playerProfile.hero");
  const locale = useLocale();
  const vsAvg = Math.round(
    ((player.value - player.position_avg_value) / player.position_avg_value) * 100
  );

  return (
    <section className="overflow-hidden rounded-2xl bg-linear-to-r from-primary/25 via-primary/8 to-card ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-foreground/10 px-4 py-4 md:px-7">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">{player.name}</h1>
        <Badge variant="secondary" className="font-bold">
          {player.position_label}
        </Badge>
        <Link
          href={`/teams/${player.team.id}`}
          className="flex items-center gap-2 text-sm hover:underline sm:ml-auto"
        >
          <ClubAvatar name={player.team.name} color={player.team.color} size="sm" />
          <span className="font-bold">{player.team.name}</span>
          <span className="hidden text-muted-foreground sm:inline">· {player.team.division_name}</span>
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-5 p-4 md:gap-7 md:p-7">
        {/* Player card */}
        <div className="flex h-44 w-32 shrink-0 flex-col items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-amber-600 text-amber-950 shadow-lg md:h-48 md:w-35">
          <span className="text-4xl leading-none font-black">{player.overall}</span>
          <span className="text-sm font-extrabold">{player.position}</span>
          <div className="my-2 h-px w-[70%] bg-amber-950/25" />
          <span className="text-[13px] font-extrabold uppercase">{player.short_name}</span>
          <span className="mt-1 text-lg">{player.nationality_flag}</span>
        </div>

        <div className="grid min-w-0 flex-1 basis-72 grid-cols-1 gap-x-8 sm:grid-cols-2">
          <Row
            label={t("birthDate")}
            value={`${formatLongDate(player.birth_date, locale)} (${yearsSince(player.birth_date)})`}
          />
          <Row label={t("nationality")} value={`${player.nationality_flag} ${player.nationality}`} />
          <Row label={t("height")} value={`${(player.height_cm / 100).toFixed(2)} m`} />
          <Row label={t("foot")} value={t(`feet.${player.foot}`)} />
          <Row label={t("secondaryPosition")} value={player.secondary_position ?? "—"} />
          <Row label={t("salary")} value={t("salaryPerSeason", { amount: formatMoney(player.salary) })} />
          <Row label={t("joined")} value={t("joinedSeason", { season: player.joined_season })} />
        </div>

        <div className="flex flex-col gap-1 sm:items-end">
          <span className="text-[11px] tracking-wider text-muted-foreground uppercase">{t("marketValue")}</span>
          <span className="text-4xl leading-none font-black text-primary">
            {formatMoney(player.value)}
          </span>
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            ▲ {t("valueRank", { rank: player.value_rank })}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("vsAverage", {
              pct: `${vsAvg >= 0 ? "+" : ""}${vsAvg}%`,
              position: player.position,
              avg: formatMoney(player.position_avg_value),
            })}
          </span>
        </div>
      </div>
    </section>
  );
}
