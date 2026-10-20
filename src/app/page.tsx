import { CalendarBlank, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { Chip, ChipRow, EmptyState, Section } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { HeroPanel } from "@/components/home/HeroPanel";
import { LiveTicker } from "@/components/home/LiveTicker";
import { LevelCard } from "@/components/home/LevelCard";
import { CelebrityCard } from "@/components/cards/CelebrityCard";
import { EventCard } from "@/components/cards/EventCard";
import { fetchEvents } from "@/lib/api/events";
import { fetchTalentUsers } from "@/lib/api/talents";

/** The filter row beside "Top celebrities", per the design. */
const CELEB_FILTERS = ["All", "Music", "Comedy", "Film & TV", "Sports"];

/**
 * Rendered per request, not baked at build time: the home page lists live
 * catalog data (events and talent), so a static snapshot would go stale the
 * moment a talent creates an event. It also keeps `next build` from needing
 * to read the database at all.
 */
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [events, talentUsers] = await Promise.all([fetchEvents(), fetchTalentUsers()]);
  const talents = talentUsers.filter((talent) => talent.talentProfile);

  return (
    <AppShell level={12} points={660} unreadNotifications name="Ada Okafor">
      <HeroPanel name="Ada Okafor" />
      <LiveTicker />

      {/* XP, level and streak aren't on the user record yet — the figures
          below are the design's, and move onto the model with Prisma. */}
      <LevelCard level={12} title="Superfan" xpIntoLevel={340} xpForLevel={1000} streakDays={6} />

      <Section
        title="Top celebrities"
        subtitle="Request a personal video or book them for your event."
        aside={
          <ChipRow label="Filter celebrities by category" className="hidden sm:flex">
            {CELEB_FILTERS.map((label, index) => (
              <Chip key={label} selected={index === 0}>
                {label}
              </Chip>
            ))}
          </ChipRow>
        }
      >
        {talents.length === 0 ? (
          <EmptyState
            icon={<Sparkle size={26} />}
            title="No talent yet"
            body="Celebrities you can book will show up here."
          />
        ) : (
          <div className="grid grid-cols-2 gap-4 min-[700px]:grid-cols-4">
            {talents.map((talent) => (
              <CelebrityCard key={talent.id} talent={talent} profile={talent.talentProfile!} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Don't miss these"
        subtitle="Events happening near you"
        action={{ label: "See all", href: "/events" }}
      >
        {events.length === 0 ? (
          <EmptyState
            icon={<CalendarBlank size={26} />}
            title="No events scheduled"
            body="When something is announced, it lands here first."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
