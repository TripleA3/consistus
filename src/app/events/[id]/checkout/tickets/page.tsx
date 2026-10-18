"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@/components/kit";
import { TicketTierRow } from "@/components/checkout/TicketTierRow";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";

export default function SelectTicketPage() {
  const router = useRouter();
  const { event, quantities, setQuantity, lines } = useCheckout();

  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <Card>
          {event.ticketTiers.length === 0 ? (
            <p className="text-body-md text-muted-foreground">
              No tickets are available for this event yet.
            </p>
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
        </Card>

        <Button
          size="lg"
          block
          className="mt-4"
          disabled={lines.length === 0}
          onClick={() => router.push(`/events/${event.id}/checkout/details`)}
        >
          Continue
        </Button>
      </div>

      <OrderSummary />
    </div>
  );
}
