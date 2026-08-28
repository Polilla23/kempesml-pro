"use client";

import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Rounded-square player portrait. Shows the photo when `src` is given; the
 * initials fallback stays underneath and shows when there is no image or the
 * URL 404s (photo files are uploaded by convention and may not exist yet).
 */
export function PlayerAvatar({
  name,
  src,
  size = "md",
  className,
}: {
  name: string;
  src?: string | null;
  size?: "sm" | "md";
  className?: string;
}) {
  const sizes = {
    sm: "size-6.5 rounded-full text-[10px]",
    md: "size-12 rounded-xl text-base",
  } as const;
  return (
    <span
      aria-hidden
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-muted font-black text-muted-foreground",
        sizes[size],
        className
      )}
    >
      {initials(name)}
      {src && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny remote portraits; next/image adds no value here
        <img
          src={src}
          alt=""
          loading="lazy"
          className="absolute inset-0 size-full rounded-[inherit] object-cover"
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      )}
    </span>
  );
}
