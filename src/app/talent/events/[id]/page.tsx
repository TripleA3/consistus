"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchEventById } from "@/lib/api/events";
import { availableQuantity } from "@/lib/pricing";
import type { EventItem } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default function TalentEventDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <RequireAuth role="talent">
      <TicketDetailsView paramsPromise={params} />
    </RequireAuth>
  );
}

function TicketDetailsView({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const { user } = useAuth();
  const [event, setEvent] = useState<EventItem | null | undefined>(undefined);

  useEffect(() => {
    fetchEventById(id).then((result) => setEvent(result ?? null));
  }, [id]);

  if (event === undefined || !user) {
    return (
      <AppShell>
        <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  if (event === null || event.hostTalentId !== user.id) {
    notFound();
  }

  const totalRevenue = event.ticketTiers.reduce(
    (sum, tier) => sum + tier.price * tier.quantitySold,
    0,
  );
  const totalSold = event.ticketTiers.reduce((sum, tier) => sum + tier.quantitySold, 0);
  const totalAvailable = event.ticketTiers.reduce((sum, tier) => sum + tier.quantityAvailable, 0);

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
        <div>
          <ButtonLink href="/talent/dashboard" variant="neutral" size="sm" className="mb-4 w-fit gap-2">
            <Icon name="arrow-left" className="size-4" />
            Back to dashboard
          </ButtonLink>
          <h1 className="text-2xl font-bold text-text">{event.title}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {dateFormatter.format(new Date(event.startsAt))} · {event.venue}, {event.city}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Total revenue" value={currencyFormatter.format(totalRevenue)} />
          <StatCard label="Tickets sold" value={`${totalSold} / ${totalAvailable}`} />
          <StatCard
            label="Sell-through"
            value={totalAvailable === 0 ? "—" : `${Math.round((totalSold / totalAvailable) * 100)}%`}
          />
        </div>

        <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <h2 className="text-base font-semibold text-text">Ticket details</h2>
          {event.ticketTiers.map((tier) => {
            const remaining = availableQuantity(tier);
            const percentSold =
              tier.quantityAvailable === 0
                ? 0
                : Math.round((tier.quantitySold / tier.quantityAvailable) * 100);
            return (
              <div key={tier.id} className="flex flex-col gap-2 border-b border-card-border pb-4 last:border-0">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-text">
                    {tier.name} · {currencyFormatter.format(tier.price)}
                  </span>
                  <span className="text-slate-500">
                    {tier.quantitySold} sold · {remaining} left
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-lime-500" style={{ width: `${percentSold}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-card-border bg-white p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-bold text-text">{value}</p>
    </div>
  );
}
