"use client";

import { ExternalLink } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { formatLongDate, formatMoney, yearsSince } from "@/lib/format";

import type { PlayerProfile } from "../types";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-3 border-b border-foreground/10 py-1.5 text-[13px]">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-bold">{value}</span>
    </div>
  );
}

export function PlayerHero({ player }: { player: PlayerProfile }) {
  const t = useTranslations("playerProfile.hero");
  const locale = useLocale();

  const vsAvg =
    player.value != null && player.position_avg_value
      ? Math.round(
          ((player.value - player.position_avg_value) /
            player.position_avg_value) *
            100
        )
      : null;

  // Only known facts render — fields the DB doesn't have yet just don't show.
  const rows: { label: string; value: React.ReactNode }[] = [];
  if (player.birth_date)
    rows.push({
      label: t("birthDate"),
      value: `${formatLongDate(player.birth_date, locale)} (${yearsSince(player.birth_date)})`,
    });
  if (player.nationality)
    rows.push({
      label: t("nationality"),
      value: `${player.nationality_flag} ${player.nationality}`,
    });
  if (player.height_cm)
    rows.push({
      label: t("height"),
      value: `${(player.height_cm / 100).toFixed(2)} m`,
    });
  if (player.foot)
    rows.push({ label: t("foot"), value: t(`feet.${player.foot}`) });
  if (player.secondary_position)
    rows.push({ label: t("secondaryPosition"), value: player.secondary_position });
  rows.push({
    label: t("salary"),
    value: t("salaryPerSeason", { amount: formatMoney(player.salary) }),
  });
  if (player.joined_season)
    rows.push({
      label: t("joined"),
      value: t("joinedSeason", { season: player.joined_season }),
    });

  return (
    <section className="overflow-hidden rounded-2xl bg-linear-to-r from-primary/25 via-primary/8 to-card ring-1 ring-foreground/10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-foreground/10 px-4 py-4 md:px-7">
        <h1 className="text-2xl font-black tracking-tight md:text-3xl">
          {player.name}
        </h1>
        <Badge variant="secondary" className="font-bold">
          {player.position}
        </Badge>
        {player.sofifa_link && (
          <a
            href={player.sofifa_link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground hover:underline"
          >
            SoFIFA <ExternalLink className="size-3" />
          </a>
        )}
        {player.team && (
          <Link
            href={`/teams/${player.team.id}`}
            className="flex items-center gap-2 text-sm hover:underline sm:ml-auto"
          >
            <ClubAvatar name={player.team.name} color={player.team.color} size="sm" />
            <span className="font-bold">{player.team.name}</span>
            {player.team.division_name && (
              <span className="hidden text-muted-foreground sm:inline">
                · {player.team.division_name}
              </span>
            )}
          </Link>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-5 p-4 md:gap-7 md:p-7">
        {/* Player card */}
        <div className="flex h-44 w-32 shrink-0 flex-col items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-amber-600 text-amber-950 shadow-lg md:h-48 md:w-35">
          <span className="text-4xl leading-none font-black">{player.overall}</span>
          <span className="text-sm font-extrabold">{player.position}</span>
          <div className="my-2 h-px w-[70%] bg-amber-950/25" />
          <span className="max-w-[90%] truncate text-[13px] font-extrabold uppercase">
            {player.short_name}
          </span>
          <span className="mt-1 text-lg">{player.nationality_flag}</span>
        </div>

        <div className="grid min-w-0 flex-1 basis-72 grid-cols-1 gap-x-8 sm:grid-cols-2">
          {rows.map((r) => (
            <Row key={r.label} label={r.label} value={r.value} />
          ))}
        </div>

        {player.value != null && (
          <div className="flex flex-col gap-1 sm:items-end">
            <span className="text-[11px] tracking-wider text-muted-foreground uppercase">
              {t("marketValue")}
            </span>
            <span className="text-4xl leading-none font-black text-primary">
              {formatMoney(player.value)}
            </span>
            {player.value_rank != null && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                ▲ {t("valueRank", { rank: player.value_rank })}
              </span>
            )}
            {vsAvg != null && player.position_avg_value != null && (
              <span className="text-xs text-muted-foreground">
                {t("vsAverage", {
                  pct: `${vsAvg >= 0 ? "+" : ""}${vsAvg}%`,
                  position: player.position,
                  avg: formatMoney(player.position_avg_value),
                })}
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
