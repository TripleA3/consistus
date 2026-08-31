import type { User } from "@/lib/types";
import { mockTalentUsers } from "@/lib/mock/talents";

/**
 * The one seed account the brief calls for — a user who can sign in and
 * already holds both roles, so the fan and talent experiences are both
 * reachable without a real backend. `AuthContext` is the client-side layer
 * that actually tracks who's "signed in" for this stubbed session.
 *
 * Deliberately reuses Amara Divine's id/name/talentProfile from the mock
 * talent directory (adding the "fan" role on top): requests fans send to
 * "Amara Divine" need to land in the same account's inbox when it signs in
 * as talent, and a separate id for the demo account would silently orphan
 * them. See docs/decisions.md.
 */
export const DEMO_USER: User = {
  ...mockTalentUsers[1],
  roles: ["fan", "talent"],
};

export function hasRole(user: User | null, role: User["roles"][number]): boolean {
  return user?.roles.includes(role) ?? false;
}
