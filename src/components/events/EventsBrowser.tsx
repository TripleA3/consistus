"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { EventSearchCard } from "@/components/events/EventSearchCard";
import { FilterPanel } from "@/components/events/FilterPanel";
import type { EventItem } from "@/lib/types";

const categories = [
  { value: "all", label: "All Events" },
  { value: "concerts", label: "Concerts" },
  { value: "nightlife", label: "Nightlife" },
  { value: "tech-and-gaming", label: "Tech & Gaming" },
  { value: "food-and-drinks", label: "Food & Drinks" },
  { value: "networking", label: "Networking" },
];

const categoryTitle: Record<string, string> = {
  all: "All Events",
  concerts: "Concerts",
  nightlife: "NightLife Events",
  "tech-and-gaming": "Tech & Gaming Events",
  "food-and-drinks": "Food & Drinks Events",
  networking: "Networking Events",
};

const PAGE_SIZE = 6;

type EventsBrowserProps = {
  events: EventItem[];
  initialCategory?: string;
};

export function EventsBrowser({ events, initialCategory = "all" }: EventsBrowserProps) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return events.filter((event) => {
      const matchesCategory = category === "all" || event.category === category;
      const matchesQuery =
        query.trim().length === 0 ||
        event.title.toLowerCase().includes(query.trim().toLowerCase()) ||
        event.venue.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [events, category, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-semibold text-text">
          {categoryTitle[category] ?? "Events"}
        </h1>
        <label className="flex w-full items-center gap-2 rounded-lg border border-input-border bg-white px-3.5 py-2.5 shadow-card sm:w-96">
          <Icon name="search" className="size-5 text-placeholder" />
          <input
            type="search"
            placeholder="Search"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            className="w-full bg-transparent font-display text-base text-ink outline-none placeholder:text-placeholder"
          />
        </label>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex-1">
          {paged.length === 0 ? (
            <div className="rounded-xl border border-dashed border-card-border p-12 text-center text-sm text-slate-500">
              No events match your search. Try a different category or keyword.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {paged.map((event) => (
                <EventSearchCard key={event.id} event={event} />
              ))}
            </div>
          )}

          {pageCount > 1 ? (
            <nav
              aria-label="Pagination"
              className="mt-10 flex items-center justify-center gap-6"
            >
              <button
                type="button"
                aria-label="Previous page"
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex size-10 items-center justify-center rounded-full border border-card-border disabled:opacity-40"
              >
                <Icon name="chevron-left" className="size-5" />
              </button>
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage}
                  className={`text-lg font-semibold ${
                    n === currentPage ? "text-lime-500 underline" : "text-text"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                aria-label="Next page"
                disabled={currentPage === pageCount}
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                className="flex size-10 items-center justify-center rounded-full border border-card-border disabled:opacity-40"
              >
                <Icon name="chevron-right" className="size-5" />
              </button>
            </nav>
          ) : null}
        </div>

        <FilterPanel
          categories={categories}
          activeCategory={category}
          onCategoryChange={(value) => {
            setCategory(value);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
