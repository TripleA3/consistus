import {
  addEvent,
  getEventById,
  getEvents,
  getEventsByCategory,
} from "@/lib/mock/events";
import type { EventCategory, EventItem, TicketTier } from "@/lib/types";

/**
 * Data-access layer for events. Reads from mock data today; swap the
 * implementation for real network calls without touching callers.
 */
export async function fetchEvents(): Promise<EventItem[]> {
  return getEvents();
}

export async function fetchEventsByCategory(
  category: string,
): Promise<EventItem[]> {
  return getEventsByCategory(category);
}

export async function fetchEventById(
  id: string,
): Promise<EventItem | undefined> {
  return getEventById(id);
}

export async function fetchEventsByTalentId(talentId: string): Promise<EventItem[]> {
  const events = await getEvents();
  return events.filter((event) => event.hostTalentId === talentId);
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
  const id = `event-${Date.now().toString(36)}`;
  const event: EventItem = {
    id,
    title: input.title,
    description: input.description,
    coverImage: id,
    category: input.category,
    venue: input.venue,
    city: input.city,
    address: input.address,
    startsAt: input.startsAt,
    endsAt: input.endsAt,
    hostTalentId: input.hostTalentId,
    organizerName: input.organizerName,
    organizerFollowers: 0,
    highlights: [],
    ticketTiers: input.ticketTiers.map((tier, index) => ({
      ...tier,
      id: `${id}-tier-${index}`,
      eventId: id,
      quantitySold: 0,
    })),
  };
  return addEvent(event);
}
