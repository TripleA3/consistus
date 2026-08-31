import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { TalentProfileHeader } from "@/components/talent/TalentProfileHeader";
import { RequestOptions } from "@/components/talent/RequestOptions";
import { EventCard } from "@/components/home/EventCard";
import { fetchTalentUserById } from "@/lib/api/talents";
import { fetchEventsByTalentId } from "@/lib/api/events";

export default async function TalentDetailsPage({
  params,
}: PageProps<"/talent/[id]">) {
  const { id } = await params;
  const talent = await fetchTalentUserById(id);

  if (!talent || !talent.talentProfile) {
    notFound();
  }

  const upcomingEvents = await fetchEventsByTalentId(id);

  return (
    <AppShell activePath="/events">
      <div className="mx-auto flex max-w-5xl flex-col gap-12 px-4 py-8 sm:px-8">
        <TalentProfileHeader talent={talent} profile={talent.talentProfile} />
        <RequestOptions talentId={talent.id} />

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-text">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="rounded-xl border border-dashed border-card-border p-8 text-center text-sm text-slate-500">
              {talent.name} has no upcoming events right now.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
