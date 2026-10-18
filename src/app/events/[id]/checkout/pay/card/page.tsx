"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Ticket, WarningCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, EmptyState, Field, Input } from "@/components/kit";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { paymentProvider } from "@/lib/payments/FakePaymentProvider";

type CardStatus = "idle" | "processing" | "succeeded" | "failed";

export default function CardPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { event, totals, reference, lines, recordOrder } = useCheckout();
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
    if (result.status !== "succeeded") {
      setStatus("failed");
      return;
    }
    // Record the purchase before showing the receipt, so the receipt never
    // claims a confirmed order that isn't in the database.
    await recordOrder("card");
    setStatus("succeeded");
  }

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

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <Card>
          {status === "processing" ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <span className="size-10 animate-spin rounded-full border-4 border-muted border-t-cta" />
              <p className="text-body-md text-muted-foreground">Processing your payment…</p>
            </div>
          ) : status === "failed" ? (
            <div className="flex flex-col items-center gap-3 py-10 text-center">
              <WarningCircle size={40} weight="fill" className="text-destructive" />
              <p className="text-body-lg text-muted-foreground">
                Your card was declined. Check the details and try again.
              </p>
              <div className="mt-1 flex flex-wrap justify-center gap-3">
                <Button onClick={() => setStatus("idle")}>Try again</Button>
                <ButtonLink
                  href={`/events/${event.id}/checkout/pay/bank-transfer`}
                  variant="outline"
                  className="bg-card"
                >
                  Pay by transfer instead
                </ButtonLink>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <p className="flex items-center gap-2 text-body-md text-muted-foreground">
                <ShieldCheck size={17} weight="fill" className="text-success" />
                Payments are encrypted and processed securely.
              </p>

              <Field label="Card number" htmlFor="card-number" required>
                <Input
                  id="card-number"
                  name="cardNumber"
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <Field label="Expiry" htmlFor="card-expiry" required>
                  <Input
                    id="card-expiry"
                    name="expiry"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                    maxLength={5}
                    required
                  />
                </Field>
                <Field label="CVV" htmlFor="card-cvv" required>
                  <Input
                    id="card-cvv"
                    name="cvv"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    maxLength={4}
                    required
                  />
                </Field>
              </div>

              <Field label="Name on card" htmlFor="card-name" required>
                <Input
                  id="card-name"
                  name="cardName"
                  autoComplete="cc-name"
                  placeholder="Ada Okafor"
                  required
                />
              </Field>

              <Button type="submit" size="lg" block className="mt-1">
                Pay now
              </Button>
            </form>
          )}
        </Card>
      </div>

      <OrderSummary />
    </div>
  );
}
