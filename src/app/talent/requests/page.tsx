"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { VideoCamera } from "@phosphor-icons/react/dist/ssr";
import { Card, Chip, ChipRow, EmptyState, PageHeader, StatusPill } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchRequestsByTalentId } from "@/lib/api/requests";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import { REQUEST_STATUS_TONE, REQUEST_TYPE_LABEL } from "@/lib/requests/display";
import { money } from "@/lib/format";
import type { RequestStatus, TalentRequest } from "@/lib/types";

const FILTERS: { value: "all" | RequestStatus; label: string }[] = [
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
      <AppShell>
        <p className="py-16 text-center text-body-md text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  return (
    <AppShell name={user.name} avatarUrl={user.avatarUrl}>
      <PageHeader
        title="Requests"
        accent="inbox"
        subtitle="Accept, decline and deliver what fans have asked for."
      />

      <ChipRow label="Filter requests by status" className="mb-4">
        {FILTERS.map((item) => {
          const count =
            item.value === "all"
              ? requests.length
              : requests.filter((r) => r.status === item.value).length;
          return (
            <Chip
              key={item.value}
              selected={filter === item.value}
              onClick={() => setFilter(item.value)}
            >
              {item.label} {count > 0 ? `(${count})` : ""}
            </Chip>
          );
        })}
      </ChipRow>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<VideoCamera size={26} />}
          title="Nothing here"
          body="Requests matching this filter will show up here."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {filtered.map((request) => (
            <li key={request.id}>
              <Link href={`/talent/requests/${request.id}`} className="block">
                <Card className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-title-md">{REQUEST_TYPE_LABEL[request.type]}</p>
                    <p className="line-clamp-1 text-body-md text-muted-foreground">
                      {request.message}
                    </p>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-label-lg tabular-nums">{money(request.amount)}</span>
                    <StatusPill tone={REQUEST_STATUS_TONE[request.status]}>
                      {REQUEST_STATUS_LABEL[request.status]}
                    </StatusPill>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
