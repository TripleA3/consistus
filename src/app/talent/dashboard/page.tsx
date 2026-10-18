"use client";

import {
  Bell,
  CalendarPlus,
  ChartLine,
  VideoCamera,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Card, PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";

const TOOLS: { href: string; label: string; description: string; icon: PhosphorIcon }[] = [
  {
    href: "/talent/requests",
    label: "Requests inbox",
    description: "Accept, decline and deliver fan requests.",
    icon: VideoCamera,
  },
  {
    href: "/talent/events/new",
    label: "Create an event",
    description: "List a new event for fans to book tickets to.",
    icon: CalendarPlus,
  },
  {
    href: "/talent/wallet",
    label: "Wallet",
    description: "Track earnings and withdraw to your bank.",
    icon: Wallet,
  },
  {
    href: "/talent/notifications",
    label: "Notifications",
    description: "Requests, payouts and account activity.",
    icon: Bell,
  },
  {
    href: "/talent/analytics",
    label: "Analytics",
    description: "Earnings, request volume and event performance.",
    icon: ChartLine,
  },
];

export default function TalentDashboardPage() {
  return (
    <RequireAuth role="talent">
      <DashboardView />
    </RequireAuth>
  );
}

function DashboardView() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AppShell name={user.name} avatarUrl={user.avatarUrl}>
      <PageHeader
        title="Welcome back,"
        accent={user.name.split(" ")[0]}
        subtitle="Everything you need to run your Fannero presence."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Card key={tool.href} href={tool.href}>
            <span className="mb-3 flex size-10 items-center justify-center rounded-pill bg-secondary text-secondary-foreground">
              <tool.icon size={20} weight="bold" />
            </span>
            <h2 className="text-title-md">{tool.label}</h2>
            <p className="mt-1 text-body-md text-muted-foreground">{tool.description}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
