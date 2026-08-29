import { ButtonLink } from "@/components/ui/Button";
import type { EventItem } from "@/lib/types";

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

type TicketWidgetProps = {
  event: EventItem;
};

export function TicketWidget({ event }: TicketWidgetProps) {
  const prices = event.ticketTiers.map((t) => t.price);
  const currency = event.ticketTiers[0]?.currency ?? "NGN";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const totalAvailable = event.ticketTiers.reduce((sum, t) => sum + t.quantityAvailable, 0);
  const totalSold = event.ticketTiers.reduce((sum, t) => sum + t.quantitySold, 0);
  const soldOut = totalSold >= totalAvailable;

  return (
    <aside className="flex w-full flex-col items-center gap-4 sm:w-80">
      <div className="flex items-center gap-4">
        <p className="text-xl font-bold text-[#3a3a3a]">Available Tickets</p>
        <span className="rounded-full bg-lime-200/40 px-2.5 py-1 text-xs font-medium text-[#1c3f0c]">
          {soldOut ? "Sold out" : `${totalSold.toLocaleString()} sold`}
        </span>
      </div>
      <div className="flex w-full flex-col items-center gap-6 rounded-xl p-4">
        <p className="text-xl font-semibold text-[#3a3a3a]">
          {min === max
            ? currencyFormatter(currency).format(min)
            : `${currencyFormatter(currency).format(min)}-${currencyFormatter(currency).format(max)}`}
        </p>
        <ButtonLink
          href={`/events/${event.id}/tickets`}
          variant="accent"
          size="md"
          className="w-full justify-center rounded-full"
        >
          {soldOut ? "Join waitlist" : "Get Ticket"}
        </ButtonLink>
      </div>
    </aside>
  );
}
