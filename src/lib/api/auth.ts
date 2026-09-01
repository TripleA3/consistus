"use server";

import { eq } from "drizzle-orm";
import { db } from "@/db";
import { talentProfiles, users } from "@/db/schema";
import { toUser } from "@/db/mappers";
import type { TalentCategory, User, UserRole } from "@/lib/types";

/** The one seed account sign-in always resolves to, per the brief's approved default. */
const DEMO_ACCOUNT_EMAIL = "amara@example.com";

async function loadUserWithProfile(userId: string): Promise<User | undefined> {
  const [row] = await db.select().from(users).where(eq(users.id, userId));
  if (!row) return undefined;
  const [profile] = await db
    .select()
    .from(talentProfiles)
    .where(eq(talentProfiles.userId, userId));
  return toUser(row, profile ?? null);
}

/**
 * No real password check — matches the brief's approved auth default (one
 * account, stubbed session). Always resolves to the seed account regardless
 * of which email/password was entered, and provisions it on first call if
 * the seed script hasn't run yet.
 */
export async function signIn(): Promise<User> {
  const [existing] = await db.select().from(users).where(eq(users.email, DEMO_ACCOUNT_EMAIL));
  if (existing) {
    const user = await loadUserWithProfile(existing.id);
    if (user) return user;
  }

  const [created] = await db
    .insert(users)
    .values({
      name: "Amara Divine",
      email: DEMO_ACCOUNT_EMAIL,
      roles: ["fan", "talent"],
    })
    .returning();

  const [profile] = await db
    .insert(talentProfiles)
    .values({
      userId: created.id,
      category: "artist",
      bio: "Afrobeats vocalist and songwriter. Available for shoutouts, duets and live appearances.",
      verified: false,
      ratePerVideo: 60000,
      ratePerAppearance: 400000,
      followerCount: 542000,
    })
    .returning();

  return toUser(created, profile);
}

export type SignUpInput = {
  name: string;
  email: string;
  role: UserRole;
  talentCategory?: TalentCategory;
  bio?: string;
};

export async function signUp(input: SignUpInput): Promise<User> {
  const [created] = await db
    .insert(users)
    .values({
      name: input.name,
      email: input.email,
      roles: [input.role],
    })
    .returning();

  let profile: typeof talentProfiles.$inferSelect | undefined;
  if (input.role === "talent") {
    [profile] = await db
      .insert(talentProfiles)
      .values({
        userId: created.id,
        category: input.talentCategory ?? "artist",
        bio: input.bio ?? "",
        verified: false,
        ratePerVideo: 20000,
        ratePerAppearance: 100000,
        followerCount: 0,
      })
      .returning();
  }

  return toUser(created, profile ?? null);
}

export async function fetchUserById(userId: string): Promise<User | undefined> {
  return loadUserWithProfile(userId);
}

export async function updateTalentProfile(
  userId: string,
  patch: Partial<{ verified: boolean; bio: string; ratePerVideo: number; ratePerAppearance: number }>,
): Promise<void> {
  await db.update(talentProfiles).set(patch).where(eq(talentProfiles.userId, userId));
}
