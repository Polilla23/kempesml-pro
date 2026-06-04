import createIntlMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

/**
 * Combined proxy (formerly "middleware" — renamed in Next.js 16): next-intl
 * handles locale negotiation and produces the base response, then Supabase
 * refreshes the auth session and writes its cookies onto that same response.
 *
 * Route protection (redirecting unauthenticated users) can be layered in here
 * later using the returned `user`.
 */
export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const { response: finalResponse } = await updateSession(request, response);
  return finalResponse;
}

export const config = {
  // Skip Next.js internals and static files; run on everything else.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
