import {
  QueryClient,
  defaultShouldDehydrateQuery,
  isServer,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 1 minute before a background refetch.
        staleTime: 60 * 1000,
      },
      dehydrate: {
        // Allow streaming of pending queries from Server Components.
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * Returns a request-scoped client on the server and a singleton in the browser,
 * so server renders never leak state across requests while the browser reuses
 * one cache. See the TanStack Query SSR/Next.js guide.
 */
export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
