"use client";

import { useRef, useState } from "react";
import { createPortal } from "react-dom";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Round badge for a club. Renders the crest image when `src` is given (white
 * ground so transparent logos read in both themes); the colored-initials
 * fallback stays underneath and shows when there is no image or it fails to
 * load. Prefer `<TeamAvatar>` (features/teams) when you only have a team id —
 * it resolves name + crest from the cached teams list.
 *
 * Small crests zoom 1.8× on hover with a name tooltip (league-wide behavior).
 * The tooltip renders in a body portal with fixed positioning, so it floats
 * above everything — cards with overflow-hidden cannot clip it. Disabled
 * automatically for the big `xl` size; override with `hoverCard` (e.g. a
 * future match page showing a large crest → hoverCard={false}).
 */
export function ClubAvatar({
  name,
  color,
  src,
  size = "md",
  className,
  style,
  hoverCard,
}: {
  name: string;
  /** Any CSS color (fallback ground for the initials). */
  color: string;
  /** Crest image URL; null/undefined → initials fallback. */
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
  /** Hover zoom + tooltip. Defaults to on for every size except `xl`. */
  hoverCard?: boolean;
}) {
  const sizes = {
    xs: "size-5 text-[8px]",
    sm: "size-6 text-[9px]",
    md: "size-8 text-[11px]",
    lg: "size-10 text-xs",
    xl: "size-24 rounded-2xl text-3xl md:size-28",
  } as const;
  const rounded = size === "xl" ? "rounded-2xl" : "rounded-full";
  const withCard = hoverCard ?? size !== "xl";

  const wrapRef = useRef<HTMLSpanElement>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);

  const crest = (klass?: string, kstyle?: React.CSSProperties) => (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden font-black text-white",
        rounded,
        sizes[size],
        klass
      )}
      style={{ ...kstyle, backgroundColor: color }}
    >
      {initials(name)}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny remote crests; next/image adds no value here
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full rounded-[inherit] bg-white object-contain p-[10%]"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </span>
  );

  if (!withCard) return crest(className, style);

  return (
    <span
      ref={wrapRef}
      className={cn("group/crest relative inline-flex shrink-0", rounded, className)}
      style={style}
      onMouseEnter={() => {
        const rect = wrapRef.current?.getBoundingClientRect();
        if (!rect) return;
        // Anchor above the ZOOMED crest: scaling 2.5 from the center lifts
        // the top edge by 75% of the height.
        setTip({ x: rect.left + rect.width / 2, y: rect.top - rect.height * 0.75 - 8 });
      }}
      onMouseLeave={() => setTip(null)}
    >
      {crest(
        "z-10 cursor-pointer transition-transform duration-200 ease-out group-hover/crest:z-30 group-hover/crest:scale-[2.2] group-hover/crest:shadow-lg",
      )}
      {tip &&
        createPortal(
          <span
            role="tooltip"
            className="pointer-events-none fixed z-100 -translate-x-1/2 -translate-y-full rounded-lg border bg-popover px-2.5 py-1 text-[11px] font-bold whitespace-nowrap text-popover-foreground shadow-lg animate-in duration-200 fade-in slide-in-from-bottom-1"
            style={{ left: tip.x, top: tip.y }}
          >
            {name}
          </span>,
          document.body
        )}
    </span>
  );
}
