"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "@phosphor-icons/react/dist/ssr";
import { NAV_BY_ROLE, isActive } from "@/lib/roles";
import { useRole } from "@/components/shell/useRole";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
import { BrandLogo } from "@/components/kit/BrandLogo";

type TopBarProps = {
  /** Shown on the rewards chip. */
  level?: number;
  points?: number;
  unreadNotifications?: boolean;
  avatarUrl?: string;
  name?: string;
};

export function TopBar({
  level = 1,
  points = 0,
  unreadNotifications = false,
  avatarUrl,
  name = "You",
}: TopBarProps) {
  const pathname = usePathname();
  const { role } = useRole();
  const items = NAV_BY_ROLE[role];

  return (
    <header
      data-header
      className="sticky top-0 z-[var(--z-sticky)] h-14 border-b border-border bg-card shadow-xs sm:h-16"
    >
      <div className="mx-auto flex h-full max-w-[var(--page-max)] items-center gap-3 px-3 sm:px-4">
        <Link href="/" className="shrink-0" aria-label="Fannero home">
          <BrandLogo size={32} />
        </Link>

        {/* Desktop pill nav. The bottom tab bar takes over below 900px. */}
        <nav className="ml-2 hidden items-center gap-1 min-[900px]:flex">
          {items.map((item) => {
            const active = isActive(item, pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-pill
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-2 rounded-pill px-3 py-2 text-[13px] font-bold transition-colors ${
                  active ? "bg-cta text-cta-foreground" : "text-foreground hover:bg-accent"
                }`}
              >
                <Icon size={18} weight={active ? "fill" : "bold"} />
                {/* Labels drop out before the bar gets crowded. */}
                <span className="hidden min-[1080px]:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <Link
            href="/rewards"
            data-pill
            className="hidden items-center gap-2 rounded-pill bg-accent px-2.5 py-1.5 text-accent-foreground min-[900px]:flex"
          >
            <span className="flex size-6 items-center justify-center rounded-full bg-cta text-[11px] font-extrabold text-cta-foreground">
              {level}
            </span>
            <span className="text-[13px] font-bold">
              {points.toLocaleString("en-US")}
              <span className="hidden min-[1180px]:inline"> points</span>
            </span>
          </Link>

          {/* On phones the theme toggle lives in Account → Settings → Appearance. */}
          <span className="hidden min-[600px]:inline-flex">
            <ThemeToggle />
          </span>

          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative flex size-10 items-center justify-center rounded-pill text-foreground hover:bg-accent"
          >
            <Bell size={21} weight="bold" />
            {unreadNotifications ? (
              <span
                aria-label="unread"
                className="absolute right-2 top-2 size-2 rounded-full bg-destructive"
              />
            ) : null}
          </Link>

          <Link href="/account" aria-label="Account" className="shrink-0">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are arbitrary remote hosts
              <img
                src={avatarUrl}
                alt={name}
                className="size-9 rounded-full object-cover"
              />
            ) : (
              <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-[13px] font-extrabold text-secondary-foreground">
                {name.charAt(0).toUpperCase()}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
