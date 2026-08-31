"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { paymentProvider } from "@/lib/payments/FakePaymentProvider";

type CardStatus = "idle" | "processing" | "succeeded" | "failed";

export default function CardPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { event, totals, reference, lines } = useCheckout();
  const [status, setStatus] = useState<CardStatus>("idle");
  const currency = event.ticketTiers[0]?.currency ?? "NGN";
  const simulateFailure = searchParams.get("simulate") === "fail";

  useEffect(() => {
    if (status === "succeeded") {
      router.push(`/events/${event.id}/checkout/receipt`);
    }
  }, [status, event.id, router]);

  async function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    setStatus("processing");
    const orderReference = simulateFailure ? `${reference}-fail` : reference;
    const intent = await paymentProvider.createIntent({
      amount: totals.total,
      currency,
      method: "card",
      reference: orderReference,
    });
    const result = await paymentProvider.confirmCardPayment(intent.id);
    setStatus(result.status === "succeeded" ? "succeeded" : "failed");
  }

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

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">Pay by card</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-2xl border border-card-border bg-white p-6">
          {status === "processing" ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="size-10 animate-spin rounded-full border-4 border-lime-100 border-t-lime-500" />
              <p className="text-sm text-slate-500">Processing your payment…</p>
            </div>
          ) : status === "failed" ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-full bg-danger/10 text-danger">
                <Icon name="alert-circle" className="size-6" />
              </span>
              <p className="text-sm text-slate-500">
                Your card was declined. Check your details and try again.
              </p>
              <div className="flex gap-3">
                <Button variant="primary" onClick={() => setStatus("idle")}>
                  Try again
                </Button>
                <ButtonLink href={`/events/${event.id}/checkout/pay/bank-transfer`} variant="neutral">
                  Pay by bank transfer instead
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <p className="flex items-center gap-2 text-sm text-slate-500">
                <Icon name="shield" className="size-4 text-lime-500" />
                Payments are encrypted and processed securely.
              </p>
              <Input name="cardNumber" label="Card number" placeholder="1234 5678 9012 3456" required maxLength={19} />
              <div className="grid grid-cols-2 gap-4">
                <Input name="expiry" label="Expiry" placeholder="MM/YY" required maxLength={5} />
                <Input name="cvv" label="CVV" placeholder="123" required maxLength={4} />
              </div>
              <Input name="cardName" label="Name on card" placeholder="e.g. Ada Eze" required />
              <Button type="submit" variant="accent" size="lg" className="mt-2 rounded-full">
                Pay now
              </Button>
            </form>
          )}
        </div>
        <OrderSummary />
      </div>
    </div>
  );
}
