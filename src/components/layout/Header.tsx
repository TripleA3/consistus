import Link from "next/link";
import { ChipLink } from "@/components/ui/Chip";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { HeaderAuthActions } from "@/components/layout/HeaderAuthActions";

const primaryNav = [
  { href: "/", label: "fans" },
  { href: "/sign-up", label: "Join as talent" },
  { href: "/community", label: "Community" },
];

const subNav: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/events", label: "Event", icon: "calendar" },
  { href: "/tickets", label: "Tickets", icon: "ticket" },
  { href: "/favorites", label: "Favorites", icon: "heart" },
];

type HeaderProps = {
  activePath?: string;
};

/**
 * Mirrors Figma "Main Header" (node 224:11959): brand row + primary nav on
 * top, subpage nav + search below. The Figma logomark asset couldn't be
 * downloaded in this environment, so the wordmark stands alone — see
 * docs/open-questions.md.
 */
export function Header({ activePath = "/" }: HeaderProps) {
  return (
    <header className="w-full border-b border-border bg-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-8">
        <div className="flex items-center gap-8 sm:gap-20">
          <Link href="/" className="font-display text-xl font-bold text-ink">
            fannero
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
            {primaryNav.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-base font-medium hover:text-ink ${
                  index === 0 ? "text-slate-900" : "text-slate-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <HeaderAuthActions />
        </div>
      </div>
      <div className="hidden border-t border-border md:block">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-8">
          <nav className="flex items-center gap-3" aria-label="Section">
            {subNav.map((item) => (
              <ChipLink
                key={item.href}
                href={item.href}
                variant={activePath === item.href ? "active" : "subtle"}
                icon={item.icon}
              >
                {item.label}
              </ChipLink>
            ))}
          </nav>
          <label className="relative flex w-80 items-center gap-2 rounded-lg border border-input-border bg-white px-3.5 py-2.5 shadow-card">
            <Icon name="search" className="size-5 text-placeholder" />
            <input
              type="search"
              placeholder="Search"
              className="w-full bg-transparent font-display text-base text-ink outline-none placeholder:text-placeholder"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
