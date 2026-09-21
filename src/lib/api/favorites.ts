"use server";

import { and, desc, eq, isNotNull } from "drizzle-orm";
import { db } from "@/db";
import { events, favorites, talentProfiles, ticketTiers, users } from "@/db/schema";
import { toUser } from "@/db/mappers";
import type { EventCategory, EventItem, User } from "@/lib/types";

export type FavoriteIds = { eventIds: string[]; talentIds: string[] };

/** What a fan has saved, as ids — enough to render hearts filled or empty. */
export async function fetchFavoriteIds(userId: string): Promise<FavoriteIds> {
  const rows = await db.select().from(favorites).where(eq(favorites.userId, userId));
  return {
    eventIds: rows.map((row) => row.eventId).filter((id): id is string => id !== null),
    talentIds: rows.map((row) => row.talentId).filter((id): id is string => id !== null),
  };
}

/** Saves or unsaves an event. Returns the state after the toggle. */
export async function toggleFavoriteEvent(userId: string, eventId: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.eventId, eventId)));
  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return false;
  }
  await db.insert(favorites).values({ userId, eventId });
  return true;
}

/** Saves or unsaves a talent. Returns the state after the toggle. */
export async function toggleFavoriteTalent(userId: string, talentId: string): Promise<boolean> {
  const [existing] = await db
    .select()
    .from(favorites)
    .where(and(eq(favorites.userId, userId), eq(favorites.talentId, talentId)));
  if (existing) {
    await db.delete(favorites).where(eq(favorites.id, existing.id));
    return false;
  }
  await db.insert(favorites).values({ userId, talentId });
  return true;
}

export async function fetchFavoriteEvents(userId: string): Promise<EventItem[]> {
  const rows = await db
    .select()
    .from(favorites)
    .innerJoin(events, eq(events.id, favorites.eventId))
    .where(and(eq(favorites.userId, userId), isNotNull(favorites.eventId)))
    .orderBy(desc(favorites.createdAt));
  if (rows.length === 0) return [];

  const tiers = await db.select().from(ticketTiers);
  const tiersByEvent = new Map<string, (typeof ticketTiers.$inferSelect)[]>();
  for (const tier of tiers) {
    const list = tiersByEvent.get(tier.eventId) ?? [];
    list.push(tier);
    tiersByEvent.set(tier.eventId, list);
  }

  return rows.map((row) => ({
    id: row.events.id,
    title: row.events.title,
    description: row.events.description,
    coverImage: row.events.coverImage,
    category: row.events.category as EventCategory,
    venue: row.events.venue,
    city: row.events.city,
    address: row.events.address,
    startsAt: row.events.startsAt.toISOString(),
    endsAt: row.events.endsAt.toISOString(),
    hostTalentId: row.events.hostTalentId,
    organizerName: row.events.organizerName,
    organizerFollowers: row.events.organizerFollowers,
    highlights: row.events.highlights,
    ticketTiers: (tiersByEvent.get(row.events.id) ?? []).map((tier) => ({
      id: tier.id,
      eventId: tier.eventId,
      name: tier.name,
      price: tier.price,
      currency: tier.currency,
      quantityAvailable: tier.quantityAvailable,
      quantitySold: tier.quantitySold,
      perks: tier.perks,
    })),
  }));
}

export async function fetchFavoriteTalent(userId: string): Promise<User[]> {
  const rows = await db
    .select()
    .from(favorites)
    .innerJoin(users, eq(users.id, favorites.talentId))
    .leftJoin(talentProfiles, eq(talentProfiles.userId, users.id))
    .where(and(eq(favorites.userId, userId), isNotNull(favorites.talentId)))
    .orderBy(desc(favorites.createdAt));
  return rows.map((row) => toUser(row.users, row.talent_profiles));
}
