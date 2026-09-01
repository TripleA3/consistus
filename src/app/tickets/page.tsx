"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchOrdersForBuyer } from "@/lib/api/orders";
import type { TicketOrderWithEvent } from "@/lib/types";

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

export default function TicketsPage() {
  return (
    <RequireAuth>
      <TicketsView />
    </RequireAuth>
  );
}

function TicketsView() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<TicketOrderWithEvent[] | null>(null);
  // Captured when the list loads rather than read during render, which
  // would make rendering impure (and the past/upcoming split jitter).
  const [now, setNow] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchOrdersForBuyer(user.id, user.email).then((result) => {
      setOrders(result);
      setNow(Date.now());
    });
  }, [user]);

  return (
    <AppShell activePath="/tickets">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text">My tickets</h1>
          <p className="mt-1 text-sm text-slate-500">
            Every event you&apos;ve booked, with the reference to show on the door.
          </p>
        </div>

        {orders === null ? (
          <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-sm text-slate-500">
            Loading your tickets…
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-card-border p-10 text-center">
            <p className="text-sm text-slate-500">You haven&apos;t booked any events yet.</p>
            <ButtonLink href="/events" variant="accent" className="rounded-full">
              Browse events
            </ButtonLink>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((order) => {
              const isPast = new Date(order.event.startsAt).getTime() < now;
              const ticketCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <li
                  key={order.id}
                  className="overflow-hidden rounded-2xl border border-card-border bg-white"
                >
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <ImagePlaceholder
                      id={order.event.coverImage}
                      className="h-32 w-full shrink-0 sm:h-auto sm:w-40"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-4 sm:py-4 sm:pl-0 sm:pr-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Link
                            href={`/events/${order.event.id}`}
                            className="text-base font-semibold text-text hover:text-lime-500"
                          >
                            {order.event.title}
                          </Link>
                          <p className="mt-0.5 text-sm text-slate-500">
                            {dateFormatter.format(new Date(order.event.startsAt))}
                          </p>
                          <p className="text-sm text-slate-500">
                            {order.event.venue}, {order.event.city}
                          </p>
                        </div>
                        <span
                          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                            isPast ? "bg-slate-100 text-slate-500" : "bg-lime-100 text-lime-500"
                          }`}
                        >
                          {isPast ? "Past" : "Upcoming"}
                        </span>
                      </div>

                      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        {order.items.map((item) => (
                          <li key={item.id}>
                            {item.tierName} &times;{item.quantity}
                          </li>
                        ))}
                      </ul>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-card-border pt-3 text-sm">
                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Icon name="ticket" className="size-4" />
                          {ticketCount} {ticketCount === 1 ? "ticket" : "tickets"} ·{" "}
                          <span className="font-mono text-xs">{order.reference}</span>
                        </span>
                        <span className="font-semibold text-text">
                          {currencyFormatter(order.currency).format(order.total)}
                        </span>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
