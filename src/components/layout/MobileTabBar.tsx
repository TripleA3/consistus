import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

const tabs: { href: string; label: string; icon: IconName }[] = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/events", label: "Event", icon: "calendar" },
  { href: "/tickets", label: "Tickets", icon: "ticket" },
  { href: "/favorites", label: "Favorites", icon: "heart" },
];

type MobileTabBarProps = {
  activePath?: string;
};

/**
 * No 390px frame for the header/nav was available in the sections reviewed
 * for Phase 1 (see docs/open-questions.md); this adapts the subpage nav
 * chips into a fixed bottom tab bar, a conventional mobile pattern.
 */
export function MobileTabBar({ activePath = "/" }: MobileTabBarProps) {
  return (
    <nav
      aria-label="Section"
      className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-white py-2 md:hidden"
    >
      {tabs.map((tab) => {
        const active = activePath === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-0.5 rounded-md px-3 py-1 text-xs font-medium ${
              active ? "text-ink" : "text-slate-400"
            }`}
          >
            <Icon name={tab.icon} className={`size-5 ${active ? "text-accent" : ""}`} />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
