import type { WalletTransaction } from "@/lib/types";

export type MonthlyEarnings = {
  month: string; // "2026-08"
  total: number;
};

/**
 * Sums credit transactions by calendar month, returning the trailing
 * `monthCount` months in chronological order (oldest first) ending at
 * `now`. Months with no activity still appear, at zero, so a chart never
 * silently skips a gap.
 */
export function groupEarningsByMonth(
  transactions: WalletTransaction[],
  monthCount: number,
  now: Date = new Date(),
): MonthlyEarnings[] {
  const months: MonthlyEarnings[] = [];
  for (let i = monthCount - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    months.push({ month: d.toISOString().slice(0, 7), total: 0 });
  }

  const byMonth = new Map(months.map((m) => [m.month, m]));
  for (const txn of transactions) {
    if (txn.kind !== "credit") continue;
    const key = txn.createdAt.slice(0, 7);
    const bucket = byMonth.get(key);
    if (bucket) bucket.total += txn.amount;
  }

  return months;
}
