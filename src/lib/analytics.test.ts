import { describe, expect, it } from "vitest";
import { groupEarningsByMonth } from "@/lib/analytics";
import type { WalletTransaction } from "@/lib/types";

function makeTxn(overrides: Partial<WalletTransaction> = {}): WalletTransaction {
  return {
    id: "txn-x",
    talentId: "talent-2",
    kind: "credit",
    reason: "Test",
    amount: 1000,
    currency: "NGN",
    createdAt: "2026-08-15T00:00:00.000Z",
    ...overrides,
  };
}

describe("groupEarningsByMonth", () => {
  const now = new Date(Date.UTC(2026, 7, 31)); // 31 Aug 2026

  it("returns the trailing N months, oldest first, ending at now", () => {
    const result = groupEarningsByMonth([], 3, now);
    expect(result.map((m) => m.month)).toEqual(["2026-06", "2026-07", "2026-08"]);
  });

  it("sums credit transactions into their month", () => {
    const transactions = [
      makeTxn({ amount: 5000, createdAt: "2026-08-01T00:00:00.000Z" }),
      makeTxn({ amount: 3000, createdAt: "2026-08-20T00:00:00.000Z" }),
      makeTxn({ amount: 7000, createdAt: "2026-07-10T00:00:00.000Z" }),
    ];
    const result = groupEarningsByMonth(transactions, 2, now);
    expect(result).toEqual([
      { month: "2026-07", total: 7000 },
      { month: "2026-08", total: 8000 },
    ]);
  });

  it("ignores debits", () => {
    const transactions = [
      makeTxn({ kind: "debit", amount: 9000, createdAt: "2026-08-05T00:00:00.000Z" }),
    ];
    const result = groupEarningsByMonth(transactions, 1, now);
    expect(result).toEqual([{ month: "2026-08", total: 0 }]);
  });

  it("ignores transactions outside the requested window", () => {
    const transactions = [makeTxn({ amount: 9000, createdAt: "2025-01-01T00:00:00.000Z" })];
    const result = groupEarningsByMonth(transactions, 2, now);
    expect(result.reduce((sum, m) => sum + m.total, 0)).toBe(0);
  });

  it("keeps a month at zero when nothing happened", () => {
    const result = groupEarningsByMonth([], 3, now);
    expect(result.every((m) => m.total === 0)).toBe(true);
  });
});
