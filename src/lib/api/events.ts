"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { events, ticketTiers } from "@/db/schema";
import type { EventCategory, EventItem, TicketTier } from "@/lib/types";

function toTicketTier(row: typeof ticketTiers.$inferSelect): TicketTier {
  return {
    id: row.id,
    eventId: row.eventId,
    name: row.name,
    price: row.price,
    currency: row.currency,
    quantityAvailable: row.quantityAvailable,
    quantitySold: row.quantitySold,
    perks: row.perks,
  };
}

function toEventItem(
  row: typeof events.$inferSelect,
  tiers: (typeof ticketTiers.$inferSelect)[],
): EventItem {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    coverImage: row.coverImage,
    category: row.category as EventCategory,
    venue: row.venue,
    city: row.city,
    address: row.address,
    startsAt: row.startsAt.toISOString(),
    endsAt: row.endsAt.toISOString(),
    hostTalentId: row.hostTalentId,
    organizerName: row.organizerName,
    organizerFollowers: row.organizerFollowers,
    highlights: row.highlights,
    ticketTiers: tiers.map(toTicketTier),
  };
}

async function assembleEvents(eventRows: (typeof events.$inferSelect)[]): Promise<EventItem[]> {
  if (eventRows.length === 0) return [];
  const tierRows = await db.select().from(ticketTiers);
  const tiersByEvent = new Map<string, (typeof ticketTiers.$inferSelect)[]>();
  for (const tier of tierRows) {
    const list = tiersByEvent.get(tier.eventId) ?? [];
    list.push(tier);
    tiersByEvent.set(tier.eventId, list);
  }
  // Oldest first, i.e. creation order — matches the old mock array's fixed
  // seed order; newly created events land at the end rather than the top.
  return eventRows
    .slice()
    .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
    .map((row) => toEventItem(row, tiersByEvent.get(row.id) ?? []));
}

/**
 * Data-access layer for events. Backed by Postgres via Drizzle; callers are
 * unaffected by the storage swap from the earlier in-memory mock.
 */
export async function fetchEvents(): Promise<EventItem[]> {
  return assembleEvents(await db.select().from(events));
}

export async function fetchEventsByCategory(category: string): Promise<EventItem[]> {
  const all = await db.select().from(events);
  const filtered = category === "all" ? all : all.filter((event) => event.category === category);
  return assembleEvents(filtered);
}

export async function fetchEventById(id: string): Promise<EventItem | undefined> {
  const [row] = await db.select().from(events).where(eq(events.id, id));
  if (!row) return undefined;
  const tiers = await db.select().from(ticketTiers).where(eq(ticketTiers.eventId, id));
  return toEventItem(row, tiers);
}

export async function fetchEventsByTalentId(talentId: string): Promise<EventItem[]> {
  const rows = await db.select().from(events).where(eq(events.hostTalentId, talentId));
  return assembleEvents(rows);
}

export type CreateEventInput = {
  title: string;
  description: string;
  category: EventCategory;
  venue: string;
  city: string;
  address: string;
  startsAt: string;
  endsAt: string;
  hostTalentId: string;
  organizerName: string;
  ticketTiers: Omit<TicketTier, "id" | "eventId" | "quantitySold">[];
};

export async function createEvent(input: CreateEventInput): Promise<EventItem> {
  const [created] = await db
    .insert(events)
    .values({
      title: input.title,
      description: input.description,
      coverImage: "",
      category: input.category,
      venue: input.venue,
      city: input.city,
      address: input.address,
      startsAt: new Date(input.startsAt),
      endsAt: new Date(input.endsAt),
      hostTalentId: input.hostTalentId,
      organizerName: input.organizerName,
      organizerFollowers: 0,
      highlights: [],
    })
    .returning();

  // The cover image is a stub asset key keyed by event id (see media
  // placeholder notes in docs/decisions.md) — write it once the row (and
  // its generated id) exists.
  const [withCover] = await db
    .update(events)
    .set({ coverImage: created.id })
    .where(eq(events.id, created.id))
    .returning();

  const tierRows = input.ticketTiers.length
    ? await db
        .insert(ticketTiers)
        .values(
          input.ticketTiers.map((tier) => ({
            eventId: created.id,
            name: tier.name,
            price: tier.price,
            currency: tier.currency,
            quantityAvailable: tier.quantityAvailable,
            perks: tier.perks,
          })),
        )
        .returning()
    : [];

  return toEventItem(withCover, tierRows);
}
