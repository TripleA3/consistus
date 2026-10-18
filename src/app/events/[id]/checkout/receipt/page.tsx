"use client";

import { CheckCircle, DownloadSimple, Ticket } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, EmptyState, StatusPill } from "@/components/kit";
import { useCheckout } from "@/lib/checkout/CheckoutContext";
import { dateTimeLabel, money } from "@/lib/format";

export default function ReceiptPage() {
  const { event, lines, totals, buyer, reference } = useCheckout();

  if (lines.length === 0) {
    return (
      <EmptyState
        icon={<Ticket size={26} />}
        title="No completed order here"
        body="We couldn't find an order for this session."
        action={{ label: "Back to event", href: `/events/${event.id}` }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <CheckCircle size={56} weight="fill" className="mx-auto text-success" />

      <h2 className="mt-3 text-headline-sm">You&apos;re going!</h2>
      <p className="mt-1 text-body-lg text-muted-foreground">
        A confirmation is on its way to {buyer.email || "your email"}.
      </p>

      <Card className="mt-5 text-left">
        <div className="flex items-start justify-between gap-3 border-b border-dashed border-border pb-3">
          <div className="min-w-0">
            <p className="text-title-md">{event.title}</p>
            <p className="truncate text-body-md text-muted-foreground">{event.venue}</p>
          </div>
          <StatusPill tone="success">Confirmed</StatusPill>
        </div>

        <dl className="flex flex-col gap-2 py-3 text-body-md">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Reference</dt>
            <dd className="font-mono font-bold">{reference}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">Date</dt>
            <dd className="font-bold">{dateTimeLabel(event.startsAt)}</dd>
          </div>

          {lines.map((line) => (
            <div key={line.tier.id} className="flex justify-between gap-3">
              <dt className="text-muted-foreground">
                {line.tier.name} × {line.quantity}
              </dt>
              <dd className="font-bold tabular-nums">
                {money(line.tier.price * line.quantity)}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex justify-between border-t border-dashed border-border pt-3 text-title-md">
          <span>Total paid</span>
          <span className="tabular-nums">{money(totals.total)}</span>
        </div>
      </Card>

      <div className="mt-4 flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="flex-1 bg-card"
          disabled
          title="PDF export isn't wired up yet"
          leading={<DownloadSimple size={18} weight="bold" />}
        >
          Receipt
        </Button>
        <ButtonLink href="/tickets" size="lg" className="flex-1">
          My tickets
        </ButtonLink>
      </div>
    </div>
  );
}
