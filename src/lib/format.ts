/** Money and date formatting, shared by every screen. */

const NAIRA = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const COMPACT = new Intl.NumberFormat("en-US", { notation: "compact" });

/** Prices are held in whole naira, not kobo. */
export function money(amount: number) {
  return NAIRA.format(amount);
}

/** 542000 → "542K", for follower counts and attendance. */
export function compact(value: number) {
  return COMPACT.format(value);
}

/*
 * Dates are formatted in Lagos time, not the viewer's. Pinning the zone
 * keeps the server and the browser in agreement - without it the server
 * renders in UTC, the client in local time, and any date inside a client
 * component fails hydration. It is also the right answer for the product:
 * an event's start time is the time at the venue.
 */
const ZONE = "Africa/Lagos";

/*
 * Built from parts rather than let Intl join them: Node and the browser
 * ship different ICU data and disagree on the separator ("Sat, 12 Sept"
 * against "Sat 12 Sept"), which fails hydration wherever a date renders
 * inside a client component. Taking only the value parts and joining them
 * ourselves makes the output identical on both sides.
 */
const DAY_PARTS = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  timeZone: ZONE,
});

function formatDay(date: Date) {
  return DAY_PARTS.formatToParts(date)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join(" ");
}

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: ZONE,
});

/** "Fri 24 Oct" — the form used on cards and list rows. */
export function dayLabel(iso: string) {
  return formatDay(new Date(iso));
}

/** "Fri 24 Oct · 8:00 pm" — for detail screens. */
export function dateTimeLabel(iso: string) {
  const date = new Date(iso);
  return `${formatDay(date)} · ${TIME.format(date)}`;
}
