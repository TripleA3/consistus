import type { ReactNode } from "react";
import { TopBar } from "@/components/shell/TopBar";
import { BottomTabBar } from "@/components/shell/BottomTabBar";

type AppShellProps = {
  children: ReactNode;
  /** Passed through to the top bar's rewards chip, bell and avatar. */
  level?: number;
  points?: number;
  unreadNotifications?: boolean;
  avatarUrl?: string;
  name?: string;
};

/**
 * The shared frame every screen sits in: top bar on all sizes, bottom tab
 * bar below 900px. Navigation and the Create FAB follow the viewer's role.
 *
 * `main` carries the page gutter and, on phones, bottom padding that clears
 * the tab bar and the home indicator (see tokens/mobile.css).
 */
export function AppShell({ children, ...bar }: AppShellProps) {
  return (
    <>
      <TopBar {...bar} />
      <main className="mx-auto w-full max-w-[var(--page-max)] flex-1 px-[var(--gutter)] pb-10 pt-5">
        {children}
      </main>
      <BottomTabBar />
    </>
  );
}
