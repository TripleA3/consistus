import type { ReactNode } from "react";
import { AppShell as Shell } from "@/components/shell/AppShell";

type AppShellProps = {
  children: ReactNode;
  /**
   * The old shell highlighted the active nav item from this prop. The new
   * one reads the pathname itself, so it's accepted and ignored while the
   * screens that still pass it are rebuilt.
   */
  activePath?: string;
};

/**
 * Adapter so every screen still importing the old shell gets the new one:
 * role-aware top bar, frosted bottom tabs and the Create FAB.
 *
 * Screens move to `@/components/shell/AppShell` as they're rebuilt, and
 * this file goes when the last one has.
 */
export function AppShell({ children }: AppShellProps) {
  return <Shell>{children}</Shell>;
}
