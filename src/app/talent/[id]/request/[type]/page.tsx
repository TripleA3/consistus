"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchTalentUserById } from "@/lib/api/talents";
import { submitRequest } from "@/lib/api/requests";
import type { RequestType, TalentRequest, User } from "@/lib/types";

const typeConfig: Record<
  RequestType,
  {
    title: string;
    description: string;
    recipientLabel?: string;
    occasionLabel: string;
    occasionPlaceholder: string;
    messageLabel: string;
    messagePlaceholder: string;
    showDueDate: boolean;
    amountEditable: boolean;
    rate: (profile: NonNullable<User["talentProfile"]>) => number;
  }
> = {
  "personalised-video": {
    title: "Request a personalised video",
    description: "A short shoutout, recorded just for you or someone special.",
    recipientLabel: "Who is this for?",
    occasionLabel: "Occasion",
    occasionPlaceholder: "e.g. Birthday, graduation, congratulations",
    messageLabel: "What should they say?",
    messagePlaceholder: "Give as much detail as you can — names, jokes, the vibe you want.",
    showDueDate: false,
    amountEditable: false,
    rate: (profile) => profile.ratePerVideo,
  },
  "guest-speaker": {
    title: "Invite as a guest speaker",
    description: "Bring them in to speak at your event.",
    occasionLabel: "Event name",
    occasionPlaceholder: "e.g. Lagos Founders Summit",
    messageLabel: "Tell them about the event",
    messagePlaceholder: "Audience, topic, format, and anything else that helps them prepare.",
    showDueDate: true,
    amountEditable: true,
    rate: (profile) => profile.ratePerAppearance,
  },
  "special-appearance": {
    title: "Book a special appearance",
    description: "Have them show up in person for your event.",
    occasionLabel: "Occasion",
    occasionPlaceholder: "e.g. Wedding, product launch, private party",
    messageLabel: "Tell them more",
    messagePlaceholder: "Date, venue, expected duration, and what you'd like them to do.",
    showDueDate: true,
    amountEditable: true,
    rate: (profile) => profile.ratePerAppearance,
  },
  "event-invitation": {
    title: "Invite to your event",
    description: "Invite them to attend as a guest of honour.",
    occasionLabel: "Your event",
    occasionPlaceholder: "e.g. Amara's 25th Birthday",
    messageLabel: "Why should they come?",
    messagePlaceholder: "Tell them about the event and why you'd love to have them there.",
    showDueDate: true,
    amountEditable: true,
    rate: (profile) => profile.ratePerAppearance,
  },
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function isRequestType(value: string): value is RequestType {
  return value in typeConfig;
}

export default function RequestPage({
  params,
}: {
  params: Promise<{ id: string; type: string }>;
}) {
  return (
    <RequireAuth>
      <RequestPageInner paramsPromise={params} />
    </RequireAuth>
  );
}

function RequestPageInner({
  paramsPromise,
}: {
  paramsPromise: Promise<{ id: string; type: string }>;
}) {
  const { id, type: rawType } = use(paramsPromise);
  if (!isRequestType(rawType)) {
    notFound();
  }
  const type: RequestType = rawType;

  const { user } = useAuth();
  const [talent, setTalent] = useState<User | null | undefined>(undefined);
  const [submitted, setSubmitted] = useState<TalentRequest | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchTalentUserById(id).then((result) => {
      if (!cancelled) setTalent(result ?? null);
    });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (talent === undefined) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg px-4 py-24 text-center text-sm text-slate-500">
          Loading…
        </div>
      </AppShell>
    );
  }

  if (talent === null || !talent.talentProfile) {
    notFound();
  }

  const config = typeConfig[type];
  const profile = talent.talentProfile;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;
    const data = new FormData(event.currentTarget);
    const message = String(data.get("message") ?? "").trim();
    const occasion = String(data.get("occasion") ?? "").trim();
    const recipientName = String(data.get("recipientName") ?? "").trim();
    const dueBy = String(data.get("dueBy") ?? "").trim();
    const amountRaw = data.get("amount");
    const amount = config.amountEditable ? Number(amountRaw) : config.rate(profile);

    if (!message || !occasion) {
      setError("Fill in the required fields.");
      return;
    }
    if (config.recipientLabel && !recipientName) {
      setError("Fill in the required fields.");
      return;
    }
    if (!amount || amount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    setError(null);
    setSubmitting(true);
    const result = await submitRequest({
      type,
      fanId: user.id,
      talentId: talent!.id,
      message,
      occasion,
      recipientName: recipientName || undefined,
      amount,
      currency: "NGN",
      dueBy: dueBy || undefined,
    });
    setSubmitting(false);
    setSubmitted(result);
  }

  if (submitted) {
    return (
      <AppShell>
        <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-20 text-center sm:px-8">
          <span className="flex size-16 items-center justify-center rounded-full bg-lime-100 text-lime-500">
            <Icon name="check" className="size-8" />
          </span>
          <div>
            <h1 className="text-2xl font-bold text-text">Request sent!</h1>
            <p className="mt-2 text-sm text-slate-500">
              {talent!.name} has been notified. You&apos;ll hear back once they respond.
            </p>
          </div>
          <div className="w-full rounded-2xl border border-card-border bg-white p-6 text-left text-sm">
            <div className="flex items-center justify-between border-b border-dashed border-card-border pb-3">
              <span className="font-semibold text-text">{config.title}</span>
              <span className="rounded-full bg-lime-100 px-2.5 py-1 text-xs font-medium text-lime-500">
                Awaiting response
              </span>
            </div>
            <dl className="flex flex-col gap-2 pt-3">
              <div className="flex justify-between">
                <dt className="text-slate-500">Amount</dt>
                <dd className="font-medium text-text">{currencyFormatter.format(submitted.amount)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Reference</dt>
                <dd className="font-medium text-text">{submitted.id}</dd>
              </div>
            </dl>
          </div>
          <ButtonLink href={`/talent/${talent!.id}`} variant="accent" className="rounded-full">
            Back to profile
          </ButtonLink>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-12 sm:px-8">
        <div className="flex items-center gap-4">
          <ImagePlaceholder id={talent!.id} className="size-14 shrink-0 rounded-full" />
          <div>
            <h1 className="text-xl font-semibold text-text">{config.title}</h1>
            <p className="text-sm text-slate-500">with {talent!.name}</p>
          </div>
        </div>
        <p className="text-sm text-slate-500">{config.description}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
          {config.recipientLabel ? (
            <Input name="recipientName" label={config.recipientLabel} placeholder="e.g. Tolu" required />
          ) : null}
          <Input
            name="occasion"
            label={config.occasionLabel}
            placeholder={config.occasionPlaceholder}
            required
          />
          {config.showDueDate ? (
            <Input name="dueBy" type="date" label="Date needed" required />
          ) : null}
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-ink">{config.messageLabel}</span>
            <textarea
              name="message"
              rows={4}
              placeholder={config.messagePlaceholder}
              required
              className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card outline-none placeholder:text-placeholder"
            />
          </label>

          {config.amountEditable ? (
            <Input
              name="amount"
              type="number"
              min={1}
              label="Your offer"
              defaultValue={config.rate(profile)}
              hint={`${talent!.name}'s usual rate is ${currencyFormatter.format(config.rate(profile))}.`}
            />
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-card-border bg-lime-100/30 px-4 py-3">
              <span className="text-sm font-medium text-text">Price</span>
              <span className="text-lg font-semibold text-text">
                {currencyFormatter.format(config.rate(profile))}
              </span>
            </div>
          )}

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" variant="accent" size="lg" className="rounded-full" disabled={submitting}>
            {submitting ? "Sending…" : "Send request"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
