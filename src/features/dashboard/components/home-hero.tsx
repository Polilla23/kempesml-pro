"use client";

import { useTranslations } from "next-intl";

import { Skeleton } from "@/components/ui/skeleton";

import { useSeasonInfo } from "../hooks/use-dashboard";

export function HomeHero() {
  const t = useTranslations("home");
  const season = useSeasonInfo();

  return (
    <section className="rounded-2xl bg-linear-to-br from-primary/30 via-primary/10 to-card p-6 ring-1 ring-foreground/10 md:p-10">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[13px] text-foreground/75">
            <span className="size-2 rounded-full bg-emerald-500" />
            {season.isLoading ? (
              <Skeleton className="h-4 w-40" />
            ) : (
              <span>
                {season.data
                  ? t("seasonActive", { season: season.data.name })
                  : "—"}
                {/* TODO(db): plazo vigente + vencimiento ("Plazo 7 (Fechas
                    13–14) · vence en 2d 14h") — necesita el endpoint de plazos
                    (docs/db-pending-home.md §4). */}
              </span>
            )}
          </div>
          <h1 className="text-4xl leading-[1.02] font-black tracking-tight md:text-5xl">
            KEMPES
            <br />
            <span className="text-primary">MASTER LEAGUE</span>
          </h1>
        </div>

        {/* TODO(db): KPIs de temporada (partidos jugados/total, transferencias
            y dinero movido) — get_season_summary (docs/db-pending-home.md §1).
            TODO(db): campeones vigentes por torneo — get_season_champions
            (docs/db-pending-home.md §2). Ambos bloques del diseño se montan
            acá cuando existan las funciones. */}
      </div>
    </section>
  );
}
