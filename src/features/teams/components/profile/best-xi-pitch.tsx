"use client";

import { useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { FORMATION_SLOTS } from "@/lib/football";

import type { BestXi } from "../../types";

export function BestXiPitch({
  bestXi,
  isLoading,
}: {
  bestXi: BestXi | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("teamProfile.bestXi");
  const slots = bestXi ? FORMATION_SLOTS[bestXi.formation] ?? FORMATION_SLOTS["4-3-3"] : [];

  return (
    <SectionCard title={bestXi ? `${t("title")} · ${bestXi.formation}` : t("title")}>
      {isLoading && <Skeleton className="mx-auto aspect-3/4 w-full max-w-105 rounded-xl" />}
      {bestXi && (
        <div className="relative mx-auto aspect-3/4 w-full max-w-105 overflow-hidden rounded-xl bg-linear-to-b from-emerald-600 to-emerald-700">
          {/* pitch lines */}
          <div className="absolute inset-2.5 rounded-lg border-2 border-white/30" />
          <div className="absolute top-1/2 right-0 left-0 h-0.5 bg-white/30" />
          <div className="absolute top-1/2 left-1/2 size-22 -translate-1/2 rounded-full border-2 border-white/30" />
          <div className="absolute bottom-0 left-1/2 h-16 w-44 -translate-x-1/2 border-2 border-b-0 border-white/30" />
          <div className="absolute top-0 left-1/2 h-16 w-44 -translate-x-1/2 border-2 border-t-0 border-white/30" />

          {bestXi.players.map((p) => {
            const pos = slots[p.slot];
            if (!pos) return null;
            return (
              <Link
                key={p.player_id}
                href={`/players/${p.player_id}`}
                className="absolute flex -translate-1/2 flex-col items-center gap-1"
                style={{ top: `${pos.top}%`, left: `${pos.left}%` }}
              >
                <span className="flex size-8 items-center justify-center rounded-full border-2 border-red-600 bg-white text-xs font-black text-red-600 shadow-md md:size-9">
                  {p.rating}
                </span>
                <span className="rounded-md bg-black/50 px-1.5 py-px text-[10px] font-bold whitespace-nowrap text-white">
                  {p.short_name}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
