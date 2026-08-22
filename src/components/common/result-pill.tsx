import { resultBgClass, type MatchResult } from "@/lib/football";
import { cn } from "@/lib/utils";

/** Small W/D/L square used in form strips and result lists. */
export function ResultPill({
  result,
  className,
}: {
  result: MatchResult;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-md text-[11px] font-extrabold",
        resultBgClass(result),
        className
      )}
    >
      {result}
    </span>
  );
}
