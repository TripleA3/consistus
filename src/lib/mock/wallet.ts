import type { WalletSummary, WalletTransaction, WithdrawalMethod } from "@/lib/types";

const summaries: Record<string, WalletSummary> = {
  "talent-2": {
    talentId: "talent-2",
    availableBalance: 185000,
    pendingBalance: 40000,
    currency: "NGN",
  },
};

const transactions: WalletTransaction[] = [
  {
    id: "txn-1",
    talentId: "talent-2",
    kind: "credit",
    reason: "Personalised video — Tolu's birthday",
    amount: 60000,
    currency: "NGN",
    createdAt: "2026-08-20T10:00:00.000Z",
  },
  {
    id: "txn-2",
    talentId: "talent-2",
    kind: "debit",
    reason: "Withdrawal to GTBank ••••4521",
    amount: 100000,
    currency: "NGN",
    createdAt: "2026-08-15T09:00:00.000Z",
  },
  {
    id: "txn-3",
    talentId: "talent-2",
    kind: "credit",
    reason: "Special appearance — product launch",
    amount: 225000,
    currency: "NGN",
    createdAt: "2026-08-10T14:00:00.000Z",
  },
  {
    id: "txn-4",
    talentId: "talent-2",
    kind: "credit",
    reason: "Personalised video — anniversary shoutout",
    amount: 60000,
    currency: "NGN",
    createdAt: "2026-07-22T10:00:00.000Z",
  },
  {
    id: "txn-5",
    talentId: "talent-2",
    kind: "credit",
    reason: "Guest speaker — Founders Summit",
    amount: 150000,
    currency: "NGN",
    createdAt: "2026-06-18T10:00:00.000Z",
  },
  {
    id: "txn-6",
    talentId: "talent-2",
    kind: "credit",
    reason: "Personalised video — graduation",
    amount: 60000,
    currency: "NGN",
    createdAt: "2026-05-05T10:00:00.000Z",
  },
];

const methods: WithdrawalMethod[] = [
  {
    id: "method-1",
    talentId: "talent-2",
    type: "bank-account",
    label: "GTBank",
    last4: "4521",
    isDefault: true,
  },
];

// Very much not real security — a mock PIN store for a mock wallet.
const pins: Record<string, string> = {};

export function getWalletSummary(talentId: string): WalletSummary {
  return (
    summaries[talentId] ?? {
      talentId,
      availableBalance: 0,
      pendingBalance: 0,
      currency: "NGN",
    }
  );
}

export function getTransactions(talentId: string): WalletTransaction[] {
  return transactions
    .filter((t) => t.talentId === talentId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function addTransaction(transaction: WalletTransaction): WalletTransaction {
  transactions.unshift(transaction);
  return transaction;
}

export function getWithdrawalMethods(talentId: string): WithdrawalMethod[] {
  return methods.filter((m) => m.talentId === talentId);
}

export function addWithdrawalMethod(method: WithdrawalMethod): WithdrawalMethod {
  if (method.isDefault) {
    methods.forEach((m) => {
      if (m.talentId === method.talentId) m.isDefault = false;
    });
  }
  methods.push(method);
  return method;
}

export function withdraw(
  talentId: string,
  amount: number,
  methodLabel: string,
): WalletTransaction {
  const summary = getWalletSummary(talentId);
  summary.availableBalance -= amount;
  summaries[talentId] = summary;
  return addTransaction({
    id: `txn-${Date.now().toString(36)}`,
    talentId,
    kind: "debit",
    reason: `Withdrawal to ${methodLabel}`,
    amount,
    currency: summary.currency,
    createdAt: new Date().toISOString(),
  });
}

export function hasPin(talentId: string): boolean {
  return Boolean(pins[talentId]);
}

export function setPin(talentId: string, pin: string): void {
  pins[talentId] = pin;
}

export function verifyPin(talentId: string, pin: string): boolean {
  return pins[talentId] === pin;
}
