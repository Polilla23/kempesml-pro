/**
 * Centralized TanStack Query key factory.
 *
 * Using one source of truth for keys keeps fetching and cache invalidation in
 * sync. Each feature extends this with its own entries.
 *
 * Examples:
 *   queryKeys.profiles.all          → ["profiles"]
 *   queryKeys.profiles.detail(id)   → ["profiles", "detail", id]
 *   queryClient.invalidateQueries({ queryKey: queryKeys.teams.all })
 */
export const queryKeys = {
  profiles: {
    all: ["profiles"] as const,
    me: ["profiles", "me"] as const,
    detail: (id: string) => ["profiles", "detail", id] as const,
  },
  teams: {
    all: ["teams"] as const,
    list: (filters?: Record<string, unknown>) =>
      ["teams", "list", filters ?? {}] as const,
    detail: (id: string) => ["teams", "detail", id] as const,
  },
} as const;
