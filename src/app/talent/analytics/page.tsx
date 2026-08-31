"use client";

import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchTransactions } from "@/lib/api/wallet";
import { fetchRequestsByTalentId } from "@/lib/api/requests";
import { fetchEventsByTalentId } from "@/lib/api/events";
import { groupEarningsByMonth } from "@/lib/analytics";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import type { EventItem, RequestStatus, TalentRequest, WalletTransaction } from "@/lib/types";

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const monthFormatter = new Intl.DateTimeFormat("en-GB", { month: "short" });

export default function TalentAnalyticsPage() {
  return (
    <RequireAuth role="talent">
      <AnalyticsView />
    </RequireAuth>
  );
}

function AnalyticsView() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<WalletTransaction[] | null>(null);
  const [requests, setRequests] = useState<TalentRequest[] | null>(null);
  const [events, setEvents] = useState<EventItem[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchTransactions(user.id).then(setTransactions);
    fetchRequestsByTalentId(user.id).then(setRequests);
    fetchEventsByTalentId(user.id).then(setEvents);
  }, [user]);

  if (!user || !transactions || !requests || !events) {
    return (
      <AppShell>
        <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  const monthly = groupEarningsByMonth(transactions, 6);
  const maxMonth = Math.max(1, ...monthly.map((m) => m.total));
  const totalEarned = monthly.reduce((sum, m) => sum + m.total, 0);

  const statusCounts = requests.reduce<Partial<Record<RequestStatus, number>>>((acc, r) => {
    acc[r.status] = (acc[r.status] ?? 0) + 1;
    return acc;
  }, {});
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold text-text">Analytics</h1>

        <section className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <div className="flex items-baseline justify-between">
            <h2 className="text-base font-semibold text-text">Earnings, last 6 months</h2>
            <span className="text-sm text-slate-500">
              {currencyFormatter.format(totalEarned)} total
            </span>
          </div>
          <div className="flex h-40 items-end gap-3">
            {monthly.map((m) => (
              <div key={m.month} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-32 w-full items-end">
                  <div
                    className="w-full rounded-t-md bg-lime-500"
                    style={{ height: `${(m.total / maxMonth) * 100}%` }}
                    title={currencyFormatter.format(m.total)}
                  />
                </div>
                <span className="text-xs text-slate-400">
                  {monthFormatter.format(new Date(`${m.month}-01T00:00:00.000Z`))}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <h2 className="text-base font-semibold text-text">Requests by status</h2>
          {requests.length === 0 ? (
            <p className="text-sm text-slate-500">No requests yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {(Object.entries(statusCounts) as [RequestStatus, number][]).map(([status, count]) => (
                <div key={status} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 text-sm text-slate-500">
                    {REQUEST_STATUS_LABEL[status]}
                  </span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-lime-500"
                      style={{ width: `${(count / maxStatusCount) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right text-sm font-medium text-text">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <h2 className="text-base font-semibold text-text">Event performance</h2>
          {events.length === 0 ? (
            <p className="text-sm text-slate-500">No events yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {events.map((event) => {
                const sold = event.ticketTiers.reduce((sum, t) => sum + t.quantitySold, 0);
                const available = event.ticketTiers.reduce((sum, t) => sum + t.quantityAvailable, 0);
                const revenue = event.ticketTiers.reduce(
                  (sum, t) => sum + t.price * t.quantitySold,
                  0,
                );
                return (
                  <div key={event.id} className="flex items-center justify-between text-sm">
                    <span className="font-medium text-text">{event.title}</span>
                    <span className="text-slate-500">
                      {sold}/{available} sold · {currencyFormatter.format(revenue)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AppShell>
  );
}
