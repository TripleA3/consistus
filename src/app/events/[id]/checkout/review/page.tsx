"use client";

import { useRouter } from "next/navigation";
import { Bank, Check, CreditCard, Ticket } from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Button, ButtonLink, Card, EmptyState } from "@/components/kit";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import type { PaymentMethodType } from "@/lib/types";

const METHODS: {
  value: PaymentMethodType;
  label: string;
  description: string;
  icon: PhosphorIcon;
}[] = [
  {
    value: "bank-transfer",
    label: "Bank transfer",
    description: "Pay from your bank app. Confirmed within minutes.",
    icon: Bank,
  },
  {
    value: "card",
    label: "Debit or credit card",
    description: "Visa, Mastercard and Verve accepted.",
    icon: CreditCard,
  },
];

export default function PaymentReviewPage() {
  const router = useRouter();
  const { event, buyer, paymentMethod, setPaymentMethod, lines } = useCheckout();

  if (lines.length === 0 || !buyer.email) {
    return (
      <EmptyState
        icon={<Ticket size={26} />}
        title="Nothing to review yet"
        body="Choose your tickets and add your details first."
        action={{ label: "Start over", href: `/events/${event.id}/checkout/tickets` }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <Card className="mb-3">
          <h2 className="text-title-md">Contact details</h2>
          <dl className="mt-2 flex flex-col gap-1 text-body-md">
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Name</dt>
              <dd className="font-bold">{buyer.name}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="font-bold">{buyer.email}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-muted-foreground">Phone</dt>
              <dd className="font-bold">{buyer.phone}</dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-title-md">How would you like to pay?</h2>

          <div role="radiogroup" aria-label="Payment method" className="mt-3 flex flex-col gap-2">
            {METHODS.map((method) => {
              const selected = paymentMethod === method.value;
              return (
                <button
                  key={method.value}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => setPaymentMethod(method.value)}
                  className={`flex items-center gap-3 rounded-md border p-3.5 text-left transition-colors ${
                    selected ? "border-ring bg-accent" : "border-border hover:bg-accent"
                  }`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-secondary text-secondary-foreground">
                    <method.icon size={20} weight="bold" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block text-title-md">{method.label}</span>
                    <span className="block text-body-md text-muted-foreground">
                      {method.description}
                    </span>
                  </span>

                  <span
                    className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                      selected ? "border-cta bg-cta" : "border-input"
                    }`}
                  >
                    {selected ? (
                      <Check size={12} weight="bold" className="text-cta-foreground" />
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>
        </Card>

        <div className="mt-4 flex gap-3">
          <ButtonLink
            href={`/events/${event.id}/checkout/details`}
            variant="outline"
            size="lg"
            className="bg-card"
          >
            Back
          </ButtonLink>
          <Button
            size="lg"
            className="flex-1"
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

      <OrderSummary />
    </div>
  );
}
