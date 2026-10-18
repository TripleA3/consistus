"use client";

import { useEffect, useState } from "react";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { EmptyState, PageHeader, Section } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { EventCard } from "@/components/cards/EventCard";
import { TalentCard } from "@/components/cards/TalentCard";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchFavoriteEvents, fetchFavoriteTalent } from "@/lib/api/favorites";
import type { EventItem, User } from "@/lib/types";

export default function FavoritesPage() {
  return (
    <RequireAuth>
      <FavoritesView />
    </RequireAuth>
  );
}

function FavoritesView() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [talent, setTalent] = useState<User[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchFavoriteEvents(user.id).then(setEvents);
    fetchFavoriteTalent(user.id).then(setTalent);
  }, [user]);

  const loading = events === null || talent === null;
  const isEmpty = !loading && events.length === 0 && talent.length === 0;

  return (
    <AppShell>
      <PageHeader
        title="Saved"
        accent="for later"
        subtitle="The talent and events you've kept."
      />

      {loading ? (
        <p className="py-10 text-center text-body-md text-muted-foreground">
          Loading your favourites…
        </p>
      ) : isEmpty ? (
        <EmptyState
          icon={<Heart size={26} />}
          title="Nothing saved yet"
          body="Tap the heart on any talent or event and it stays here."
          action={{ label: "Browse events", href: "/events" }}
        />
      ) : (
        <>
          {talent.length > 0 ? (
            <Section title="Saved talent">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {talent.map((person) =>
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

          {events.length > 0 ? (
            <Section title="Saved events">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </Section>
          ) : null}
        </>
      )}
    </AppShell>
  );
}
