"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Bank,
  Plus,
  Receipt,
  Ticket,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Button, ButtonLink, Card, EmptyState, PageHeader, StatusPill } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchTransactions, fetchWalletSummary } from "@/lib/api/wallet";
import { dayLabel, money } from "@/lib/format";
import type { WalletSummary, WalletTransaction } from "@/lib/types";

/** The design gives each row an icon drawn from what the entry is about. */
function iconFor(reason: string): PhosphorIcon {
  const text = reason.toLowerCase();
  if (text.includes("withdraw")) return ArrowUpRight;
  if (text.includes("ticket")) return Ticket;
  return VideoCamera;
}

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
        <p className="py-16 text-center text-body-md text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell name={user.name} avatarUrl={user.avatarUrl}>
      <PageHeader title="Wallet" />

      {/* Balance: indigo block, Withdraw sitting to the right rather than
          filling the width, per the design file. */}
      <div className="mb-4 flex items-center justify-between gap-4 rounded-xl bg-primary p-6 text-primary-foreground">
        <div className="min-w-0">
          <p className="text-body-md opacity-70">Available balance</p>
          <p data-count className="mt-0.5 text-display-sm tabular-nums">
            {money(summary.availableBalance)}
          </p>
          <p className="mt-0.5 text-body-md opacity-70">
            {money(summary.pendingBalance)} pending · clears in 2 days
          </p>
        </div>

        <ButtonLink href="/talent/wallet/withdraw" className="h-12 shrink-0 px-6">
          Withdraw
        </ButtonLink>
      </div>

      <Card className="mb-4 p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-title-lg">Withdrawal methods</h2>
          <ButtonLink
            href="/talent/wallet/methods"
            variant="secondary"
            size="sm"
            className="h-10"
            leading={<Plus size={15} weight="bold" />}
          >
            Add method
          </ButtonLink>
        </div>

        <div className="flex items-center gap-3 rounded-md bg-muted p-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Bank size={19} weight="bold" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-title-md">GTBank ···· 4821</span>
            <span className="block truncate text-body-md text-muted-foreground">
              Bank account · {user.name}
            </span>
          </span>
          <StatusPill tone="success">Verified</StatusPill>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="mb-2 text-title-lg">Transactions</h2>

        {transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt size={26} />}
            title="No transactions yet"
            body="Earnings and withdrawals show up here."
          />
        ) : (
          <ul>
            {transactions.map((txn) => {
              const credit = txn.kind === "credit";
              const Icon = iconFor(txn.reason);
              return (
                <li
                  key={txn.id}
                  className="flex items-center gap-3 border-b border-border py-4 last:border-0 last:pb-0"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                    <Icon size={19} weight="bold" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-title-md">{txn.reason}</span>
                    <span className="block text-body-md text-muted-foreground">
                      {dayLabel(txn.createdAt)}
                    </span>
                  </span>

                  <span
                    className={`shrink-0 text-title-md tabular-nums ${
                      credit ? "text-success" : "text-foreground"
                    }`}
                  >
                    {credit ? "+" : "−"}
                    {money(txn.amount)}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <div className="mt-4">
        <Button variant="ghost" size="sm" disabled title="Verification isn't wired up yet">
          Get verified
        </Button>
      </div>
    </AppShell>
  );
}
