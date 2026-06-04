import { createNavigation } from "next-intl/navigation";

import { routing } from "./routing";

/**
 * Locale-aware navigation APIs. Always import `Link`, `useRouter`,
 * `redirect`, `usePathname` and `getPathname` from here (not from `next/*`)
 * so the active locale prefix is handled automatically.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
