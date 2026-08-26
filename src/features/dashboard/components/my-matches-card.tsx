"use client";

import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentProfile } from "@/features/profiles";
import { competitionTextClass } from "@/lib/football";
import { cn } from "@/lib/utils";

import { useMyFixtures } from "../hooks/use-dashboard";

/** Pending matches of the signed-in manager's team. Hidden if no team. */
export function MyMatchesCard() {
  const t = useTranslations("home.myMatches");
  const tf = useTranslations("teamProfile.fixtures");
  const teamId = useCurrentProfile().data?.team_id;
  const fixtures = useMyFixtures(teamId);

  if (!teamId) return null;

  return (
    <SectionCard
      flush
      title={t("title")}
      /* TODO(db): chip "Plazo: vence en 2d 14h" + pie "X de N partidos del
         plazo ya cargados" — necesitan el endpoint de plazos
         (docs/db-pending-home.md §4). */
    >
      {fixtures.isLoading && (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      )}
      {!fixtures.isLoading && (fixtures.data?.length ?? 0) === 0 && (
        <p className="p-6 text-sm text-muted-foreground">{tf("empty")}</p>
      )}
      {fixtures.data?.map((fx) => (
        <div key={fx.id} className="flex flex-col gap-2.5 border-t px-4 py-3 first:border-t-0">
          <div className="flex justify-between text-[10px]">
            <span className={cn("font-extrabold", competitionTextClass(fx.competition_kind))}>
              {fx.competition}
            </span>
            {fx.plazo && (
              <span className="font-bold text-muted-foreground">
                {tf("plazo", { n: fx.plazo })}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2.5 text-[13px]">
            <ClubAvatar name={fx.rival.name} color={fx.rival.color} size="sm" />
            <span className="min-w-0 flex-1 truncate font-bold">
              {fx.is_home ? "vs" : "@"} {fx.rival.name}
            </span>
            <span className="text-[11px] text-muted-foreground">
              {tf("manager")} {fx.rival.manager_name}
            </span>
          </div>
          <div className="flex gap-2">
            {/* TODO: enlazar a la feature de contacto/chat cuando exista. */}
            <Button variant="outline" size="sm" className="flex-1 text-[11px]">
              {tf("contact")}
            </Button>
            {/* TODO: enlazar a /submit-result?match={fx.id} cuando la página exista. */}
            <Button size="sm" className="flex-1 text-[11px]">
              {tf("submitResult")}
            </Button>
          </div>
        </div>
      ))}
    </SectionCard>
  );
}
