import { Construction } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { EmptyState } from "./empty-state";

/**
 * Reusable placeholder for nav sections not built yet. `titleKey` is a key
 * under the `nav` namespace (e.g. "competitions").
 */
export async function ComingSoon({ titleKey }: { titleKey: string }) {
  const tNav = await getTranslations("nav");
  const t = await getTranslations("comingSoon");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">
        {tNav(titleKey as Parameters<typeof tNav>[0])}
      </h1>
      <EmptyState
        icon={Construction}
        title={t("title")}
        description={t("description")}
      />
    </div>
  );
}
