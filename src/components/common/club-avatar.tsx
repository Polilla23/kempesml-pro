"use client";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Round badge for a club. Renders the crest image when `src` is given (white
 * ground so transparent logos read in both themes); the colored-initials
 * fallback stays underneath and shows when there is no image or it fails to
 * load. Prefer `<TeamAvatar>` (features/teams) when you only have a team id —
 * it resolves name + crest from the cached teams list.
 */
export function ClubAvatar({
  name,
  color,
  src,
  size = "md",
  className,
  style,
}: {
  name: string;
  /** Any CSS color (fallback ground for the initials). */
  color: string;
  /** Crest image URL; null/undefined → initials fallback. */
  src?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  style?: React.CSSProperties;
}) {
  const sizes = {
    xs: "size-5 text-[8px]",
    sm: "size-6 text-[9px]",
    md: "size-8 text-[11px]",
    lg: "size-10 text-xs",
    xl: "size-24 rounded-2xl text-3xl md:size-28",
  } as const;
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-black text-white",
        sizes[size],
        className
      )}
      style={{ ...style, backgroundColor: color }}
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
}
