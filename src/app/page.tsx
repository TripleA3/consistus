import { CalendarBlank, Sparkle, VideoCamera } from "@phosphor-icons/react/dist/ssr";
import {
  ButtonLink,
  Chip,
  ChipRow,
  EmptyState,
  PageHeader,
  Section,
} from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { EventCard } from "@/components/cards/EventCard";
import { TalentCard } from "@/components/cards/TalentCard";
import { fetchEvents } from "@/lib/api/events";
import { fetchTalentUsers } from "@/lib/api/talents";

const TALENT_CATEGORIES = [
  { value: "all", label: "All" },
  { value: "artist", label: "Artists" },
  { value: "actor", label: "Actors" },
  { value: "comedian", label: "Comedians" },
  { value: "techie", label: "Techies" },
  { value: "athlete", label: "Athletes" },
];

const EVENT_CATEGORIES = [
  { value: "all", label: "All events" },
  { value: "concerts", label: "Concerts" },
  { value: "nightlife", label: "Nightlife" },
  { value: "tech-and-gaming", label: "Tech & gaming" },
  { value: "food-and-drinks", label: "Food & drinks" },
  { value: "networking", label: "Networking" },
];

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
    <AppShell>
      <PageHeader
        title="Find your"
        accent="people"
        subtitle="Book a shoutout, grab a ticket, show up."
      />

      <Section
        title="Top celebrities"
        subtitle="Book a video or an appearance"
      >
        <ChipRow label="Filter talent by category" className="mb-3.5">
          {TALENT_CATEGORIES.map((category, index) => (
            <Chip key={category.value} selected={index === 0}>
              {category.label}
            </Chip>
          ))}
        </ChipRow>

        {talents.length === 0 ? (
          <EmptyState
            icon={<Sparkle size={26} />}
            title="No talent yet"
            body="Celebrities you can book will show up here."
          />
        ) : (
          // -gutter margins let the rail run to the screen edge on a phone.
          <div className="-mx-[var(--gutter)] flex gap-3 overflow-x-auto px-[var(--gutter)] pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {talents.map((talent) => (
              <TalentCard key={talent.id} talent={talent} profile={talent.talentProfile!} />
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Don't miss these"
        subtitle="Events happening near you"
        action={{ label: "See all", href: "/events" }}
      >
        <ChipRow label="Filter events by category" className="mb-3.5">
          {EVENT_CATEGORIES.map((category, index) => (
            <Chip key={category.value} selected={index === 0}>
              {category.label}
            </Chip>
          ))}
        </ChipRow>

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

      <Section title="Request a video" subtitle="A personal message, from them to you">
        {talents.length === 0 ? (
          <EmptyState
            icon={<VideoCamera size={26} />}
            title="Nobody taking requests yet"
            body="Personalised videos open up as talent join."
          />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {talents.slice(0, 8).map((talent) => (
              <ButtonLink
                key={talent.id}
                href={`/talent/${talent.id}/request/video`}
                variant="outline"
                size="lg"
                className="justify-between bg-card px-4"
                trailing={<VideoCamera size={18} weight="bold" />}
              >
                <span className="truncate">{talent.name}</span>
              </ButtonLink>
            ))}
          </div>
        )}
      </Section>
    </AppShell>
  );
}
