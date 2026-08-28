import type { EventItem } from "@/lib/types";

export const mockEvents: EventItem[] = [
  {
    id: "event-1",
    title: "Lagos Tech & Gaming Night",
    description:
      "An evening of esports showdowns, indie demos and networking with the region's top builders.",
    coverImage: "event-1",
    category: "tech-and-gaming",
    venue: "Landmark Event Centre",
    city: "Lagos",
    startsAt: "2026-09-12T18:00:00.000Z",
    endsAt: "2026-09-12T23:00:00.000Z",
    hostTalentId: "talent-1",
    ticketTiers: [
      {
        id: "tier-1a",
        eventId: "event-1",
        name: "Regular",
        price: 15000,
        currency: "NGN",
        quantityAvailable: 500,
        quantitySold: 210,
        perks: ["Entry", "Welcome drink"],
      },
      {
        id: "tier-1b",
        eventId: "event-1",
        name: "VIP",
        price: 45000,
        currency: "NGN",
        quantityAvailable: 80,
        quantitySold: 52,
        perks: ["Front row", "Meet & greet", "Merch pack"],
      },
    ],
  },
  {
    id: "event-2",
    title: "Amara Divine Live: Unplugged",
    description:
      "An intimate acoustic set featuring fan favourites and unreleased tracks.",
    coverImage: "event-2",
    category: "concerts",
    venue: "The Wheatbaker Lawn",
    city: "Lagos",
    startsAt: "2026-10-03T19:00:00.000Z",
    endsAt: "2026-10-03T22:00:00.000Z",
    hostTalentId: "talent-2",
    ticketTiers: [
      {
        id: "tier-2a",
        eventId: "event-2",
        name: "General",
        price: 25000,
        currency: "NGN",
        quantityAvailable: 300,
        quantitySold: 288,
        perks: ["Entry"],
      },
      {
        id: "tier-2b",
        eventId: "event-2",
        name: "Table for 4",
        price: 180000,
        currency: "NGN",
        quantityAvailable: 20,
        quantitySold: 14,
        perks: ["Reserved table", "Bottle service", "Signed poster"],
      },
    ],
  },
  {
    id: "event-3",
    title: "Comedy Uncensored ft. Kene Obi",
    description: "A late-night stand-up showcase headlined by Kene Obi.",
    coverImage: "event-3",
    category: "nightlife",
    venue: "Muri Okunola Park",
    city: "Lagos",
    startsAt: "2026-09-27T20:00:00.000Z",
    endsAt: "2026-09-28T00:00:00.000Z",
    hostTalentId: "talent-3",
    ticketTiers: [
      {
        id: "tier-3a",
        eventId: "event-3",
        name: "Regular",
        price: 10000,
        currency: "NGN",
        quantityAvailable: 400,
        quantitySold: 145,
        perks: ["Entry"],
      },
    ],
  },
  {
    id: "event-4",
    title: "Founders & Friends Networking Brunch",
    description:
      "Curated brunch for founders, creatives and the talent who back them.",
    coverImage: "event-4",
    category: "networking",
    venue: "Rele Gallery",
    city: "Lagos",
    startsAt: "2026-09-20T11:00:00.000Z",
    endsAt: "2026-09-20T14:00:00.000Z",
    hostTalentId: "talent-4",
    ticketTiers: [
      {
        id: "tier-4a",
        eventId: "event-4",
        name: "Regular",
        price: 20000,
        currency: "NGN",
        quantityAvailable: 120,
        quantitySold: 40,
        perks: ["Entry", "Brunch"],
      },
    ],
  },
];

export function getEvents(): EventItem[] {
  return mockEvents;
}

export function getEventById(id: string): EventItem | undefined {
  return mockEvents.find((e) => e.id === id);
}

export function getEventsByCategory(category: string): EventItem[] {
  if (category === "all") return mockEvents;
  return mockEvents.filter((e) => e.category === category);
}
