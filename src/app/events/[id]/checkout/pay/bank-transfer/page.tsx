"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { paymentProvider } from "@/lib/payments/FakePaymentProvider";
import {
  transition,
  BANK_TRANSFER_STATUS_COPY,
  type BankTransferStatus,
} from "@/lib/payments/bankTransferStateMachine";

const TRANSFER_WINDOW_SECONDS = 120;

const MOCK_ACCOUNT = {
  bankName: "Fannero Payments MFB",
  accountNumber: "0123456789",
  accountName: "Fannero Technologies Ltd",
};

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

export default function BankTransferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { event, totals, reference, lines, recordOrder } = useCheckout();
  const [status, setStatus] = useState<BankTransferStatus>("awaiting_transfer");
  const [secondsLeft, setSecondsLeft] = useState(TRANSFER_WINDOW_SECONDS);
  const [copied, setCopied] = useState(false);
  const intentIdRef = useRef<string | null>(null);
  const currency = event.ticketTiers[0]?.currency ?? "NGN";

  const simulateFailure = searchParams.get("simulate") === "fail";
  const orderReference = simulateFailure ? `${reference}-fail` : reference;

  useEffect(() => {
    if (status !== "awaiting_transfer" || secondsLeft <= 0) return;
    const timer = setTimeout(() => {
      setSecondsLeft((s) => {
        const next = s - 1;
        if (next <= 0) {
          setStatus((current) => transition(current, { type: "TIMER_EXPIRED" }));
        }
        return next;
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, [status, secondsLeft]);

  // Runs once per click, not reactively off `status` — an effect keyed on
  // the same status it updates would tear its own async chain down via
  // cleanup the moment the first setStatus call fired.
  async function confirmTransfer() {
    setStatus((s) => transition(s, { type: "FAN_CONFIRMED_TRANSFER" }));

    const intent = await paymentProvider.createIntent({
      amount: totals.total,
      currency,
      method: "bank-transfer",
      reference: orderReference,
    });
    intentIdRef.current = intent.id;
    setStatus((s) => transition(s, { type: "VERIFICATION_STARTED" }));

    const result = await paymentProvider.confirmBankTransfer(intent.id);
    if (result.status !== "succeeded") {
      setStatus((s) => transition(s, { type: "VERIFICATION_FAILED" }));
      return;
    }
    // Record the purchase before showing it as verified, so a confirmed
    // transfer always corresponds to an order in the database.
    await recordOrder("bank-transfer");
    setStatus((s) => transition(s, { type: "VERIFICATION_SUCCEEDED" }));
  }

  useEffect(() => {
    if (status === "succeeded") {
      router.push(`/events/${event.id}/checkout/receipt`);
    }
  }, [status, event.id, router]);

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-card-border p-12 text-center">
        <p className="text-base text-slate-500">Your session has no tickets selected.</p>
        <ButtonLink href={`/events/${event.id}/checkout/tickets`} variant="primary">
          Start over
        </ButtonLink>
      </div>
    );
  }

  const copy = BANK_TRANSFER_STATUS_COPY[status];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">{copy.title}</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-2xl border border-card-border bg-white p-6">
          <p className="text-sm text-slate-500">{copy.description}</p>

          {status === "awaiting_transfer" ? (
            <div className="mt-6 flex flex-col gap-5">
              <div className="flex flex-col gap-3 rounded-xl bg-lime-100/40 p-5">
                <Row label="Bank" value={MOCK_ACCOUNT.bankName} />
                <Row label="Account number" value={MOCK_ACCOUNT.accountNumber} copyable onCopy={() => setCopied(true)} />
                <Row label="Account name" value={MOCK_ACCOUNT.accountName} />
                <Row label="Amount" value={currencyFormatter(currency).format(totals.total)} />
                <Row label="Reference (required)" value={orderReference} copyable onCopy={() => setCopied(true)} />
              </div>
              {copied ? <p className="text-xs text-lime-500">Copied to clipboard.</p> : null}
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Icon name="clock" className="size-4" />
                Complete your transfer within {minutes}:{seconds}
              </p>
              <Button variant="accent" size="lg" className="rounded-full" onClick={confirmTransfer}>
                I&apos;ve made this transfer
              </Button>
            </div>
          ) : null}

          {status === "pending_confirmation" || status === "processing" ? (
            <div className="mt-6 flex flex-col items-center gap-3 py-10 text-center">
              <span className="size-10 animate-spin rounded-full border-4 border-lime-100 border-t-lime-500" />
              <p className="text-sm text-slate-500">Hang tight, this only takes a moment.</p>
            </div>
          ) : null}

          {status === "failed" ? (
            <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Icon name="alert-circle" className="size-6" />
              </span>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    setSecondsLeft(TRANSFER_WINDOW_SECONDS);
                    setStatus((s) => transition(s, { type: "RETRY" }));
                  }}
                >
                  Try again
                </Button>
                <ButtonLink href={`/events/${event.id}/checkout/pay/card`} variant="neutral">
                  Pay by card instead
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {status === "expired" ? (
            <div className="mt-6 flex flex-col items-center gap-4 py-6 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-warning/10 text-warning">
                <Icon name="clock" className="size-6" />
              </span>
              <Button
                variant="primary"
                onClick={() => {
                  setSecondsLeft(TRANSFER_WINDOW_SECONDS);
                  setStatus((s) => transition(s, { type: "RETRY" }));
                }}
              >
                Start a new transfer
              </Button>
            </div>
          ) : null}
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  copyable,
  onCopy,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  onCopy?: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="flex items-center gap-2 font-semibold text-text">
        {value}
        {copyable ? (
          <button
            type="button"
            aria-label={`Copy ${label}`}
            onClick={() => {
              navigator.clipboard?.writeText(value);
              onCopy?.();
            }}
            className="text-slate-400 hover:text-lime-500"
          >
            <Icon name="copy" className="size-4" />
          </button>
        ) : null}
      </span>
    </div>
  );
}
