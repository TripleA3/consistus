"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Play, VideoCamera } from "@phosphor-icons/react/dist/ssr";
import { Button, Card, EmptyState, PageHeader, StatusPill } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { applyRequestEvent, fetchRequestsForFan } from "@/lib/api/requests";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import { REQUEST_STATUS_TONE, REQUEST_TYPE_LABEL } from "@/lib/requests/display";
import { dayLabel, money } from "@/lib/format";
import type { TalentRequestWithTalent } from "@/lib/types";

export default function FanRequestsPage() {
  return (
    <RequireAuth>
      <FanRequestsView />
    </RequireAuth>
  );
}

function FanRequestsView() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<TalentRequestWithTalent[] | null>(null);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchRequestsForFan(user.id).then(setRequests);
  }, [user]);

  async function confirmReceipt(requestId: string) {
    if (!user) return;
    setConfirming(requestId);
    try {
      await applyRequestEvent(requestId, { type: "FAN_CONFIRMS" });
      // Re-read rather than patching locally, so the row reflects whatever
      // the state machine actually decided.
      setRequests(await fetchRequestsForFan(user.id));
    } finally {
      setConfirming(null);
    }
  }

  return (
    <AppShell>
      <PageHeader
        title="My"
        accent="requests"
        subtitle="Everything you've asked talent for, and where each one has got to."
      />

      {requests === null ? (
        <p className="py-10 text-center text-body-md text-muted-foreground">
          Loading your requests…
        </p>
      ) : requests.length === 0 ? (
        <EmptyState
          icon={<VideoCamera size={26} />}
          title="No requests yet"
          body="Ask a celebrity for a video or an appearance and it shows up here."
          action={{ label: "Find talent", href: "/" }}
        />
      ) : (
        <ul className="flex flex-col gap-3">
          {requests.map((request) => (
            <li key={request.id}>
              <Card>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-title-md">
                      {REQUEST_TYPE_LABEL[request.type]} ·{" "}
                      <Link href={`/talent/${request.talent.id}`} className="text-link hover:underline">
                        {request.talent.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-body-md text-muted-foreground">
                      Sent {dayLabel(request.createdAt)}
                    </p>
                  </div>
                  <StatusPill tone={REQUEST_STATUS_TONE[request.status]}>
                    {REQUEST_STATUS_LABEL[request.status]}
                  </StatusPill>
                </div>

                <p className="mt-2.5 text-body-md text-muted-foreground">{request.message}</p>

                {request.status === "delivered" ? (
                  <div className="mt-3 rounded-md bg-secondary p-4 text-secondary-foreground">
                    <p className="text-label-lg">
                      {request.talent.name} has delivered your{" "}
                      {REQUEST_TYPE_LABEL[request.type].toLowerCase()}.
                    </p>

                    {request.deliveryUrl ? (
                      <a
                        href={request.deliveryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex items-center gap-1.5 text-body-md font-bold underline"
                      >
                        <Play size={15} weight="fill" />
                        View your delivery
                      </a>
                    ) : null}

                    <p className="mt-2 text-body-md opacity-80">
                      Confirming releases payment to {request.talent.name}.
                    </p>

                    <Button
                      size="sm"
                      className="mt-3"
                      disabled={confirming === request.id}
                      onClick={() => confirmReceipt(request.id)}
                    >
                      {confirming === request.id ? "Confirming…" : "Confirm you received this"}
                    </Button>
                  </div>
                ) : null}

                {request.status === "completed" ? (
                  <p className="mt-2.5 flex flex-wrap items-center gap-1.5 text-body-md text-muted-foreground">
                    <CheckCircle size={16} weight="fill" className="text-success" />
                    You confirmed this delivery.
                    {request.deliveryUrl ? (
                      <a
                        href={request.deliveryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-link underline"
                      >
                        View again
                      </a>
                    ) : null}
                  </p>
                ) : null}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-dashed border-border pt-3">
                  <span className="truncate text-body-md text-muted-foreground">
                    {request.occasion ? `${request.occasion} · ` : ""}
                    {request.recipientName ? `For ${request.recipientName}` : ""}
                  </span>
                  <span className="shrink-0 text-label-lg">{money(request.amount)}</span>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AppShell>
  );
}
