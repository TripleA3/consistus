import { AppShell } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/shared/HeroBanner";
import { EventsBrowser } from "@/components/events/EventsBrowser";
import { fetchEvents } from "@/lib/api/events";

export default async function EventsPage({
  searchParams,
}: PageProps<"/events">) {
  const { category } = await searchParams;
  const events = await fetchEvents();

  return (
    <AppShell activePath="/events">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-8 sm:px-8">
        <HeroBanner
          compact
          title="Your Exclusive Fan Experience"
          subtitle="Get closer to your favorite stars! Book video shoutouts, access exclusive events, and more."
        />
        <EventsBrowser
          events={events}
          initialCategory={typeof category === "string" ? category : "all"}
        />
      </div>
    </AppShell>
  );
}
