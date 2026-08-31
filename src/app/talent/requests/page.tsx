"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Chip } from "@/components/ui/Chip";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchRequestsByTalentId } from "@/lib/api/requests";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import type { RequestStatus, RequestType, TalentRequest } from "@/lib/types";

const typeLabel: Record<RequestType, string> = {
  "personalised-video": "Personalised video",
  "guest-speaker": "Guest speaker",
  "special-appearance": "Special appearance",
  "event-invitation": "Event invitation",
};

const statusTone: Record<RequestStatus, string> = {
  draft: "bg-slate-100 text-slate-500",
  submitted: "bg-lime-100 text-lime-500",
  accepted: "bg-sky-100 text-sky-600",
  declined: "bg-red-100 text-danger",
  "in-progress": "bg-amber-100 text-warning",
  delivered: "bg-violet-100 text-violet-600",
  completed: "bg-lime-100 text-lime-500",
  cancelled: "bg-slate-100 text-slate-500",
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const filters: { value: "all" | RequestStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "submitted", label: "New" },
  { value: "accepted", label: "Accepted" },
  { value: "in-progress", label: "In progress" },
  { value: "delivered", label: "Delivered" },
  { value: "completed", label: "Completed" },
];

export default function TalentRequestsPage() {
  return (
    <RequireAuth role="talent">
      <RequestsInboxView />
    </RequireAuth>
  );
}

function RequestsInboxView() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TalentRequest[] | null>(null);
  const [filter, setFilter] = useState<"all" | RequestStatus>("all");

  useEffect(() => {
    if (!user) return;
    fetchRequestsByTalentId(user.id).then(setRequests);
  }, [user]);

  const filtered = useMemo(() => {
    if (!requests) return [];
    return filter === "all" ? requests : requests.filter((r) => r.status === filter);
  }, [requests, filter]);

  if (!user || requests === null) {
    return (
      <AppShell activePath="/">
        <p className="mx-auto max-w-3xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold text-text">Requests inbox</h1>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <Chip
              key={item.value}
              variant={filter === item.value ? "active" : "filled"}
              onClick={() => setFilter(item.value)}
            >
              {item.label}
            </Chip>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-sm text-slate-500">
            No requests here yet.
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((request) => (
              <li key={request.id}>
                <Link
                  href={`/talent/requests/${request.id}`}
                  className="flex items-center justify-between gap-4 rounded-xl border border-card-border bg-white p-4 hover:border-lime-500"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">{typeLabel[request.type]}</p>
                    <p className="mt-0.5 line-clamp-1 text-sm text-slate-500">{request.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-text">
                      {currencyFormatter.format(request.amount)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusTone[request.status]}`}
                    >
                      {REQUEST_STATUS_LABEL[request.status]}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
