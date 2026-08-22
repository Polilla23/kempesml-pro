"use client";

import { useTranslations } from "next-intl";

import { ratingChipClass, ratingSvgColor, ratingTextClass } from "@/lib/football";
import { cn } from "@/lib/utils";

import type { AttributeGroup, PlayerProfile } from "../types";

// Hexagon geometry: 6 axes, center (110,102), radius 78 in a 220×210 viewBox.
const CX = 110;
const CY = 102;
const R = 78;
const ANGLES = [0, 1, 2, 3, 4, 5].map((i) => -Math.PI / 2 + (i * Math.PI) / 3);

const pt = (a: number, r: number) =>
  `${(CX + Math.cos(a) * r).toFixed(1)},${(CY + Math.sin(a) * r).toFixed(1)}`;
const ring = (f: number) => ANGLES.map((a) => pt(a, R * f)).join(" ");

function Radar({ groups }: { groups: AttributeGroup[] }) {
  const t = useTranslations("playerProfile.attributes.short");
  const values = ANGLES.map((a, i) => pt(a, (R * (groups[i]?.value ?? 0)) / 100)).join(" ");

  return (
    <svg viewBox="0 0 220 210" className="w-full max-w-62.5">
      {[1, 0.75, 0.5, 0.25].map((f) => (
        <polygon key={f} points={ring(f)} fill="none" className="stroke-foreground/15" strokeWidth="1" />
      ))}
      {ANGLES.map((a, i) => (
        <line
          key={i}
          x1={CX}
          y1={CY}
          x2={CX + Math.cos(a) * R}
          y2={CY + Math.sin(a) * R}
          className="stroke-foreground/10"
          strokeWidth="1"
        />
      ))}
      <polygon points={values} fill="var(--primary)" fillOpacity="0.3" stroke="var(--primary)" strokeWidth="2" />
      {groups.map((g, i) => {
        const a = ANGLES[i];
        return (
          <text
            key={g.key}
            x={(CX + Math.cos(a) * (R + 22)).toFixed(1)}
            y={(CY + Math.sin(a) * (R + 18) + 4).toFixed(1)}
            fontSize="11"
            fontWeight="800"
            fill={ratingSvgColor(g.value)}
            textAnchor="middle"
          >
            {t(g.key)} {g.value}
          </text>
        );
      })}
    </svg>
  );
}

export function PlayerAttributes({ player }: { player: PlayerProfile }) {
  const t = useTranslations("playerProfile.attributes");
  const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);

  return (
    <section className="rounded-xl bg-card p-4 ring-1 ring-foreground/10 md:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-extrabold">{t("title")}</h2>
        <div className="flex flex-wrap gap-x-3.5 gap-y-1 text-[11px] text-muted-foreground">
          <span>{t("skillMoves")} {stars(player.skill_moves)}</span>
          <span>{t("weakFoot")} {stars(player.weak_foot)}</span>
          <span>{t("attackRate")}: {t(`rates.${player.attacking_rate}`)}</span>
          <span>{t("defRate")}: {t(`rates.${player.defensive_rate}`)}</span>
        </div>
      </div>

      <div className="grid items-start gap-6 md:grid-cols-[280px_1fr]">
        <div className="flex flex-col items-center gap-2.5">
          <div className="flex gap-6">
            <div className="text-center">
              <div className={cn("text-4xl leading-none font-black", ratingTextClass(player.overall))}>
                {player.overall}
              </div>
              <div className="mt-1 text-[10px] tracking-wider text-muted-foreground uppercase">{t("overall")}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl leading-none font-black text-emerald-600 dark:text-emerald-400">
                {player.potential}
              </div>
              <div className="mt-1 text-[10px] tracking-wider text-muted-foreground uppercase">{t("potential")}</div>
            </div>
          </div>
          <Radar groups={player.attributes} />
        </div>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-x-6 gap-y-4">
          {player.attributes.map((g) => (
            <div key={g.key}>
              <div
                className="mb-2 flex items-baseline justify-between border-b-2 pb-1.5"
                style={{ borderColor: ratingSvgColor(g.value) }}
              >
                <span className="text-xs font-extrabold tracking-wide uppercase">{t(`groups.${g.key}`)}</span>
                <span className="text-base font-black" style={{ color: ratingSvgColor(g.value) }}>
                  {g.value}
                </span>
              </div>
              <div className="flex flex-col gap-1.5">
                {g.items.map((a) => (
                  <div key={a.key} className="flex items-center gap-2 text-xs">
                    <span
                      className={cn(
                        "min-w-6.5 rounded-md px-1 py-px text-center text-[11px] font-extrabold",
                        ratingChipClass(a.value)
                      )}
                    >
                      {a.value}
                    </span>
                    <span className="text-foreground/80">{t(`items.${a.key}`)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
