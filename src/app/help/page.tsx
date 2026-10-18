import {
  House,
  ShieldCheck,
  Ticket,
  User as UserIcon,
  VideoCamera,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Card, PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";

const CATEGORIES: { title: string; description: string; icon: PhosphorIcon }[] = [
  {
    title: "Getting started",
    description: "Creating an account, choosing fan or talent, and finding your way around.",
    icon: House,
  },
  {
    title: "Tickets & events",
    description: "Buying tickets, payment methods, and what to do if an event changes.",
    icon: Ticket,
  },
  {
    title: "Requests & delivery",
    description: "Booking a video, guest speaker, or appearance, and tracking its status.",
    icon: VideoCamera,
  },
  {
    title: "For talent",
    description: "Creating events, managing requests, and getting verified.",
    icon: UserIcon,
  },
  {
    title: "Wallet & payouts",
    description: "Withdrawing earnings, withdrawal methods, and your PIN.",
    icon: Wallet,
  },
  {
    title: "Account & security",
    description: "Changing your password or email, and keeping your account safe.",
    icon: ShieldCheck,
  },
];

export default function HelpCenterPage() {
  return (
    <AppShell>
      <PageHeader
        title="How can we"
        accent="help?"
        subtitle="Browse a category below, or reach out to support."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((category) => (
          <Card key={category.title}>
            <span className="mb-3 flex size-10 items-center justify-center rounded-pill bg-secondary text-secondary-foreground">
              <category.icon size={20} weight="bold" />
            </span>
            <h2 className="text-title-md">{category.title}</h2>
            <p className="mt-1 text-body-md text-muted-foreground">{category.description}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-4 text-center">
        <p className="text-body-md text-muted-foreground">Still stuck?</p>
        <a
          href="mailto:support@fannero.example"
          className="text-label-lg text-link hover:underline"
        >
          support@fannero.example
        </a>
      </Card>
    </AppShell>
  );
}
