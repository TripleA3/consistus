import type { User } from "@/lib/types";
import { mockTalentUsers } from "@/lib/mock/talents";

/**
 * The one seed account the brief calls for — a user who can sign in and
 * already holds both roles, so the fan and talent experiences are both
 * reachable without a real backend. `AuthContext` is the client-side layer
 * that actually tracks who's "signed in" for this stubbed session.
 */
export const DEMO_USER: User = {
  id: "user-me",
  name: "Ada Eze",
  email: "ada@example.com",
  roles: ["fan", "talent"],
  talentProfile: mockTalentUsers[0].talentProfile,
};

export function hasRole(user: User | null, role: User["roles"][number]): boolean {
  return user?.roles.includes(role) ?? false;
}
