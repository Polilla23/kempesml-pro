import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/types/database.types";

/**
 * Refreshes the Supabase auth session on every request and syncs the auth
 * cookies onto the response that next-intl already produced. Returns the
 * authenticated user (or null) so the middleware can gate protected routes.
 *
 * IMPORTANT: do not run any logic between creating the client and calling
 * `getUser()` — that call is what triggers the token refresh.
 */
export async function updateSession(
  request: NextRequest,
  response: NextResponse
) {
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { response, user };
}
