import { defineRouting } from "next-intl/routing";

/**
 * Central i18n routing config. Add a locale here and create its
 * `messages/<locale>.json` file — everything else picks it up automatically.
 */
export const routing = defineRouting({
  locales: ["es", "en"],
  defaultLocale: "es",
});

export type Locale = (typeof routing.locales)[number];
