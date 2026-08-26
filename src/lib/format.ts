/**
 * Formatting helpers shared across features. Kept tiny and dependency-free;
 * extend here (dates, numbers) rather than formatting inline in components.
 */

/**
 * Money in the league currency. Amounts are stored in plain units (euros).
 *   formatMoney(180_000_000) → "€180M"
 *   formatMoney(450_000)     → "€450K"
 *   formatMoney(-5_000_000)  → "-€5M"
 */
export function formatMoney(amount: number, opts?: { signed?: boolean }) {
  const abs = Math.abs(amount);
  let body: string;
  if (abs >= 1_000_000) {
    const m = abs / 1_000_000;
    body = `€${Number.isInteger(m) ? m : m.toFixed(1)}M`;
  } else if (abs >= 1_000) {
    body = `€${Math.round(abs / 1_000)}K`;
  } else {
    body = `€${abs}`;
  }
  if (amount < 0) return `-${body}`;
  return opts?.signed ? `+${body}` : body;
}

/** "+12" / "-3" / "0" for goal differences and similar deltas. */
export function formatSigned(n: number) {
  return n > 0 ? `+${n}` : String(n);
}

/** Short localized date, e.g. "24 ago" / "Aug 24". */
export function formatShortDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

/** Weekday + short date + time, for fixtures: "sáb 24 ago, 21:00". */
export function formatFixtureDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

/** Long date: "21 de julio de 2000" / "July 21, 2000". */
export function formatLongDate(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(
    new Date(iso)
  );
}

/** Full years elapsed since `iso` (age). */
export function yearsSince(iso: string, now = new Date()) {
  const d = new Date(iso);
  let years = now.getFullYear() - d.getFullYear();
  const beforeBirthday =
    now.getMonth() < d.getMonth() ||
    (now.getMonth() === d.getMonth() && now.getDate() < d.getDate());
  if (beforeBirthday) years -= 1;
  return years;
}

/** Compact time remaining until `iso`: "2d 14h", "14h", "35m"; null if past. */
export function formatTimeLeft(iso: string, now = new Date()) {
  const ms = new Date(iso).getTime() - now.getTime();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${Math.max(1, Math.floor(ms / 60_000))}m`;
}

/** Localized relative time: "hace 5 h" / "5 hr. ago". */
export function formatRelativeTime(iso: string, locale: string, now = new Date()) {
  const ms = new Date(iso).getTime() - now.getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always", style: "narrow" });
  const abs = Math.abs(ms);
  if (abs < 3_600_000) return rtf.format(Math.round(ms / 60_000), "minute");
  if (abs < 86_400_000) return rtf.format(Math.round(ms / 3_600_000), "hour");
  if (abs < 7 * 86_400_000) return rtf.format(Math.round(ms / 86_400_000), "day");
  return rtf.format(Math.round(ms / (7 * 86_400_000)), "week");
}

/** ISO-3166 alpha-2 code → flag emoji ("es" → 🇪🇸). Falls back to 🏳️. */
export function flagEmoji(iso2: string | null | undefined) {
  if (!iso2 || iso2.length !== 2) return "🏳️";
  const [a, b] = iso2.toUpperCase();
  return (
    String.fromCodePoint(0x1f1e6 + a.charCodeAt(0) - 65) +
    String.fromCodePoint(0x1f1e6 + b.charCodeAt(0) - 65)
  );
}

/** Initials for avatars: "River Plate" → "RP", "Ederson" → "E". */
export function initials(name: string, max = 2) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .slice(0, max)
    .toUpperCase();
}
