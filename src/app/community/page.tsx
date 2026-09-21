import { AppShell } from "@/components/layout/AppShell";
import { CelebrityCard } from "@/components/home/CelebrityCard";
import { EventCard } from "@/components/home/EventCard";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { fetchTalentUsers } from "@/lib/api/talents";
import { fetchUpcomingEvents } from "@/lib/api/events";
import type { TalentCategory } from "@/lib/types";

/**
 * Reads live counts, so the page can't drift from what's actually on the
 * platform the way a hand-written marketing page would.
 */
export const dynamic = "force-dynamic";

const categoryLabel: Record<TalentCategory, string> = {
  artist: "Artists",
  actor: "Actors",
  comedian: "Comedians",
  techie: "Techies",
  athlete: "Athletes",
  influencer: "Influencers",
};

const pillars: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "video",
    title: "Ask for something personal",
    body: "Commission a birthday shoutout, a pep talk, or a message for someone who'd never expect it.",
  },
  {
    icon: "ticket",
    title: "Be in the room",
    body: "Book tickets to the nights, sets and meetups the people you follow are actually at.",
  },
  {
    icon: "wallet",
    title: "Talent get paid properly",
    body: "Money is released when the fan confirms delivery, and lands straight in the talent's wallet.",
  },
];

const compact = new Intl.NumberFormat("en-US", { notation: "compact" });

export default async function CommunityPage() {
  const [talent, upcoming] = await Promise.all([fetchTalentUsers(), fetchUpcomingEvents()]);

  const reach = talent.reduce((sum, person) => sum + (person.talentProfile?.followerCount ?? 0), 0);

  const categoryCounts = new Map<TalentCategory, number>();
  for (const person of talent) {
    const category = person.talentProfile?.category;
    if (!category) continue;
    categoryCounts.set(category, (categoryCounts.get(category) ?? 0) + 1);
  }

  const stats = [
    { label: "Talent on Fannero", value: compact.format(talent.length) },
    { label: "Upcoming events", value: compact.format(upcoming.length) },
    { label: "Combined following", value: compact.format(reach) },
  ];

  return (
    <AppShell activePath="/community">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-10 sm:px-8">
        <section className="flex flex-col items-center gap-5 rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12">
          <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-medium uppercase tracking-wide">
            The Fannero community
          </span>
          <h1 className="max-w-2xl text-3xl font-bold sm:text-4xl">
            Where fans and the people they follow actually meet
          </h1>
          <p className="max-w-xl text-sm text-white/70 sm:text-base">
            Fannero is built around one idea: getting close to talent shouldn&apos;t mean
            shouting into a comment section. Book them, meet them, hear from them directly.
          </p>
          <div className="mt-2 flex flex-wrap justify-center gap-3">
            <ButtonLink href="/sign-up" variant="accent" className="rounded-full">
              Join as talent
            </ButtonLink>
            <ButtonLink href="/events" variant="outline-light" className="rounded-full">
              Browse events
            </ButtonLink>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-card-border bg-white p-6 text-center"
            >
              <p className="text-3xl font-bold text-text">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </section>

        <section className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="flex flex-col gap-3 rounded-2xl border border-card-border bg-white p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                <Icon name={pillar.icon} className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-text">{pillar.title}</h2>
              <p className="text-sm text-slate-500">{pillar.body}</p>
            </div>
          ))}
        </section>

        {categoryCounts.size > 0 ? (
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-text">Who&apos;s here</h2>
            <div className="flex flex-wrap gap-3">
              {[...categoryCounts.entries()].map(([category, count]) => (
                <span
                  key={category}
                  className="rounded-full border border-card-border bg-white px-4 py-2 text-sm text-text"
                >
                  {categoryLabel[category]}{" "}
                  <span className="font-semibold text-lime-500">{count}</span>
                </span>
              ))}
            </div>
          </section>
        ) : null}

        {talent.length > 0 ? (
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-text">Talent to know</h2>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
              {talent.slice(0, 8).map((person) =>
                person.talentProfile ? (
                  <CelebrityCard
                    key={person.id}
                    talent={person}
                    profile={person.talentProfile}
                  />
                ) : null,
              )}
            </div>
          </section>
        ) : null}

        {upcoming.length > 0 ? (
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold text-text">Coming up</h2>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {upcoming.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="flex flex-col items-center gap-4 rounded-3xl border border-card-border bg-white px-6 py-12 text-center">
          <h2 className="text-2xl font-bold text-text">Got something fans would pay for?</h2>
          <p className="max-w-lg text-sm text-slate-500">
            Set your rates, take the requests you want, host your own events, and get paid
            when the work is confirmed.
          </p>
          <ButtonLink href="/sign-up" variant="accent" className="rounded-full">
            Join as talent
          </ButtonLink>
        </section>
      </div>
    </AppShell>
  );
}
