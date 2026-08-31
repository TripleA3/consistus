"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { createWithdrawalMethod, fetchWithdrawalMethods } from "@/lib/api/wallet";
import type { WithdrawalMethod } from "@/lib/types";

export default function WithdrawalMethodsPage() {
  return (
    <RequireAuth role="talent">
      <MethodsView />
    </RequireAuth>
  );
}

function MethodsView() {
  const { user } = useAuth();
  const [methods, setMethods] = useState<WithdrawalMethod[] | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchWithdrawalMethods(user.id).then(setMethods);
  }, [user]);

  if (!user || methods === null) {
    return (
      <AppShell>
        <p className="mx-auto max-w-xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  async function handleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const type = data.get("type") as WithdrawalMethod["type"];
    const label = String(data.get("label") ?? "").trim();
    const accountNumber = String(data.get("accountNumber") ?? "").trim();
    if (!label || accountNumber.length < 4) return;

    const created = await createWithdrawalMethod({
      talentId: user!.id,
      type,
      label,
      last4: accountNumber.slice(-4),
      isDefault: methods!.length === 0,
    });
    setMethods((prev) => [...(prev ?? []), created]);
    setShowForm(false);
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-xl flex-col gap-6 px-4 py-10 sm:px-8">
        <ButtonLink href="/talent/wallet" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to wallet
        </ButtonLink>
        <h1 className="text-2xl font-bold text-text">Withdrawal methods</h1>

        {methods.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border p-8 text-center text-sm text-slate-500">
            No withdrawal methods yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {methods.map((method) => (
              <li
                key={method.id}
                className="flex items-center justify-between rounded-xl border border-card-border bg-white p-4"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                    <Icon name={method.type === "bank-account" ? "wallet" : "credit-card"} className="size-4" />
                  </span>
                  <div>
                    <p className="text-sm font-medium text-text">{method.label}</p>
                    <p className="text-xs text-slate-400">•••• {method.last4}</p>
                  </div>
                </div>
                {method.isDefault ? (
                  <span className="rounded-full bg-lime-100 px-2.5 py-1 text-xs font-medium text-lime-500">
                    Default
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        )}

        {showForm ? (
          <form onSubmit={handleAdd} className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Type</span>
              <select
                name="type"
                defaultValue="bank-account"
                className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card"
              >
                <option value="bank-account">Bank account</option>
                <option value="mobile-money">Mobile money</option>
              </select>
            </label>
            <Input name="label" label="Bank / provider name" placeholder="e.g. GTBank" required />
            <Input name="accountNumber" label="Account number" placeholder="0123456789" required minLength={4} />
            <Button type="submit" variant="accent">
              Save method
            </Button>
          </form>
        ) : (
          <Button variant="neutral" onClick={() => setShowForm(true)} className="w-fit gap-2">
            <Icon name="plus" className="size-4" />
            Add a withdrawal method
          </Button>
        )}
      </div>
    </AppShell>
  );
}
