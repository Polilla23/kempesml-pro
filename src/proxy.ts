import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";

import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

/** Paths (locale-stripped) reachable without an authenticated session. */
const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/forgot-password",
  "/reset-password",
];

/**
 * Paths an already-authenticated user should be bounced away from (to the
 * dashboard). The root "/" is included so it never shows a landing page —
 * logged-in users go to /dashboard, logged-out users fall through to the
 * unauthenticated redirect below (→ /sign-in).
 * Note: /reset-password is intentionally excluded — following the recovery
 * link creates a session, and the user still needs to land there to set a new
 * password.
 */
const AUTH_PATHS = ["/", "/sign-in", "/sign-up", "/forgot-password"];

/**
 * Combined proxy (Next.js 16's renamed middleware):
 * 1. next-intl negotiates the locale and builds the base response.
 * 2. Supabase refreshes the session and writes cookies onto that response.
 * 3. We gate access: unauthenticated users are sent to /sign-in, and
 *    authenticated users hitting /sign-in are sent to /dashboard.
 */
export async function proxy(request: NextRequest) {
  const response = intlMiddleware(request);
  const { response: finalResponse, user } = await updateSession(
    request,
    response
  );

  const segments = request.nextUrl.pathname.split("/");
  const locale = (routing.locales as readonly string[]).includes(segments[1])
    ? segments[1]
    : routing.defaultLocale;
  const pathname = `/${segments.slice(2).join("/")}`.replace(/\/$/, "") || "/";

  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (!user && !isPublic) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
  }
  if (user && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

  return finalResponse;
}

export const config = {
  // Skip Next.js internals and static files; run on everything else.
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
