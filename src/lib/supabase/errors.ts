/**
 * Normalizes a Supabase/Postgres error into a user-facing message.
 *
 * Our DB functions signal failures via `RAISE EXCEPTION`, which Supabase
 * surfaces as `error.message` (and `error.code` = SQLSTATE). Use this in
 * mutation `onError` handlers to feed a toast or form error.
 */
export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message || fallback;
  }
  return fallback;
}
