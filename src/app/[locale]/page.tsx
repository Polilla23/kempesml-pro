import { redirect } from "next/navigation";

/**
 * The app has no public landing page. Authenticated users are sent here by the
 * proxy → bounce them to the dashboard; unauthenticated users never reach this
 * (the proxy redirects "/" to /sign-in first). The dashboard layout re-checks
 * the session as a final guard.
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(`/${locale}/dashboard`);
}
