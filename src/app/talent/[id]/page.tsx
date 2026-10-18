import { notFound } from "next/navigation";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import { EmptyState, PageHeader, Section } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { TalentProfileHeader } from "@/components/talent/TalentProfileHeader";
import { RequestOptions } from "@/components/talent/RequestOptions";
import { EventCard } from "@/components/cards/EventCard";
import { fetchTalentUserById } from "@/lib/api/talents";
import { fetchEventsByTalentId } from "@/lib/api/events";

export default async function TalentDetailsPage({ params }: PageProps<"/talent/[id]">) {
  const { id } = await params;
  const talent = await fetchTalentUserById(id);

  if (!talent || !talent.talentProfile) {
    notFound();
  }

  const upcomingEvents = await fetchEventsByTalentId(id);

  return (
    <AppShell>
      <PageHeader title={talent.name} back="/" />
      <TalentProfileHeader talent={talent} profile={talent.talentProfile} />
      <RequestOptions talentId={talent.id} />

      <Section title="Upcoming events">
        {upcomingEvents.length === 0 ? (
          <EmptyState
            icon={<CalendarBlank size={26} />}
            title="Nothing on the calendar"
            body={`${talent.name} has no upcoming events right now.`}
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {upcomingEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
