"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock, Copy, Ticket, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, EmptyState } from "@/components/kit";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { paymentProvider } from "@/lib/payments/FakePaymentProvider";
import { money } from "@/lib/format";
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
      <EmptyState
        icon={<Ticket size={26} />}
        title="No tickets in this session"
        body="Start again and pick your tickets."
        action={{ label: "Start over", href: `/events/${event.id}/checkout/tickets` }}
      />
    );
  }

  const copy = BANK_TRANSFER_STATUS_COPY[status];
  const minutes = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const seconds = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <Card>
          <h2 className="text-title-lg">{copy.title}</h2>
          <p className="mt-1 text-body-md text-muted-foreground">{copy.description}</p>

          {status === "awaiting_transfer" ? (
            <div className="mt-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2.5 rounded-md bg-accent p-4">
                <Row label="Bank" value={MOCK_ACCOUNT.bankName} />
                <Row label="Account number" value={MOCK_ACCOUNT.accountNumber} copyable onCopy={() => setCopied(true)} />
                <Row label="Account name" value={MOCK_ACCOUNT.accountName} />
                <Row label="Amount" value={money(totals.total)} />
                <Row label="Reference (required)" value={orderReference} copyable onCopy={() => setCopied(true)} />
              </div>
              {copied ? (
                <p className="text-body-md text-success">Copied to clipboard.</p>
              ) : null}

              <p className="flex items-center gap-2 text-body-md text-muted-foreground">
                <Clock size={16} weight="bold" />
                Complete your transfer within{" "}
                <span className="font-mono tabular-nums">
                  {minutes}:{seconds}
                </span>
              </p>

              <Button size="lg" block onClick={confirmTransfer}>
                I&apos;ve made this transfer
              </Button>
            </div>
          ) : null}

          {status === "pending_confirmation" || status === "processing" ? (
            <div className="mt-5 flex flex-col items-center gap-3 py-10 text-center">
              <span className="size-10 animate-spin rounded-full border-4 border-muted border-t-cta" />
              <p className="text-body-md text-muted-foreground">
                Hang tight, this only takes a moment.
              </p>
            </div>
          ) : null}

          {status === "failed" ? (
            <div className="mt-5 flex flex-col items-center gap-3 py-6 text-center">
              <WarningCircle size={40} weight="fill" className="text-destructive" />
              <div className="flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => {
                    setSecondsLeft(TRANSFER_WINDOW_SECONDS);
                    setStatus((s) => transition(s, { type: "RETRY" }));
                  }}
                >
                  Try again
                </Button>
                <ButtonLink
                  href={`/events/${event.id}/checkout/pay/card`}
                  variant="outline"
                  className="bg-card"
                >
                  Pay by card instead
                </ButtonLink>
              </div>
            </div>
          ) : null}

          {status === "expired" ? (
            <div className="mt-5 flex flex-col items-center gap-3 py-6 text-center">
              <Clock size={40} weight="fill" className="text-warning" />
              <Button
                onClick={() => {
                  setSecondsLeft(TRANSFER_WINDOW_SECONDS);
                  setStatus((s) => transition(s, { type: "RETRY" }));
                }}
              >
                Start a new transfer
              </Button>
            </div>
          ) : null}
        </Card>
      </div>

      <OrderSummary />
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
    <div className="flex items-center justify-between gap-3 text-body-md">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-2 font-bold">
        {value}
        {copyable ? (
          <button
            type="button"
            aria-label={`Copy ${label}`}
            onClick={() => {
              navigator.clipboard?.writeText(value);
              onCopy?.();
            }}
            className="text-muted-foreground hover:text-link"
          >
            <Copy size={15} weight="bold" />
          </button>
        ) : null}
      </span>
    </div>
  );
}
