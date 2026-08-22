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
    // Club profile blocks — one key per section so tabs cache independently.
    profile: (id: string) => ["teams", "profile", id] as const,
    fixtures: (id: string) => ["teams", "fixtures", id] as const,
    results: (id: string) => ["teams", "results", id] as const,
    bestXi: (id: string) => ["teams", "best-xi", id] as const,
    standings: (id: string) => ["teams", "standings", id] as const,
    squad: (id: string) => ["teams", "squad", id] as const,
    highlights: (id: string) => ["teams", "highlights", id] as const,
    history: (id: string) => ["teams", "history", id] as const,
    records: (id: string) => ["teams", "records", id] as const,
    finances: (id: string, seasonId?: string) =>
      ["teams", "finances", id, seasonId ?? "current"] as const,
  },
  players: {
    all: ["players"] as const,
    profile: (id: string) => ["players", "profile", id] as const,
    seasons: (id: string) => ["players", "seasons", id] as const,
    transfers: (id: string) => ["players", "transfers", id] as const,
    valueHistory: (id: string) => ["players", "value-history", id] as const,
    valueRanking: (competitionId: string) =>
      ["players", "value-ranking", competitionId] as const,
  },
} as const;
