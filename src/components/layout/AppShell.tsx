import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileTabBar } from "@/components/layout/MobileTabBar";

type AppShellProps = {
  children: ReactNode;
  activePath?: string;
};

export function AppShell({ children, activePath }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header activePath={activePath} />
      <main className="flex-1 pb-16 md:pb-0">{children}</main>
      <Footer />
      <MobileTabBar activePath={activePath} />
    </div>
  );
}
