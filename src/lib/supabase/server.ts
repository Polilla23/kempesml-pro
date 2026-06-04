import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/database.types";

/**
 * Supabase client for Server Components, Route Handlers and Server Actions.
 * Must be created per-request (never cached) because it binds to the request
 * cookie store. Token refresh writes are no-ops inside Server Components —
 * the middleware (see src/middleware.ts) is responsible for refreshing.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // Safe to ignore: the middleware refreshes the session.
          }
        },
      },
    }
  );
}
