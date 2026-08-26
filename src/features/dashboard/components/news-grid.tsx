"use client";

import { useLocale, useTranslations } from "next-intl";

import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@/i18n/navigation";
import { formatRelativeTime } from "@/lib/format";
import { cn } from "@/lib/utils";

import { useNews } from "../hooks/use-dashboard";
import type { NewsItem } from "../types";

const TONES: Record<
  NewsItem["tone"],
  { card: string; tag: string }
> = {
  blue: { card: "from-primary/60 to-primary/25", tag: "bg-primary text-primary-foreground" },
  green: { card: "from-emerald-600/60 to-emerald-800/40", tag: "bg-emerald-500 text-white" },
  sky: { card: "from-sky-600/60 to-sky-900/40", tag: "bg-sky-500 text-white" },
  amber: { card: "from-amber-500/60 to-amber-800/40", tag: "bg-amber-400 text-amber-950" },
  gold: { card: "from-yellow-500/50 to-yellow-800/40", tag: "bg-yellow-400 text-yellow-950" },
};

/**
 * TODO(db): MOCKED — swap to `get_news` once the news table exists
 * (docs/db-pending-home.md §6); only the service changes.
 */
export function NewsGrid() {
  const t = useTranslations("home.news");
  const locale = useLocale();
  const news = useNews();

  return (
    <SectionCard
      title={`📰 ${t("title")}`}
      action={
        // TODO: point to /news detail once that page exists (ComingSoon today).
        <Link href="/news" className="text-xs font-bold text-primary hover:underline">
          {t("viewAll")} ›
        </Link>
      }
    >
      {news.isLoading && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 rounded-xl" />
          ))}
        </div>
      )}
      {news.data && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-3">
          {news.data.map((n) => {
            const tone = TONES[n.tone];
            return (
              <article
                key={n.id}
                className={cn(
                  "relative aspect-4/3 cursor-pointer overflow-hidden rounded-xl bg-linear-to-br transition-transform hover:scale-[1.015]",
                  tone.card
                )}
              >
                <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-b from-black/5 via-30% to-black/80 p-3">
                  <span
                    className={cn(
                      "w-fit rounded-md px-1.5 py-0.5 text-[9px] font-extrabold",
                      tone.tag
                    )}
                  >
                    {n.tag}
                  </span>
                  <h3 className="mt-1.5 text-[12.5px] leading-tight font-bold text-white">
                    {n.title}
                  </h3>
                  <div className="mt-1 text-[10px] text-white/70">
                    {formatRelativeTime(n.created_at, locale)}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </SectionCard>
  );
}
