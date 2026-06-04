/** App-wide constants and enums mirrored from the database CHECK constraints. */

export const USER_ROLES = ["admin", "manager", "viewer"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const USER_STATUSES = ["active", "inactive"] as const;
export type UserStatus = (typeof USER_STATUSES)[number];

export const DEFAULT_PAGE_SIZE = 20;

/** Internal route paths (locale prefix is added by next-intl navigation). */
export const ROUTES = {
  home: "/",
  signIn: "/sign-in",
  dashboard: "/dashboard",
  teams: "/teams",
  competitions: "/competitions",
  transfers: "/transfers",
  rankings: "/rankings",
  finances: "/finances",
  trophies: "/trophies",
} as const;
