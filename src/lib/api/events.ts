import {
  getEventById,
  getEvents,
  getEventsByCategory,
} from "@/lib/mock/events";
import type { EventItem } from "@/lib/types";

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
