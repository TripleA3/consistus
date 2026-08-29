import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { EventInfoCard } from "@/components/events/EventInfoCard";
import { TicketWidget } from "@/components/events/TicketWidget";
import { AboutEvent } from "@/components/events/AboutEvent";
import { OrganizerCard } from "@/components/events/OrganizerCard";
import { ContactOrganizerForm } from "@/components/events/ContactOrganizerForm";
import { EventCard } from "@/components/home/EventCard";
import { fetchEventById, fetchEvents } from "@/lib/api/events";

export default async function EventDetailsPage({
  params,
}: PageProps<"/events/[id]">) {
  const { id } = await params;
  const [event, allEvents] = await Promise.all([fetchEventById(id), fetchEvents()]);

  if (!event) {
    notFound();
  }

  const moreEvents = allEvents.filter((e) => e.id !== event.id).slice(0, 4);

  return (
    <AppShell activePath="/events">
      <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 py-8 sm:px-8">
        <HeroBanner
          compact
          title="Your Exclusive Fan Experience"
          subtitle="Get closer to your favorite stars! Book video shoutouts, access exclusive events, and more."
        />

        <div className="flex flex-col gap-10">
          <EventInfoCard event={event} />
          <div className="flex flex-col gap-16 lg:flex-row lg:gap-16">
            <div className="flex flex-1 flex-col gap-16">
              <AboutEvent event={event} />
              <OrganizerCard event={event} />
            </div>
            <div className="flex justify-center lg:justify-start">
              <TicketWidget event={event} />
            </div>
          </div>
        </div>

        <ContactOrganizerForm organizerName={event.organizerName} />

        {moreEvents.length > 0 ? (
          <section className="flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-text">More Events Like This</h2>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {moreEvents.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </AppShell>
  );
}
