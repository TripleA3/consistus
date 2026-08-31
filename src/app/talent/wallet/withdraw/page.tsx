"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { CodeInput } from "@/components/ui/CodeInput";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  checkHasPin,
  confirmPin,
  createPin,
  fetchWalletSummary,
  fetchWithdrawalMethods,
  submitWithdrawal,
} from "@/lib/api/wallet";
import type { WalletSummary, WithdrawalMethod } from "@/lib/types";

type Step = "amount" | "method" | "set-pin" | "enter-pin" | "success";
const PIN_LENGTH = 4;

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

export default function WithdrawPage() {
  return (
    <RequireAuth role="talent">
      <WithdrawFlow />
    </RequireAuth>
  );
}

function WithdrawFlow() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<WalletSummary | null>(null);
  const [methods, setMethods] = useState<WithdrawalMethod[] | null>(null);
  const [needsPin, setNeedsPin] = useState<boolean | null>(null);

  const [step, setStep] = useState<Step>("amount");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod | null>(null);
  const [pinDraft, setPinDraft] = useState("");
  const [pinConfirm, setPinConfirm] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchWalletSummary(user.id).then(setSummary);
    fetchWithdrawalMethods(user.id).then(setMethods);
    checkHasPin(user.id).then(setNeedsPin);
  }, [user]);

  if (!user || !summary || methods === null || needsPin === null) {
    return (
      <AppShell>
        <p className="mx-auto max-w-md px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  const format = currencyFormatter(summary.currency);

  function handleAmountSubmit() {
    const value = Number(amount);
    if (!value || value <= 0) {
      setAmountError("Enter an amount.");
      return;
    }
    if (value > summary!.availableBalance) {
      setAmountError(`You can withdraw up to ${format.format(summary!.availableBalance)}.`);
      return;
    }
    setAmountError(null);
    setStep("method");
  }

  function chooseMethod(method: WithdrawalMethod) {
    setSelectedMethod(method);
    setStep(needsPin ? "enter-pin" : "set-pin");
  }

  async function handleSetPin() {
    if (pinDraft.length !== PIN_LENGTH) {
      setPinError(`Enter a ${PIN_LENGTH}-digit PIN.`);
      return;
    }
    if (pinDraft !== pinConfirm) {
      setPinError("PINs don't match.");
      return;
    }
    await createPin(user!.id, pinDraft);
    await finishWithdrawal();
  }

  async function handleEnterPin() {
    const correct = await confirmPin(user!.id, pinDraft);
    if (!correct) {
      setPinError("Incorrect PIN.");
      setPinDraft("");
      return;
    }
    await finishWithdrawal();
  }

  async function finishWithdrawal() {
    setPinError(null);
    await submitWithdrawal(user!.id, Number(amount), selectedMethod!.label);
    setStep("success");
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-8">
        <ButtonLink href="/talent/wallet" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to wallet
        </ButtonLink>

        {step === "amount" ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">Withdraw funds</h1>
            <p className="text-sm text-slate-500">
              Available: {format.format(summary.availableBalance)}
            </p>
            <Input
              type="number"
              min={1}
              label="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              error={amountError ?? undefined}
            />
            <Button variant="accent" onClick={handleAmountSubmit}>
              Continue
            </Button>
          </div>
        ) : null}

        {step === "method" ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">Choose a method</h1>
            {methods.length === 0 ? (
              <div className="flex flex-col gap-3 text-center text-sm text-slate-500">
                <p>You haven&apos;t added a withdrawal method yet.</p>
                <ButtonLink href="/talent/wallet/methods" variant="accent">
                  Add a method
                </ButtonLink>
              </div>
            ) : (
              methods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => chooseMethod(method)}
                  className="flex items-center justify-between rounded-xl border border-card-border p-4 text-left hover:border-lime-500"
                >
                  <span>
                    <span className="block text-sm font-medium text-text">{method.label}</span>
                    <span className="block text-xs text-slate-400">•••• {method.last4}</span>
                  </span>
                  <Icon name="chevron-right" className="size-4 text-slate-400" />
                </button>
              ))
            )}
          </div>
        ) : null}

        {step === "set-pin" ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">Set a withdrawal PIN</h1>
            <p className="text-center text-sm text-slate-500">
              You&apos;ll use this PIN to confirm withdrawals going forward.
            </p>
            <CodeInput label="New PIN" value={pinDraft} onChange={setPinDraft} autoFocus />
            <CodeInput label="Confirm PIN" value={pinConfirm} onChange={setPinConfirm} />
            {pinError ? <p className="text-sm text-danger">{pinError}</p> : null}
            <Button variant="accent" onClick={handleSetPin}>
              Set PIN and withdraw
            </Button>
          </div>
        ) : null}

        {step === "enter-pin" ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">Enter your PIN</h1>
            <CodeInput value={pinDraft} onChange={setPinDraft} autoFocus />
            {pinError ? <p className="text-sm text-danger">{pinError}</p> : null}
            <Button variant="accent" onClick={handleEnterPin}>
              Confirm withdrawal
            </Button>
          </div>
        ) : null}

        {step === "success" ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-card-border bg-white p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-lime-100 text-lime-500">
              <Icon name="check" className="size-6" />
            </span>
            <h1 className="text-xl font-semibold text-text">Withdrawal on its way</h1>
            <p className="text-sm text-slate-500">
              {format.format(Number(amount))} is being sent to {selectedMethod?.label}. This
              usually takes 1–2 business days.
            </p>
            <ButtonLink href="/talent/wallet" variant="accent" className="rounded-full">
              Back to wallet
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
