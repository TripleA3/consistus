import { CalendarBlank, MapPin } from "@phosphor-icons/react/dist/ssr";
import { Card, CoverPlaceholder, StatusPill } from "@/components/kit";
import { dayLabel, money } from "@/lib/format";
import { eventPhoto } from "@/lib/images";
import type { EventItem } from "@/lib/types";

/** The event tile used on Discover and across the events grid. */
export function EventCard({ event }: { event: EventItem }) {
  const from = event.ticketTiers.length
    ? Math.min(...event.ticketTiers.map((tier) => tier.price))
    : null;

  return (
    <Card href={`/events/${event.id}`} flush className="group">
      <div className="relative">
        <CoverPlaceholder
          src={eventPhoto(event.id, event.title)}
          alt=""
          seed={event.id}
          className="aspect-[4/3]"
        >
          <CalendarBlank size={30} />
        </CoverPlaceholder>
        <StatusPill tone="neutral" className="absolute left-2.5 top-2.5 bg-card/90">
          {dayLabel(event.startsAt)}
        </StatusPill>
      </div>

      <div className="p-3.5">
        <h3 className="line-clamp-2 text-title-md">{event.title}</h3>

        <p className="mt-1.5 flex items-center gap-1 text-body-md text-muted-foreground">
          <MapPin size={14} weight="bold" className="shrink-0" />
          <span className="truncate">{event.city}</span>
        </p>

        {from === null ? null : (
          <p className="mt-2 text-label-lg">
            From <span className="text-link">{money(from)}</span>
          </p>
        )}
      </div>
    </Card>
  );
}
