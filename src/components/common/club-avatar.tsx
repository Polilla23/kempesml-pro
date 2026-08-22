import { initials } from "@/lib/format";
import { cn } from "@/lib/utils";

/**
 * Round badge with the club initials over its primary color. Used wherever a
 * club is referenced inline (fixtures, transfers, value chart...).
 */
export function ClubAvatar({
  name,
  color,
  size = "md",
  className,
  style,
}: {
  name: string;
  /** Any CSS color (comes from the DB). */
  color: string;
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
        "inline-flex shrink-0 items-center justify-center rounded-full font-black text-white",
        sizes[size],
        className
      )}
      style={{ ...style, backgroundColor: color }}
    >
      {initials(name)}
    </span>
  );
}
