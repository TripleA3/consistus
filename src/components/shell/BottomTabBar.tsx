"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { NAV_BY_ROLE, hasCreateFab, isActive, type NavItem } from "@/lib/roles";
import { useRole } from "@/components/shell/useRole";

function Tab({ item, active }: { item: NavItem; active: boolean }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={active ? "page" : undefined}
      className="flex min-w-0 flex-1 flex-col items-center gap-0.5 py-1.5"
    >
      {/* The pill sits behind the icon, not the label. */}
      <span
        className={`flex h-[30px] w-14 items-center justify-center rounded-pill transition-colors ${
          active ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        }`}
      >
        <Icon size={21} weight={active ? "fill" : "bold"} />
      </span>
      <span
        className={`truncate text-[11px] font-bold ${
          active ? "text-foreground" : "text-muted-foreground"
        }`}
      >
        {item.label}
      </span>
    </Link>
  );
}

export function BottomTabBar() {
  const pathname = usePathname();
  const { role } = useRole();
  const items = NAV_BY_ROLE[role];
  const showFab = hasCreateFab(role);

  // Talent and organizer split their tabs either side of the centre FAB.
  const half = Math.ceil(items.length / 2);
  const left = showFab ? items.slice(0, half) : items;
  const right = showFab ? items.slice(half) : [];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border backdrop-blur-[16px] min-[900px]:hidden"
      style={{
        // 92% card so the blur reads through it.
        background: "color-mix(in srgb, var(--card) 92%, transparent)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      <div className="mx-auto flex max-w-[var(--page-max)] items-end">
        {left.map((item) => (
          <Tab key={item.href} item={item} active={isActive(item, pathname)} />
        ))}

        {showFab ? (
          <div className="flex min-w-0 flex-1 justify-center">
            <Link
              href="/create"
              aria-label="Create"
              className="-mt-[22px] flex size-[52px] items-center justify-center rounded-[18px] bg-cta text-cta-foreground shadow-md"
            >
              <Plus size={24} weight="bold" />
            </Link>
          </div>
        ) : null}

        {right.map((item) => (
          <Tab key={item.href} item={item} active={isActive(item, pathname)} />
        ))}
      </div>
    </nav>
  );
}
