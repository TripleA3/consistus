import { notFound } from "next/navigation";
import {
  CalendarBlank,
  Clock,
  MapPin,
  Users,
} from "@phosphor-icons/react/dist/ssr";
import {
  ButtonLink,
  Card,
  CoverPlaceholder,
  PageHeader,
  Section,
  StatusPill,
} from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { EventCard } from "@/components/cards/EventCard";
import { ContactOrganizerForm } from "@/components/events/ContactOrganizerForm";
import { fetchEventById, fetchEvents } from "@/lib/api/events";
import { compact, dateTimeLabel, money } from "@/lib/format";

export default async function EventDetailsPage({ params }: PageProps<"/events/[id]">) {
  const { id } = await params;
  const [event, allEvents] = await Promise.all([fetchEventById(id), fetchEvents()]);

  if (!event) {
    notFound();
  }

  const prices = event.ticketTiers.map((tier) => tier.price);
  const min = prices.length ? Math.min(...prices) : null;
  const max = prices.length ? Math.max(...prices) : null;
  const available = event.ticketTiers.reduce((sum, t) => sum + t.quantityAvailable, 0);
  const sold = event.ticketTiers.reduce((sum, t) => sum + t.quantitySold, 0);
  const soldOut = available > 0 && sold >= available;

  const moreEvents = allEvents.filter((other) => other.id !== event.id).slice(0, 4);

  return (
    <AppShell>
      <PageHeader title={event.title} back="/events" />

      <CoverPlaceholder seed={event.id} className="mb-5 aspect-[16/9] rounded-xl sm:aspect-[21/9]">
        <CalendarBlank size={44} />
      </CoverPlaceholder>

      <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
        <div className="min-w-0 flex-1">
          <Card className="mb-5">
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5">
                <Clock size={18} weight="bold" className="mt-0.5 shrink-0 text-muted-foreground" />
                <span className="text-body-lg">{dateTimeLabel(event.startsAt)}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin size={18} weight="bold" className="mt-0.5 shrink-0 text-muted-foreground" />
                <span className="text-body-lg">
                  {event.venue}
                  <span className="block text-body-md text-muted-foreground">
                    {event.address}, {event.city}
                  </span>
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Users size={18} weight="bold" className="mt-0.5 shrink-0 text-muted-foreground" />
                <span className="text-body-lg">
                  {event.organizerName}
                  <span className="block text-body-md text-muted-foreground">
                    {compact(event.organizerFollowers)} followers
                  </span>
                </span>
              </li>
            </ul>
          </Card>

          <Section title="About this event">
            <p className="whitespace-pre-line text-body-lg text-muted-foreground">
              {event.description}
            </p>

            {event.highlights.length > 0 ? (
              <ul className="mt-4 flex flex-col gap-2">
                {event.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-2.5 text-body-lg">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-cta" />
                    {highlight}
                  </li>
                ))}
              </ul>
            ) : null}
          </Section>
        </div>

        {/* Sticks beside the detail on desktop; sits above "more events" on a phone. */}
        <aside className="w-full lg:sticky lg:top-20 lg:w-[320px] lg:shrink-0">
          <Card>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-title-md">Tickets</h2>
              <StatusPill tone={soldOut ? "danger" : "success"}>
                {soldOut ? "Sold out" : `${sold.toLocaleString()} sold`}
              </StatusPill>
            </div>

            {min === null ? (
              <p className="mt-3 text-body-md text-muted-foreground">
                Tickets haven&apos;t been released yet.
              </p>
            ) : (
              <p className="mt-2 text-headline-sm">
                {min === max ? money(min) : `${money(min)} – ${money(max!)}`}
              </p>
            )}

            <ButtonLink
              href={`/events/${event.id}/checkout/tickets`}
              size="lg"
              block
              className="mt-4"
            >
              {soldOut ? "Join waitlist" : "Get tickets"}
            </ButtonLink>
          </Card>

          <div className="mt-3">
            <ContactOrganizerForm organizerName={event.organizerName} />
          </div>
        </aside>
      </div>

      {moreEvents.length > 0 ? (
        <Section title="More like this" className="mt-[var(--section-gap)]">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {moreEvents.map((other) => (
              <EventCard key={other.id} event={other} />
            ))}
          </div>
        </Section>
      ) : null}
    </AppShell>
  );
}
