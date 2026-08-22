import { cn } from "@/lib/utils";

/**
 * Card with a compact titled header, used for dashboard-style blocks
 * (standings, results, history...). `action` renders at the right of the
 * title. Pass `flush` when the body is a list/table that should touch the
 * card edges.
 */
export function SectionCard({
  title,
  action,
  flush = false,
  className,
  children,
}: {
  title: React.ReactNode;
  action?: React.ReactNode;
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl bg-card text-card-foreground ring-1 ring-foreground/10",
        className
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b px-4 py-3 md:px-5">
        <h2 className="text-sm font-bold">{title}</h2>
        {action}
      </header>
      <div className={flush ? undefined : "p-4 md:p-5"}>{children}</div>
    </section>
  );
}
