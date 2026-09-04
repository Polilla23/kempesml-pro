"use client";

import { TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Pill-style tab strip (Claude Design): active = primary, inactive = card +
 * border. Use inside a shadcn `<Tabs>` root, alongside `<TabsContent>`.
 */
export function PillTabsList({
  items,
}: {
  items: { value: string; label: string }[];
}) {
  return (
    <TabsList className="h-auto w-full flex-wrap gap-1.5 bg-transparent p-0 sm:w-fit">
      {items.map((item) => (
        <TabsTrigger
          key={item.value}
          value={item.value}
          className="h-auto flex-none rounded-full border-border bg-card px-4.5 py-2 text-[13px] font-bold text-muted-foreground shadow-none transition-colors after:hidden hover:bg-muted hover:text-foreground data-active:border-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-none dark:text-muted-foreground dark:data-active:border-primary dark:data-active:bg-primary dark:data-active:text-primary-foreground"
        >
          {item.label}
        </TabsTrigger>
      ))}
    </TabsList>
  );
}
