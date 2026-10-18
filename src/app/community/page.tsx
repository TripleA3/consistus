import { Ticket, VideoCamera, Wallet } from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ButtonLink, Card, Chip, ChipRow, Section, StatTile } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { EventCard } from "@/components/cards/EventCard";
import { TalentCard } from "@/components/cards/TalentCard";
import { fetchTalentUsers } from "@/lib/api/talents";
import { fetchUpcomingEvents } from "@/lib/api/events";
import { compact } from "@/lib/format";
import type { TalentCategory } from "@/lib/types";

/**
 * Reads live counts, so the page can't drift from what's actually on the
 * platform the way a hand-written marketing page would.
 */
export const dynamic = "force-dynamic";

const CATEGORY_LABEL: Record<TalentCategory, string> = {
  artist: "Artists",
  actor: "Actors",
  comedian: "Comedians",
  techie: "Techies",
  athlete: "Athletes",
  influencer: "Influencers",
};

const PILLARS: { icon: PhosphorIcon; title: string; body: string }[] = [
  {
    icon: VideoCamera,
    title: "Ask for something personal",
    body: "Commission a birthday shoutout, a pep talk, or a message for someone who'd never expect it.",
  },
  {
    icon: Ticket,
    title: "Be in the room",
    body: "Book tickets to the nights, sets and meetups the people you follow are actually at.",
  },
  {
    icon: Wallet,
    title: "Talent get paid properly",
    body: "Money is released when the fan confirms delivery, and lands straight in the talent's wallet.",
  },
];

export default async function CommunityPage() {
  const [talent, upcoming] = await Promise.all([fetchTalentUsers(), fetchUpcomingEvents()]);

  const reach = talent.reduce((sum, person) => sum + (person.talentProfile?.followerCount ?? 0), 0);

  const categoryCounts = new Map<TalentCategory, number>();
  for (const person of talent) {
    const category = person.talentProfile?.category;
    if (!category) continue;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  return (
    <AppShell>
      {/* The one full-bleed indigo block on the fan side. */}
      <section className="mb-[var(--section-gap)] rounded-xl bg-primary px-6 py-12 text-center text-primary-foreground sm:px-12">
        <p className="text-label-md uppercase tracking-wide opacity-70">The Fannero community</p>
        <h1 className="mx-auto mt-2 max-w-2xl text-headline-lg">
          Where fans and the people they follow{" "}
          <span className="font-accent font-normal italic">actually meet</span>
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-body-lg opacity-80">
          Getting close to talent shouldn&apos;t mean shouting into a comment section. Book
          them, meet them, hear from them directly.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/sign-up">Join as talent</ButtonLink>
          <ButtonLink href="/events" variant="outline" className="border-white/30 text-white">
            Browse events
          </ButtonLink>
        </div>
      </section>

      <section className="mb-[var(--section-gap)] grid grid-cols-3 gap-3">
        <StatTile label="Talent" value={compact(talent.length)} />
        <StatTile label="Upcoming events" value={compact(upcoming.length)} />
        <StatTile label="Combined following" value={compact(reach)} highlight />
      </section>

      <section className="mb-[var(--section-gap)] grid gap-3 sm:grid-cols-3">
        {PILLARS.map((pillar) => (
          <Card key={pillar.title}>
            <span className="mb-3 flex size-10 items-center justify-center rounded-pill bg-secondary text-secondary-foreground">
              <pillar.icon size={20} weight="bold" />
            </span>
            <h2 className="text-title-md">{pillar.title}</h2>
            <p className="mt-1 text-body-md text-muted-foreground">{pillar.body}</p>
          </Card>
        ))}
      </section>

      {categoryCounts.size > 0 ? (
        <Section title="Who's here">
          <ChipRow label="Talent by category">
            {[...categoryCounts.entries()].map(([category, count]) => (
              <Chip
                key={category}
                trailing={
                  <span className="rounded-pill bg-cta px-1.5 text-label-sm text-cta-foreground">
                    {count}
                  </span>
                }
              >
                {CATEGORY_LABEL[category]}
              </Chip>
            ))}
          </ChipRow>
        </Section>
      ) : null}

      {talent.length > 0 ? (
        <Section title="Talent to know">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {talent.slice(0, 8).map((person) =>
              person.talentProfile ? (
                <TalentCard
                  key={person.id}
                  talent={person}
                  profile={person.talentProfile}
                  className="w-full"
                />
              ) : null,
            )}
          </div>
        </Section>
      ) : null}

      {upcoming.length > 0 ? (
        <Section title="Coming up" action={{ label: "See all", href: "/events" }}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {upcoming.slice(0, 8).map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </Section>
      ) : null}

      <Card className="text-center">
        <h2 className="text-title-lg">Got something fans would pay for?</h2>
        <p className="mx-auto mt-1.5 max-w-lg text-body-md text-muted-foreground">
          Set your rates, take the requests you want, host your own events, and get paid when
          the work is confirmed.
        </p>
        <ButtonLink href="/sign-up" className="mt-4">
          Join as talent
        </ButtonLink>
      </Card>
    </AppShell>
  );
}
