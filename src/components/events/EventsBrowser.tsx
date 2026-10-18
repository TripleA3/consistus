"use client";

import { useMemo, useState } from "react";
import { CalendarBlank, MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";
import { Button, Chip, ChipRow, EmptyState, Input } from "@/components/kit";
import { EventCard } from "@/components/cards/EventCard";
import type { EventItem } from "@/lib/types";

const CATEGORIES = [
  { value: "all", label: "All events" },
  { value: "concerts", label: "Concerts" },
  { value: "nightlife", label: "Nightlife" },
  { value: "tech-and-gaming", label: "Tech & gaming" },
  { value: "food-and-drinks", label: "Food & drinks" },
  { value: "networking", label: "Networking" },
];

const PAGE_SIZE = 8;

type EventsBrowserProps = {
  events: EventItem[];
  initialCategory?: string;
};

export function EventsBrowser({ events, initialCategory = "all" }: EventsBrowserProps) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [shown, setShown] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesCategory = category === "all" || event.category === category;
      const matchesQuery =
        needle.length === 0 ||
        event.title.toLowerCase().includes(needle) ||
        event.venue.toLowerCase().includes(needle) ||
        event.city.toLowerCase().includes(needle);
      return matchesCategory && matchesQuery;
    });
  }, [events, category, query]);

  const visible = filtered.slice(0, shown);

  /** Any change to the filters starts the list again from the top. */
  function apply(next: () => void) {
    next();
    setShown(PAGE_SIZE);
  }

  return (
    <>
      <Input
        value={query}
        onChange={(event) => apply(() => setQuery(event.target.value))}
        placeholder="Search events, venues, cities"
        aria-label="Search events"
        leading={<MagnifyingGlass size={18} weight="bold" />}
        className="mb-3"
      />

      <ChipRow label="Filter events by category" className="mb-4">
        {CATEGORIES.map((option) => (
          <Chip
            key={option.value}
            selected={category === option.value}
            onClick={() => apply(() => setCategory(option.value))}
          >
            {option.label}
          </Chip>
        ))}
      </ChipRow>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<CalendarBlank size={26} />}
          title="Nothing matches that"
          body="Try a different category, or clear the search."
        />
      ) : (
        <>
          <p className="mb-3 text-body-md text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "event" : "events"}
          </p>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>

          {shown < filtered.length ? (
            <div className="mt-5 flex justify-center">
              <Button variant="outline" onClick={() => setShown((n) => n + PAGE_SIZE)}>
                Show more
              </Button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
}
