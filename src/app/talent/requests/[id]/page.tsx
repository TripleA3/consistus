"use client";

import { use, useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { applyRequestEvent, fetchRequestById } from "@/lib/api/requests";
import { REQUEST_STATUS_LABEL } from "@/lib/requests/requestStateMachine";
import type { RequestType, TalentRequest } from "@/lib/types";

const typeLabel: Record<RequestType, string> = {
  "personalised-video": "Personalised video",
  "guest-speaker": "Guest speaker",
  "special-appearance": "Special appearance",
  "event-invitation": "Event invitation",
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

export default function TalentRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <RequireAuth role="talent">
      <RequestDetailView paramsPromise={params} />
    </RequireAuth>
  );
}

function RequestDetailView({ paramsPromise }: { paramsPromise: Promise<{ id: string }> }) {
  const { id } = use(paramsPromise);
  const { user } = useAuth();
  const [request, setRequest] = useState<TalentRequest | null | undefined>(undefined);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [deliveryUrl, setDeliveryUrl] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetchRequestById(id).then((result) => setRequest(result ?? null));
  }, [id]);

  if (request === undefined || !user) {
    return (
      <AppShell>
        <p className="mx-auto max-w-2xl px-4 py-16 text-sm text-slate-500 sm:px-8">Loading…</p>
      </AppShell>
    );
  }

  if (request === null || request.talentId !== user.id) {
    notFound();
  }

  async function fire(event: Parameters<typeof applyRequestEvent>[1], extra?: Parameters<typeof applyRequestEvent>[2]) {
    setBusy(true);
    const updated = await applyRequestEvent(request!.id, event, extra);
    setBusy(false);
    if (updated) setRequest(updated);
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-8">
        <ButtonLink href="/talent/requests" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to inbox
        </ButtonLink>

        <div className="rounded-2xl border border-card-border bg-white p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-text">{typeLabel[request.type]}</h1>
            <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-lime-500">
              {REQUEST_STATUS_LABEL[request.status]}
            </span>
          </div>

          <dl className="mt-4 flex flex-col gap-2 text-sm">
            {request.recipientName ? (
              <Row label="For" value={request.recipientName} />
            ) : null}
            {request.occasion ? <Row label="Occasion" value={request.occasion} /> : null}
            {request.dueBy ? (
              <Row label="Date needed" value={dateFormatter.format(new Date(request.dueBy))} />
            ) : null}
            <Row label="Amount" value={currencyFormatter.format(request.amount)} />
          </dl>

          <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm text-text/80">{request.message}</p>
        </div>

        {request.status === "submitted" ? (
          <div className="flex gap-3">
            <Button variant="accent" className="flex-1 justify-center" disabled={busy} onClick={() => fire({ type: "ACCEPT" })}>
              Accept
            </Button>
            <Button variant="neutral" className="flex-1 justify-center" disabled={busy} onClick={() => fire({ type: "DECLINE" })}>
              Decline
            </Button>
          </div>
        ) : null}

        {request.status === "accepted" ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h2 className="text-base font-semibold text-text">Terms</h2>
            <p className="text-sm text-slate-500">
              By starting this request you agree to deliver it by the date needed, or communicate
              with the fan if that changes. Payment is released to your wallet once the fan
              confirms delivery.
            </p>
            <label className="flex items-start gap-2 text-sm text-text">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 accent-lime-500"
              />
              I agree to these terms
            </label>
            <Button
              variant="accent"
              disabled={!termsAccepted || busy}
              onClick={() => fire({ type: "START_WORK" }, { termsAcceptedAt: new Date().toISOString() })}
            >
              Start work
            </Button>
          </div>
        ) : null}

        {request.status === "in-progress" ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h2 className="text-base font-semibold text-text">Deliver</h2>
            <Input
              label="Delivery link"
              placeholder="Paste a link to the finished video or details"
              value={deliveryUrl}
              onChange={(e) => setDeliveryUrl(e.target.value)}
            />
            <Button
              variant="accent"
              disabled={!deliveryUrl || busy}
              onClick={() => fire({ type: "DELIVER" }, { deliveryUrl })}
            >
              Mark as delivered
            </Button>
          </div>
        ) : null}

        {request.status === "delivered" ? (
          <div className="flex flex-col gap-3 rounded-2xl border border-card-border bg-white p-6 text-center">
            <p className="text-sm text-slate-500">
              Delivered — waiting for the fan to confirm receipt before payment is released.
            </p>
            {request.deliveryUrl ? (
              <a href={request.deliveryUrl} className="text-sm font-medium text-lime-500 underline">
                {request.deliveryUrl}
              </a>
            ) : null}
            <Button
              variant="neutral"
              size="sm"
              className="mx-auto"
              disabled={busy}
              onClick={() => fire({ type: "FAN_CONFIRMS" })}
            >
              Simulate fan confirmation
            </Button>
          </div>
        ) : null}

        {request.status === "completed" ? (
          <div className="flex items-center gap-3 rounded-2xl border border-lime-500/30 bg-lime-100/30 p-6">
            <Icon name="check" className="size-5 text-lime-500" />
            <p className="text-sm text-text">Completed — payment has been added to your wallet.</p>
          </div>
        ) : null}

        {request.status === "declined" || request.status === "cancelled" ? (
          <div className="rounded-2xl border border-card-border bg-white p-6 text-sm text-slate-500">
            This request is {REQUEST_STATUS_LABEL[request.status].toLowerCase()}.
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-text">{value}</dd>
    </div>
  );
}
