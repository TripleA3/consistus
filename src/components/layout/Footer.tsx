import Link from "next/link";

const columns: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: "Fannero",
    links: [
      { href: "/about", label: "About" },
      { href: "/community", label: "Community" },
      { href: "/sign-up", label: "Join as talent" },
    ],
  },
  {
    title: "For fans",
    links: [
      { href: "/events", label: "Browse events" },
      { href: "/tickets", label: "My tickets" },
      { href: "/requests", label: "My requests" },
      { href: "/favorites", label: "Favorites" },
    ],
  },
  {
    title: "For talent",
    links: [
      { href: "/talent/requests", label: "Requests inbox" },
      { href: "/talent/events/new", label: "Create an event" },
      { href: "/talent/wallet", label: "Wallet" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/help", label: "Help Center" },
      { href: "/terms", label: "Terms of service" },
      { href: "/privacy", label: "Privacy policy" },
    ],
  },
];

/**
 * No canonical footer frame surfaced in the sections reviewed for Phase 1
 * (see docs/open-questions.md) — built to token, revisit if one appears
 * later in the file.
 */
export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-navy text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-8 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <span className="font-display text-xl font-bold">fannero</span>
          <p className="max-w-xs text-sm text-white/60">
            The gateway to unforgettable events — book tickets, commission
            videos, and get closer to the talent you love.
          </p>
        </div>
        {columns.map((column) => (
          <div key={column.title} className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-white/80">{column.title}</h3>
            <ul className="flex flex-col gap-2">
              {column.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-white/60 hover:text-accent">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-xs text-white/50 sm:px-8">
        © {new Date().getFullYear()} Fannero. All rights reserved.
      </div>
    </footer>
  );
}
