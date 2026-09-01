import type { talentProfiles, users } from "@/db/schema";
import type { TalentCategory, TalentProfile, User, UserRole } from "@/lib/types";

export function toTalentProfile(
  profile: typeof talentProfiles.$inferSelect,
): TalentProfile {
  return {
    id: profile.id,
    userId: profile.userId,
    category: profile.category as TalentCategory,
    bio: profile.bio,
    verified: profile.verified,
    ratePerVideo: profile.ratePerVideo,
    ratePerAppearance: profile.ratePerAppearance,
    followerCount: profile.followerCount,
  };
}

export function toUser(
  row: typeof users.$inferSelect,
  profile: typeof talentProfiles.$inferSelect | null | undefined,
): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    avatarUrl: row.avatarUrl ?? undefined,
    roles: row.roles as UserRole[],
    talentProfile: profile ? toTalentProfile(profile) : undefined,
  };
}
