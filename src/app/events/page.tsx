import { PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { EventsBrowser } from "@/components/events/EventsBrowser";
import { fetchEvents } from "@/lib/api/events";

export const dynamic = "force-dynamic";

export default async function EventsPage({ searchParams }: PageProps<"/events">) {
  const { category } = await searchParams;
  const events = await fetchEvents();

  return (
    <AppShell>
      <PageHeader
        title="What's"
        accent="on"
        subtitle="Concerts, comedy, tech nights and more."
      />
      <EventsBrowser
        events={events}
        initialCategory={typeof category === "string" ? category : "all"}
      />
    </AppShell>
  );
}
