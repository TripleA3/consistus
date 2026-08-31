"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchTransactions, fetchWalletSummary } from "@/lib/api/wallet";
import type { WalletSummary, WalletTransaction } from "@/lib/types";

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric" });

export default function WalletPage() {
  return (
    <RequireAuth role="talent">
      <WalletView />
    </RequireAuth>
  );
}

function WalletView() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchWalletSummary(user.id).then(setSummary);
    fetchTransactions(user.id).then(setTransactions);
  }, [user]);

  if (!user || !summary || !transactions) {
    return (
      <AppShell>
        <p className="mx-auto max-w-2xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  const format = currencyFormatter(summary.currency);

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold text-text">Wallet</h1>

        <div className="rounded-2xl bg-navy p-6 text-white">
          <p className="text-sm text-white/70">Available balance</p>
          <p className="mt-1 text-3xl font-bold">{format.format(summary.availableBalance)}</p>
          <p className="mt-2 text-sm text-white/70">
            {format.format(summary.pendingBalance)} pending from in-progress requests
          </p>
          <ButtonLink
            href="/talent/wallet/withdraw"
            variant="accent"
            className="mt-4 w-full justify-center rounded-full"
          >
            Withdraw
          </ButtonLink>
        </div>

        <div className="flex gap-3">
          <ButtonLink href="/talent/wallet/methods" variant="neutral" className="flex-1 justify-center gap-2">
            <Icon name="wallet" className="size-4" />
            Withdrawal methods
          </ButtonLink>
          <ButtonLink href="/talent/wallet/verify" variant="neutral" className="flex-1 justify-center gap-2">
            <Icon name="shield" className="size-4" />
            Get verified
          </ButtonLink>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="text-base font-semibold text-text">Recent activity</h2>
          {transactions.length === 0 ? (
            <div className="rounded-xl border border-dashed border-card-border p-8 text-center text-sm text-slate-500">
              No transactions yet.
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {transactions.map((txn) => (
                <li
                  key={txn.id}
                  className="flex items-center justify-between gap-4 rounded-xl border border-card-border bg-white p-4"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex size-9 items-center justify-center rounded-full ${
                        txn.kind === "credit" ? "bg-lime-100 text-lime-500" : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Icon name={txn.kind === "credit" ? "plus" : "minus"} className="size-4" />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-text">{txn.reason}</p>
                      <p className="text-xs text-slate-400">{dateFormatter.format(new Date(txn.createdAt))}</p>
                    </div>
                  </div>
                  <span
                    className={`text-sm font-semibold ${txn.kind === "credit" ? "text-lime-500" : "text-text"}`}
                  >
                    {txn.kind === "credit" ? "+" : "-"}
                    {format.format(txn.amount)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
