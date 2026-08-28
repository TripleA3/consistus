import { AppShell } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryChips } from "@/components/home/CategoryChips";
import { CelebrityCard } from "@/components/home/CelebrityCard";
import { EventCard } from "@/components/home/EventCard";
import { VideoRequestCard } from "@/components/home/VideoRequestCard";
import { HowItWorks } from "@/components/home/HowItWorks";
import { fetchEvents } from "@/lib/api/events";
import { fetchTalentUsers } from "@/lib/api/talents";

const talentCategories = [
  { value: "all", label: "All" },
  { value: "artist", label: "Artist" },
  { value: "actor", label: "Actors" },
  { value: "comedian", label: "Comedians" },
  { value: "techie", label: "Techies" },
];

const eventCategories = [
  { value: "all", label: "All Events" },
  { value: "concerts", label: "Concerts" },
  { value: "nightlife", label: "Nightlife" },
  { value: "tech-and-gaming", label: "Tech & Gaming" },
  { value: "food-and-drinks", label: "Food & Drinks" },
  { value: "networking", label: "Networking" },
];

export default async function HomePage() {
  const [events, talentUsers] = await Promise.all([
    fetchEvents(),
    fetchTalentUsers(),
  ]);

  return (
    <AppShell activePath="/">
      <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 pb-20 sm:px-8">
        <HeroBanner />

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text">Top Celebrities</h2>
          </div>
          <CategoryChips categories={talentCategories} />
          {talentUsers.length === 0 ? (
            <EmptyState message="No talent to show yet. Check back soon." />
          ) : (
            <div className="flex gap-3.5 overflow-x-auto pb-2">
              {talentUsers.map((talent) =>
                talent.talentProfile ? (
                  <CelebrityCard key={talent.id} talent={talent} profile={talent.talentProfile} />
                ) : null,
              )}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-text">Don&apos;t Miss These Events</h2>
            <a href="/events" className="text-base font-semibold text-[#3a3a3a] hover:text-ink">
              See more
            </a>
          </div>
          <CategoryChips categories={eventCategories} />
          {events.length === 0 ? (
            <EmptyState message="No events scheduled right now." />
          ) : (
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-text">Event Video Request</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {talentUsers.map((talent) => (
              <VideoRequestCard key={talent.id} talent={talent} />
            ))}
          </div>
        </section>

        <HowItWorks />
      </div>
    </AppShell>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-card-border p-8 text-center text-sm text-slate-500">
      {message}
    </div>
  );
}
