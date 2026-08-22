"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { ClubAvatar } from "@/components/common/club-avatar";
import { SectionCard } from "@/components/common/section-card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatMoney } from "@/lib/format";
import { cn } from "@/lib/utils";

import type { PlayerValuePoint } from "../types";

// Chart geometry (viewBox units).
const W = 640;
const H = 180;
const X0 = 40;
const X1 = 620;
const Y0 = 20;
const Y1 = 150;

export function PlayerValueChart({
  points,
  isLoading,
}: {
  points: PlayerValuePoint[] | undefined;
  isLoading: boolean;
}) {
  const t = useTranslations("playerProfile.valueChart");
  const [hover, setHover] = useState<number | null>(null);

  if (isLoading || !points?.length) {
    return (
      <SectionCard title={t("title")}>
        <Skeleton className="aspect-32/9 w-full" />
      </SectionCard>
    );
  }

  const max = Math.max(...points.map((p) => p.value));
  const px = (i: number) => (points.length > 1 ? X0 + 20 + (i * (X1 - X0 - 20)) / (points.length - 1) : X1);
  const py = (v: number) => Y1 - (v / max) * (Y1 - Y0);
  const line = points.map((p, i) => `${px(i)},${py(p.value).toFixed(1)}`).join(" ");

  // First point of each club stint → avatar marker + legend.
  const stints = points.reduce<{ index: number; team: PlayerValuePoint["team"]; season: string }[]>(
    (acc, p, i) => {
      if (i === 0 || points[i - 1].team.id !== p.team.id) acc.push({ index: i, team: p.team, season: p.season });
      return acc;
    },
    []
  );
  const stintStart = (i: number) => [...stints].reverse().find((s) => s.index <= i)!;

  const tip =
    hover !== null
      ? (() => {
          const p = points[hover];
          const start = stintStart(hover);
          const delta = p.value - points[start.index].value;
          return {
            p,
            club: start.team.name,
            arrival: hover === start.index,
            delta,
            left: Math.min(Math.max((px(hover) / W) * 100, 15), 82),
            top: Math.max((py(p.value) / H) * 100, 34),
          };
        })()
      : null;

  return (
    <SectionCard
      title={t("title")}
      action={
        <span className="text-xs text-muted-foreground">
          {points[0].season}–{points[points.length - 1].season}
        </span>
      }
    >
      <div className="relative">
        <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
          <line x1={X0} y1={Y0} x2={X0} y2={Y1} className="stroke-foreground/15" />
          <line x1={X0} y1={Y1} x2={X1} y2={Y1} className="stroke-foreground/15" />
          {[max, max / 2, 0].map((v, i) => (
            <text key={i} x={X0 - 6} y={py(v) + 4} fontSize="10" textAnchor="end" className="fill-muted-foreground">
              {formatMoney(v)}
            </text>
          ))}
          <polygon
            points={`${line} ${px(points.length - 1)},${Y1} ${px(0)},${Y1}`}
            fill="var(--primary)"
            fillOpacity="0.12"
          />
          <polyline points={line} fill="none" stroke="var(--primary)" strokeWidth="2.5" />
          {points.map((p, i) => (
            <g key={p.season}>
              <circle
                cx={px(i)}
                cy={py(p.value)}
                r={i === points.length - 1 ? 5.5 : 3.5}
                fill="var(--primary)"
                className={cn(i === points.length - 1 && "stroke-background")}
                strokeWidth="1.5"
              />
              <circle
                cx={px(i)}
                cy={py(p.value)}
                r="16"
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onClick={() => setHover((h) => (h === i ? null : i))}
              />
              <text x={px(i)} y={Y1 + 16} fontSize="10" textAnchor="middle" className="fill-muted-foreground">
                {p.season}
              </text>
            </g>
          ))}
        </svg>

        {stints.map((s) => (
          <ClubAvatar
            key={s.index}
            name={s.team.name}
            color={s.team.color}
            size="sm"
            className="pointer-events-none absolute -translate-1/2 border-2 border-background shadow-md"
            // Positioned in % of the SVG box so it scales with it.
            style={{ left: `${(px(s.index) / W) * 100}%`, top: `${(py(points[s.index].value) / H) * 100}%` }}
          />
        ))}

        {tip && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[120%] rounded-lg border bg-popover px-3 py-2 whitespace-nowrap shadow-lg"
            style={{ left: `${tip.left}%`, top: `${tip.top}%` }}
          >
            <div className="text-[11px] font-bold text-muted-foreground">
              {tip.p.season} · {tip.club}
            </div>
            <div className="text-base font-black text-primary">{formatMoney(tip.p.value)}</div>
            <div
              className={cn(
                "text-[11px] font-bold",
                tip.arrival
                  ? "text-muted-foreground"
                  : tip.delta >= 0
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-red-600 dark:text-red-400"
              )}
            >
              {tip.arrival
                ? t("arrival")
                : `${tip.delta >= 0 ? "▲" : "▼"} ${formatMoney(tip.delta, { signed: true })} ${t("sinceArrival")}`}
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap gap-3 text-[11px] text-muted-foreground">
        {stints.map((s) => (
          <span key={s.index} className="flex items-center gap-1.5">
            <span className="inline-block size-3.5 rounded-full" style={{ backgroundColor: s.team.color }} />
            {s.team.name} {s.season}
          </span>
        ))}
      </div>
    </SectionCard>
  );
}
