import Link from "next/link";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import type { EventItem } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

type EventSearchCardProps = {
  event: EventItem;
};

/**
 * Mirrors the "_Shadow card" variant used on the search/browse results
 * screen (node 6007:40807): image, navy info panel with a price badge and
 * date, and a single "View Details" CTA.
 */
export function EventSearchCard({ event }: EventSearchCardProps) {
  const fromPrice = Math.min(...event.ticketTiers.map((t) => t.price));
  const currency = event.ticketTiers[0]?.currency ?? "NGN";

  return (
    <div className="flex h-[377px] w-full max-w-[291px] flex-col overflow-hidden rounded-xl border border-card-border bg-white shadow-card">
      <ImagePlaceholder id={event.coverImage} className="h-[199px] w-full" />
      <div className="flex flex-1 flex-col gap-3.5 bg-navy px-4 py-4 text-white">
        <div className="flex items-center gap-4">
          <span className="rounded-xl border-2 border-[#dae3c3] bg-primary px-3 py-1 text-xs font-medium text-ink">
            From {currencyFormatter(currency).format(fromPrice)}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-white">
            <Icon name="calendar" className="size-4" />
            {dateFormatter.format(new Date(event.startsAt))}
          </span>
        </div>
        <p className="line-clamp-2 flex-1 text-sm font-medium text-white/90">
          {event.description}
        </p>
        <Link
          href={`/events/${event.id}`}
          className="inline-flex items-center justify-between gap-3 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-ink"
        >
          View Details
          <span className="flex size-6 items-center justify-center rounded bg-[#1a1d21] text-white">
            <Icon name="arrow-right" className="size-3.5 -rotate-45" />
          </span>
        </Link>
      </div>
    </div>
  );
}
