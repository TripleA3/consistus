"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { EventCard } from "@/components/home/EventCard";
import { CelebrityCard } from "@/components/home/CelebrityCard";
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
    <AppShell activePath="/favorites">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Favorites</h1>
          <p className="mt-1 text-sm text-slate-500">
            The talent and events you&apos;ve saved for later.
          </p>
        </div>

        {loading ? (
          <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-sm text-slate-500">
            Loading your favorites…
          </div>
        ) : isEmpty ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-card-border p-12 text-center">
            <p className="text-sm text-slate-500">
              Nothing saved yet. Tap the heart on any talent or event to keep it here.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ButtonLink href="/" variant="accent" className="rounded-full">
                Discover talent
              </ButtonLink>
              <ButtonLink href="/events" variant="neutral" className="rounded-full">
                Browse events
              </ButtonLink>
            </div>
          </div>
        ) : (
          <>
            {talent.length > 0 ? (
              <section className="flex flex-col gap-5">
                <h2 className="text-xl font-bold text-text">Saved talent</h2>
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-4">
                  {talent.map((person) =>
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

            {events.length > 0 ? (
              <section className="flex flex-col gap-5">
                <h2 className="text-xl font-bold text-text">Saved events</h2>
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>
              </section>
            ) : null}
          </>
        )}
      </div>
    </AppShell>
  );
}
