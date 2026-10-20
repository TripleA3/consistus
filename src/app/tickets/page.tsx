"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarBlank, MapPin, Ticket as TicketIcon } from "@phosphor-icons/react/dist/ssr";
import { Card, EmptyState, PageHeader, StatusPill } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { CoverPlaceholder } from "@/components/kit";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchOrdersForBuyer } from "@/lib/api/orders";
import { dateTimeLabel, money } from "@/lib/format";
import { eventPhoto } from "@/lib/images";
import type { TicketOrderWithEvent } from "@/lib/types";

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
    <AppShell>
      <PageHeader
        title="My"
        accent="tickets"
        subtitle="Every event you've booked, with the reference for the door."
      />

      {orders === null ? (
        <p className="py-10 text-center text-body-md text-muted-foreground">
          Loading your tickets…
        </p>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={<TicketIcon size={26} />}
          title="No tickets yet"
          body="Tickets you buy show up here, ready to show on the door."
          action={{ label: "Browse events", href: "/events" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {orders.map((order) => {
            const past = new Date(order.event.startsAt).getTime() < now;
            const count = order.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <li key={order.id}>
                <Card flush>
                  <div className="flex gap-3 p-3">
                    <CoverPlaceholder
                      src={eventPhoto(order.event.id)}
                      alt=""
                      seed={order.event.id}
                      className="size-[84px] shrink-0 rounded-md object-cover"
                    >
                      <CalendarBlank size={22} />
                    </CoverPlaceholder>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/events/${order.event.id}`}
                          className="line-clamp-2 text-title-md hover:text-link"
                        >
                          {order.event.title}
                        </Link>
                        <StatusPill tone={past ? "neutral" : "success"}>
                          {past ? "Past" : "Upcoming"}
                        </StatusPill>
                      </div>

                      <p className="mt-1 text-body-md text-muted-foreground">
                        {dateTimeLabel(order.event.startsAt)}
                      </p>
                      <p className="flex items-center gap-1 text-body-md text-muted-foreground">
                        <MapPin size={14} weight="bold" className="shrink-0" />
                        <span className="truncate">
                          {order.event.venue}, {order.event.city}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border px-3 py-2.5">
                    <span className="flex items-center gap-1.5 text-body-md text-muted-foreground">
                      <TicketIcon size={15} weight="bold" />
                      {count} {count === 1 ? "ticket" : "tickets"} ·{" "}
                      <span className="font-mono text-body-sm">{order.reference}</span>
                    </span>
                    <span className="text-label-lg">{money(order.total)}</span>
                  </div>
                </Card>
              </li>
            );
          })}
        </ul>
      )}
    </AppShell>
  );
}
