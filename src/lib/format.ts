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

const DAY = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
});

const TIME = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

/** "Fri 24 Oct" — the form used on cards and list rows. */
export function dayLabel(iso: string) {
  return DAY.format(new Date(iso));
}

/** "Fri 24 Oct · 8:00 pm" — for detail screens. */
export function dateTimeLabel(iso: string) {
  const date = new Date(iso);
  return `${DAY.format(date)} · ${TIME.format(date)}`;
}
