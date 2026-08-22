import { ratingTextClass } from "@/lib/football";
import { cn } from "@/lib/utils";

/** Rating number colored by tier (gold / green / orange / red). */
export function RatingBadge({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "font-black tabular-nums",
        ratingTextClass(rating),
        className
      )}
    >
      {rating}
    </span>
  );
}
