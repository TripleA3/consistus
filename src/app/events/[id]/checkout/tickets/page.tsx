"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TicketTierRow } from "@/components/checkout/TicketTierRow";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";

export default function SelectTicketPage() {
  const router = useRouter();
  const { event, quantities, setQuantity, lines } = useCheckout();

  const hasSelection = lines.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">
        Choose the perfect ticket for your experience
      </h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1 rounded-2xl border border-card-border bg-white p-6">
          {event.ticketTiers.length === 0 ? (
            <p className="text-sm text-slate-500">No ticket tiers are available for this event.</p>
          ) : (
            event.ticketTiers.map((tier) => (
              <TicketTierRow
                key={tier.id}
                tier={tier}
                quantity={quantities[tier.id] ?? 0}
                onChange={(quantity) => setQuantity(tier.id, quantity)}
                saleEndsAt={event.startsAt}
              />
            ))
          )}
        </div>
        <OrderSummary />
      </div>
      <div className="flex justify-end">
        <Button
          variant="accent"
          size="lg"
          className="rounded-full"
          disabled={!hasSelection}
          onClick={() => router.push(`/events/${event.id}/checkout/details`)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
