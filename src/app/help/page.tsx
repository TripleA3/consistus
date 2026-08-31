import { AppShell } from "@/components/layout/AppShell";
import { Icon, type IconName } from "@/components/ui/Icon";

const categories: { title: string; description: string; icon: IconName }[] = [
  {
    title: "Getting started",
    description: "Creating an account, choosing fan or talent, and finding your way around.",
    icon: "home",
  },
  {
    title: "Tickets & events",
    description: "Buying tickets, payment methods, and what to do if an event changes.",
    icon: "ticket",
  },
  {
    title: "Requests & delivery",
    description: "Booking a video, guest speaker, or appearance, and tracking its status.",
    icon: "video",
  },
  {
    title: "For talent",
    description: "Creating events, managing requests, and getting verified.",
    icon: "user",
  },
  {
    title: "Wallet & payouts",
    description: "Withdrawing earnings, withdrawal methods, and your PIN.",
    icon: "wallet",
  },
  {
    title: "Account & security",
    description: "Changing your password or email, and keeping your account safe.",
    icon: "shield",
  },
];

/** Mirrors the Figma "Help Center - Categories" frame (node 3979:34387, Desktop 120). */
export default function HelpCenterPage() {
  return (
    <AppShell>
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">How can we help?</h1>
          <p className="mt-1 text-sm text-slate-500">
            Browse a category below, or reach out to support.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <div
              key={category.title}
              className="flex flex-col gap-3 rounded-xl border border-card-border bg-white p-5"
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                <Icon name={category.icon} className="size-5" />
              </span>
              <h2 className="text-base font-semibold text-ink">{category.title}</h2>
              <p className="text-sm text-slate-500">{category.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-2xl border border-card-border bg-white p-6 text-center">
          <p className="text-sm text-slate-500">Still stuck?</p>
          <a href="mailto:support@fannero.example" className="text-sm font-medium text-lime-500">
            support@fannero.example
          </a>
        </div>
      </div>
    </AppShell>
  );
}
