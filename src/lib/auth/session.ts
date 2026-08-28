import type { User } from "@/lib/types";
import { mockTalentUsers } from "@/lib/mock/talents";

/**
 * Stubbed session. There is one seed account that holds both the fan and
 * talent role, mirroring the brief's approved auth default. Replace with a
 * real provider (NextAuth, Clerk, etc.) without touching call sites — every
 * consumer goes through `getCurrentUser` / `hasRole`.
 */
const currentUser: User = {
  id: "user-me",
  name: "Ada Eze",
  email: "ada@example.com",
  roles: ["fan", "talent"],
  talentProfile: mockTalentUsers[0].talentProfile,
};

export async function getCurrentUser(): Promise<User> {
  return currentUser;
}

export function hasRole(user: User, role: User["roles"][number]): boolean {
  return user.roles.includes(role);
}
