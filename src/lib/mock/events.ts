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
    address: "1-5 Water Corporation Rd, Victoria Island, Lagos",
    startsAt: "2026-09-12T18:00:00.000Z",
    endsAt: "2026-09-12T23:00:00.000Z",
    hostTalentId: "talent-1",
    organizerName: "Tech Unite Africa",
    organizerFollowers: 3500,
    highlights: [
      "Live esports tournament with regional teams",
      "Indie demo booths and hands-on stations",
      "Networking mixer with drinks and small bites",
      "A relaxed, no-pressure atmosphere for builders",
    ],
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
    address: "4 Onitolo (Bank) Rd, Ikoyi, Lagos",
    startsAt: "2026-10-03T19:00:00.000Z",
    endsAt: "2026-10-03T22:00:00.000Z",
    hostTalentId: "talent-2",
    organizerName: "Amara Divine",
    organizerFollowers: 542000,
    highlights: [
      "Acoustic set with the full live band",
      "Fan favourites plus two unreleased tracks",
      "Meet-and-greet for table bookings",
      "Complimentary welcome drink on arrival",
    ],
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
    address: "Muri Okunola St, Victoria Island, Lagos",
    startsAt: "2026-09-27T20:00:00.000Z",
    endsAt: "2026-09-28T00:00:00.000Z",
    hostTalentId: "talent-3",
    organizerName: "Kene Obi",
    organizerFollowers: 89000,
    highlights: [
      "Headline stand-up set from Kene Obi",
      "Two supporting acts",
      "Late-night food trucks on site",
      "18+ event, valid ID required",
    ],
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
    address: "9 Osborne Rd, Ikoyi, Lagos",
    startsAt: "2026-09-20T11:00:00.000Z",
    endsAt: "2026-09-20T14:00:00.000Z",
    hostTalentId: "talent-4",
    organizerName: "Zola Marn",
    organizerFollowers: 210000,
    highlights: [
      "Curated brunch menu with vegetarian options",
      "Structured mixer format — no awkward small talk",
      "Gallery walkthrough included",
      "Founders and creatives across sectors",
    ],
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

export function getEventsByHostId(hostTalentId: string): EventItem[] {
  return mockEvents.filter((e) => e.hostTalentId === hostTalentId);
}

export function addEvent(event: EventItem): EventItem {
  mockEvents.unshift(event);
  return event;
}
