"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";

const tools: { href: string; label: string; description: string; icon: IconName }[] = [
  {
    href: "/talent/requests",
    label: "Requests inbox",
    description: "Accept, decline, and deliver fan requests.",
    icon: "video",
  },
  {
    href: "/talent/events/new",
    label: "Create an event",
    description: "List a new event for fans to book tickets to.",
    icon: "calendar",
  },
  {
    href: "/talent/wallet",
    label: "Wallet",
    description: "Track earnings and withdraw to your bank.",
    icon: "wallet",
  },
  {
    href: "/talent/notifications",
    label: "Notifications",
    description: "Requests, payouts, and account activity.",
    icon: "bell",
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
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-12 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text">Welcome back, {user.name.split(" ")[0]}</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your Fannero talent presence.</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((tool) => (
            <div key={tool.href} className="flex flex-col gap-3 rounded-xl border border-card-border bg-white p-5">
              <span className="flex size-10 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                <Icon name={tool.icon} className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-ink">{tool.label}</h2>
              <p className="text-sm text-slate-500">{tool.description}</p>
              <ButtonLink href={tool.href} variant="neutral" size="sm" className="mt-auto justify-center">
                Open
              </ButtonLink>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
