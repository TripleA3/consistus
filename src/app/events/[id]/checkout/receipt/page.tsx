"use client";

import { ButtonLink, Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useCheckout } from "@/lib/checkout/CheckoutContext";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

export default function ReceiptPage() {
  const { event, lines, totals, buyer, reference } = useCheckout();
  const currency = event.ticketTiers[0]?.currency ?? "NGN";

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-card-border p-12 text-center">
        <p className="text-base text-slate-500">
          We couldn&apos;t find a completed order for this session.
        </p>
        <ButtonLink href={`/events/${event.id}`} variant="primary">
          Back to event
        </ButtonLink>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-8 text-center">
      <span className="flex size-16 items-center justify-center rounded-full bg-lime-100 text-lime-500">
        <Icon name="check" className="size-8" />
      </span>
      <div>
        <h1 className="text-2xl font-bold text-text">You&apos;re going!</h1>
        <p className="mt-2 text-sm text-slate-500">
          A confirmation has been sent to {buyer.email || "your email"}.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-card-border bg-white p-6 text-left">
        <div className="flex items-center justify-between border-b border-dashed border-card-border pb-4">
          <div>
            <p className="text-lg font-semibold text-text">{event.title}</p>
            <p className="text-sm text-slate-500">{event.venue}</p>
          </div>
          <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-500">
            Confirmed
          </span>
        </div>
        <dl className="flex flex-col gap-2 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-500">Reference</dt>
            <dd className="font-medium text-text">{reference}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Date</dt>
            <dd className="font-medium text-text">{dateFormatter.format(new Date(event.startsAt))}</dd>
          </div>
          {lines.map((line) => (
            <div key={line.tier.id} className="flex justify-between">
              <dt className="text-slate-500">
                {line.tier.name} x{line.quantity}
              </dt>
              <dd className="font-medium text-text">
                {currencyFormatter(currency).format(line.tier.price * line.quantity)}
              </dd>
            </div>
          ))}
        </dl>
        <div className="flex justify-between border-t border-dashed border-card-border pt-4 text-base font-bold text-text">
          <span>Total paid</span>
          <span>{currencyFormatter(currency).format(totals.total)}</span>
        </div>
      </div>

      <div className="flex w-full gap-3">
        <Button
          variant="neutral"
          className="flex-1 justify-center rounded-full"
          disabled
          title="PDF export isn't wired up yet"
        >
          <Icon name="download" className="size-4" />
          Download receipt
        </Button>
        <ButtonLink href="/" variant="accent" className="flex-1 justify-center rounded-full">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
