import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import type { EventItem } from "@/lib/types";

type EventCardProps = {
  event: EventItem;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
});

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  });

export function EventCard({ event }: EventCardProps) {
  const fromPrice = Math.min(...event.ticketTiers.map((t) => t.price));
  const currency = event.ticketTiers[0]?.currency ?? "NGN";

  return (
    <Link href={`/events/${event.id}`} className="block w-full max-w-[289px] shrink-0">
      <Card className="h-full">
        <ImagePlaceholder id={event.coverImage} className="h-[226px] w-full" />
        <div className="flex flex-col gap-1 p-3">
          <p className="line-clamp-1 text-sm font-semibold text-ink">{event.title}</p>
          <p className="text-xs text-slate-500">
            {dateFormatter.format(new Date(event.startsAt))} · {event.venue}
          </p>
          <p className="mt-1 text-xs font-medium text-lime-500">
            From {currencyFormatter(currency).format(fromPrice)}
          </p>
        </div>
      </Card>
    </Link>
  );
}
