"use client";

import { useRouter } from "next/navigation";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import type { PaymentMethodType } from "@/lib/types";

const methods: { value: PaymentMethodType; label: string; description: string; icon: "wallet" | "credit-card" }[] = [
  {
    value: "bank-transfer",
    label: "Bank transfer",
    description: "Pay directly from your bank app. Confirmed within minutes.",
    icon: "wallet",
  },
  {
    value: "card",
    label: "Debit or credit card",
    description: "Visa, Mastercard, and Verve accepted.",
    icon: "credit-card",
  },
];

export default function PaymentReviewPage() {
  const router = useRouter();
  const { event, buyer, paymentMethod, setPaymentMethod, lines } = useCheckout();

  if (lines.length === 0 || !buyer.email) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-card-border p-12 text-center">
        <p className="text-base text-slate-500">
          Finish choosing your tickets and details before reviewing payment.
        </p>
        <ButtonLink href={`/events/${event.id}/checkout/tickets`} variant="primary">
          Start over
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">Review and choose how to pay</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-6">
          <div className="rounded-2xl border border-card-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text">Contact details</h2>
            <dl className="mt-3 flex flex-col gap-1 text-sm text-slate-500">
              <div className="flex gap-2">
                <dt className="font-medium text-text">Name:</dt>
                <dd>{buyer.name}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-text">Email:</dt>
                <dd>{buyer.email}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="font-medium text-text">Phone:</dt>
                <dd>{buyer.phone}</dd>
              </div>
            </dl>
          </div>

          <div className="rounded-2xl border border-card-border bg-white p-6">
            <h2 className="text-lg font-semibold text-text">Payment method</h2>
            <div className="mt-4 flex flex-col gap-3">
              {methods.map((method) => {
                const selected = paymentMethod === method.value;
                return (
                  <button
                    key={method.value}
                    type="button"
                    onClick={() => setPaymentMethod(method.value)}
                    aria-pressed={selected}
                    className={`flex items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                      selected ? "border-lime-500 bg-lime-100/40" : "border-card-border"
                    }`}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                      <Icon name={method.icon} className="size-5" />
                    </span>
                    <span className="flex-1">
                      <span className="block text-base font-medium text-text">{method.label}</span>
                      <span className="block text-sm text-slate-500">{method.description}</span>
                    </span>
                    <span
                      className={`flex size-5 items-center justify-center rounded-full border-2 ${
                        selected ? "border-lime-500 bg-lime-500" : "border-card-border"
                      }`}
                    >
                      {selected ? <Icon name="check" className="size-3 text-white" /> : null}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
        <OrderSummary />
      </div>
      <div className="flex items-center justify-between">
        <ButtonLink href={`/events/${event.id}/checkout/details`} variant="neutral">
          Back
        </ButtonLink>
        <Button
          variant="accent"
          size="lg"
          className="rounded-full"
          disabled={!paymentMethod}
          onClick={() => {
            if (!paymentMethod) return;
            const path = paymentMethod === "bank-transfer" ? "bank-transfer" : "card";
            router.push(`/events/${event.id}/checkout/pay/${path}`);
          }}
        >
          Continue to pay
        </Button>
      </div>
    </div>
  );
}
