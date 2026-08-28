import {
  getTalentProfiles,
  getTalentUserById,
  mockTalentUsers,
} from "@/lib/mock/talents";
import type { TalentProfile, User } from "@/lib/types";

/**
 * Data-access layer for talent. Reads from mock data today; swap the
 * implementation for real network calls without touching callers.
 */
export async function fetchTalentUsers(): Promise<User[]> {
  return mockTalentUsers;
}

export async function fetchTalentProfiles(): Promise<TalentProfile[]> {
  return getTalentProfiles();
}

export async function fetchTalentUserById(
  id: string,
): Promise<User | undefined> {
  return getTalentUserById(id);
}
