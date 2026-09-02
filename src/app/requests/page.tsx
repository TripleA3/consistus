"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { applyRequestEvent, fetchRequestsForFan } from "@/lib/api/requests";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import type { RequestStatus, RequestType, TalentRequestWithTalent } from "@/lib/types";

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

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const currencyFormatter = (currency: string) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 0 });

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
    <AppShell activePath="/requests">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-10 sm:px-8">
        <div>
          <h1 className="text-2xl font-bold text-text">My requests</h1>
          <p className="mt-1 text-sm text-slate-500">
            Everything you&apos;ve asked talent for, and where each one has got to.
          </p>
        </div>

        {requests === null ? (
          <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-sm text-slate-500">
            Loading your requests…
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-card-border p-10 text-center">
            <p className="text-sm text-slate-500">You haven&apos;t made any requests yet.</p>
            <ButtonLink href="/" variant="accent" className="rounded-full">
              Find talent
            </ButtonLink>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {requests.map((request) => (
              <li
                key={request.id}
                className="flex flex-col gap-3 rounded-2xl border border-card-border bg-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-text">
                      {typeLabel[request.type]} ·{" "}
                      <Link
                        href={`/talent/${request.talent.id}`}
                        className="text-lime-500 hover:underline"
                      >
                        {request.talent.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Sent {dateFormatter.format(new Date(request.createdAt))}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${statusTone[request.status]}`}
                  >
                    {REQUEST_STATUS_LABEL[request.status]}
                  </span>
                </div>

                <p className="text-sm text-slate-500">{request.message}</p>

                {request.status === "delivered" ? (
                  <div className="flex flex-col gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
                    <p className="text-sm font-medium text-text">
                      {request.talent.name} has delivered your {typeLabel[request.type].toLowerCase()}.
                    </p>
                    {request.deliveryUrl ? (
                      <a
                        href={request.deliveryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-sm font-medium text-lime-500 underline"
                      >
                        <Icon name="play" className="size-4" />
                        View your delivery
                      </a>
                    ) : null}
                    <p className="text-xs text-slate-500">
                      Confirming releases payment to {request.talent.name}.
                    </p>
                    <Button
                      variant="accent"
                      size="sm"
                      className="w-fit rounded-full"
                      disabled={confirming === request.id}
                      onClick={() => confirmReceipt(request.id)}
                    >
                      {confirming === request.id ? "Confirming…" : "Confirm you received this"}
                    </Button>
                  </div>
                ) : null}

                {request.status === "completed" ? (
                  <p className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon name="check" className="size-4 text-lime-500" />
                    You confirmed this delivery.
                    {request.deliveryUrl ? (
                      <a
                        href={request.deliveryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-lime-500 underline"
                      >
                        View again
                      </a>
                    ) : null}
                  </p>
                ) : null}

                <div className="flex items-center justify-between border-t border-dashed border-card-border pt-3 text-sm">
                  <span className="text-slate-500">
                    {request.occasion ? `${request.occasion} · ` : ""}
                    {request.recipientName ? `For ${request.recipientName}` : " "}
                  </span>
                  <span className="font-semibold text-text">
                    {currencyFormatter(request.currency).format(request.amount)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppShell>
  );
}
