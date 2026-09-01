"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProfiles, users } from "@/db/schema";
import { toTalentProfile, toUser } from "@/db/mappers";
import type { TalentProfile, User } from "@/lib/types";

/**
 * Data-access layer for talent. Backed by Postgres via Drizzle; callers are
 * unaffected by the storage swap from the earlier in-memory mock.
 */
export async function fetchTalentUsers(): Promise<User[]> {
  const rows = await db
    .select()
    .from(users)
    .innerJoin(talentProfiles, eq(talentProfiles.userId, users.id));
  return rows.map((row) => toUser(row.users, row.talent_profiles));
}

export async function fetchTalentProfiles(): Promise<TalentProfile[]> {
  const rows = await db.select().from(talentProfiles);
  return rows.map(toTalentProfile);
}

export async function fetchTalentUserById(id: string): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.id, id));
  if (!row) return undefined;
  const [profile] = await db.select().from(talentProfiles).where(eq(talentProfiles.userId, id));
  return toUser(row, profile);
}

export async function updateTalentDirectoryProfile(
  talentId: string,
  patch: Partial<Omit<TalentProfile, "id" | "userId">>,
): Promise<TalentProfile | undefined> {
  const [updated] = await db
    .update(talentProfiles)
    .set(patch)
    .where(eq(talentProfiles.userId, talentId))
    .returning();
  return updated ? toTalentProfile(updated) : undefined;
}
