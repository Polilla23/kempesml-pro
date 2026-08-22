"use client";

import { useTranslations } from "next-intl";

import { RatingBadge } from "@/components/common/rating-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { SquadPlayer, TeamHighlights } from "../../types";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:p-5", className)}>
      {children}
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] tracking-wider text-muted-foreground uppercase">{children}</div>
  );
}

function PlayerCard({
  kicker,
  playerId,
  name,
  rating,
  subtitle,
  big,
  bigLabel,
  bigClass,
}: {
  kicker: string;
  playerId: string;
  name: string;
  rating: number;
  subtitle: string;
  big: number;
  bigLabel: string;
  bigClass: string;
}) {
  return (
    <Card className="flex flex-col items-center gap-2.5 text-center">
      <Kicker>{kicker}</Kicker>
      <div className="flex size-13 items-center justify-center rounded-xl bg-linear-to-br from-amber-300 to-amber-600 text-lg font-black text-amber-950">
        {rating}
      </div>
      <div>
        <Link href={`/players/${playerId}`} className="text-[15px] font-extrabold hover:underline">
          {name}
        </Link>
        <div className="text-xs text-muted-foreground">{subtitle}</div>
      </div>
      <div>
        <div className={cn("text-3xl leading-none font-black", bigClass)}>{big}</div>
        <div className="text-[11px] text-muted-foreground">{bigLabel}</div>
      </div>
    </Card>
  );
}

export function HighlightsCards({
  highlights,
  squad,
  isLoading,
}: {
  highlights: TeamHighlights | undefined;
  squad: SquadPlayer[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.highlights");
  const transferables = squad?.filter((p) => p.transferable).slice(0, 4) ?? [];

  if (isLoading || !highlights) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-xl" />
        ))}
      </div>
    );
  }

  const { top_scorer: ts, mvp } = highlights;

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <PlayerCard
        kicker={`⚽ ${t("topScorer")}`}
        playerId={ts.player_id}
        name={ts.name}
        rating={ts.rating}
        subtitle={`${ts.position} · ${t("matches", { count: ts.played })}`}
        big={ts.goals}
        bigLabel={t("goals")}
        bigClass="text-emerald-600 dark:text-emerald-400"
      />
      <PlayerCard
        kicker={`⭐ ${t("mvp")}`}
        playerId={mvp.player_id}
        name={mvp.name}
        rating={mvp.rating}
        subtitle={`${mvp.position} · ${t("goalsAssists", { goals: mvp.goals, assists: mvp.assists })}`}
        big={mvp.mvp_awards}
        bigLabel={t("mvpAwards")}
        bigClass="text-primary"
      />
      <Card className="sm:col-span-2 xl:col-span-1">
        <Kicker>🔁 {t("transferables")}</Kicker>
        <div className="mt-2.5 flex flex-col">
          {transferables.map((p) => (
            <div key={p.player_id} className="flex items-center gap-2.5 py-1.5 text-[13px]">
              <RatingBadge rating={p.rating} className="w-7" />
              <Link href={`/players/${p.player_id}`} className="flex-1 truncate font-semibold hover:underline">
                {p.name}
              </Link>
              <span className="text-[11px] text-muted-foreground">{p.position}</span>
              <span className="font-extrabold text-primary">{formatMoney(p.value)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
