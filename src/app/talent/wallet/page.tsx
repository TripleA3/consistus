"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Receipt,
  ShieldCheck,
  Wallet as WalletIcon,
} from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, Card, EmptyState, PageHeader, Section } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchTransactions, fetchWalletSummary } from "@/lib/api/wallet";
import { dayLabel, money } from "@/lib/format";
import type { WalletSummary, WalletTransaction } from "@/lib/types";

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
      <PageHeader title="Wallet" subtitle="What you've earned, and what's on the way." />

      {/* The one deep-indigo block on the talent side. */}
      <div className="mb-3 rounded-xl bg-primary p-5 text-primary-foreground">
        <p className="text-label-md uppercase tracking-wide opacity-70">Available balance</p>
        <p data-count className="mt-1 text-display-sm tabular-nums">
          {money(summary.availableBalance)}
        </p>
        <p className="mt-1 text-body-md opacity-80">
          {money(summary.pendingBalance)} pending from in-progress requests
        </p>

        <ButtonLink href="/talent/wallet/withdraw" size="lg" block className="mt-4">
          Withdraw
        </ButtonLink>
      </div>

      <div className="mb-[var(--section-gap)] grid grid-cols-2 gap-3">
        <ButtonLink
          href="/talent/wallet/methods"
          variant="outline"
          className="bg-card"
          leading={<WalletIcon size={17} weight="bold" />}
        >
          Methods
        </ButtonLink>
        <ButtonLink
          href="/talent/wallet/verify"
          variant="outline"
          className="bg-card"
          leading={<ShieldCheck size={17} weight="bold" />}
        >
          Get verified
        </ButtonLink>
      </div>

      <Section title="Recent activity">
        {transactions.length === 0 ? (
          <EmptyState
            icon={<Receipt size={26} />}
            title="No transactions yet"
            body="Earnings and withdrawals show up here."
          />
        ) : (
          <ul className="flex flex-col gap-2">
            {transactions.map((txn) => {
              const credit = txn.kind === "credit";
              return (
                <li key={txn.id}>
                  <Card className="flex items-center justify-between gap-3 p-3.5">
                    <span className="flex min-w-0 items-center gap-3">
                      <span
                        className={`flex size-9 shrink-0 items-center justify-center rounded-pill ${
                          credit ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {credit ? (
                          <ArrowDown size={16} weight="bold" />
                        ) : (
                          <ArrowUp size={16} weight="bold" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-title-md">{txn.reason}</span>
                        <span className="block text-body-md text-muted-foreground">
                          {dayLabel(txn.createdAt)}
                        </span>
                      </span>
                    </span>

                    <span
                      className={`shrink-0 text-label-lg tabular-nums ${
                        credit ? "text-success" : "text-foreground"
                      }`}
                    >
                      {credit ? "+" : "−"}
                      {money(txn.amount)}
                    </span>
                  </Card>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </AppShell>
  );
}
