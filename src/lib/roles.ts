import type { Icon } from "@phosphor-icons/react";
import {
  Compass,
  Ticket,
  UsersThree,
  VideoCamera,
  CalendarBlank,
  Wallet,
  QrCode,
} from "@phosphor-icons/react/dist/ssr";

export type Role = "fan" | "talent" | "organizer";

export const ROLES: Role[] = ["fan", "talent", "organizer"];

export type NavItem = {
  href: string;
  label: string;
  icon: Icon;
  /** Marks the tab active for any route beneath it, not just an exact match. */
  match?: (pathname: string) => boolean;
};

const discover: NavItem = {
  href: "/",
  label: "Discover",
  icon: Compass,
  match: (p) => p === "/",
};

/**
 * Tabs per role, in the order the handoff lists them. Talent and organizer
 * get a Create FAB in the centre, so their arrays are split either side of
 * it by the tab bar.
 */
export const NAV_BY_ROLE: Record<Role, NavItem[]> = {
  fan: [
    discover,
    { href: "/events", label: "Events", icon: CalendarBlank },
    { href: "/tickets", label: "Tickets", icon: Ticket },
    { href: "/community", label: "Community", icon: UsersThree },
    { href: "/requests/sent", label: "Requests", icon: VideoCamera },
  ],
  talent: [
    discover,
    { href: "/requests", label: "Requests", icon: VideoCamera },
    { href: "/community", label: "Community", icon: UsersThree },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ],
  organizer: [
    discover,
    {
      href: "/events?tab=hosting",
      label: "Events",
      icon: CalendarBlank,
      match: (p) => p.startsWith("/events"),
    },
    {
      href: "/tickets?mode=scan",
      label: "Check-in",
      icon: QrCode,
      match: (p) => p.startsWith("/tickets"),
    },
    { href: "/wallet", label: "Wallet", icon: Wallet },
  ],
};

/** Only talent and organizer create things, so only they get the FAB. */
export function hasCreateFab(role: Role) {
  return role === "talent" || role === "organizer";
}

export function isActive(item: NavItem, pathname: string) {
  if (item.match) return item.match(pathname);
  const href = item.href.split("?")[0];
  return pathname === href || pathname.startsWith(`${href}/`);
}
