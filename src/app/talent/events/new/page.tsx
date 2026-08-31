"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { createEvent } from "@/lib/api/events";
import type { EventCategory, User } from "@/lib/types";

const categories: { value: EventCategory; label: string }[] = [
  { value: "concerts", label: "Concerts" },
  { value: "nightlife", label: "Nightlife" },
  { value: "tech-and-gaming", label: "Tech & Gaming" },
  { value: "food-and-drinks", label: "Food & Drinks" },
  { value: "networking", label: "Networking" },
];

type TierDraft = {
  name: string;
  price: string;
  quantityAvailable: string;
};

export default function CreateEventPage() {
  return (
    <RequireAuth role="talent">
      <CreateEventForm />
    </RequireAuth>
  );
}

function CreateEventForm() {
  const { user: maybeUser } = useAuth();
  const router = useRouter();
  const [tiers, setTiers] = useState<TierDraft[]>([
    { name: "Regular", price: "", quantityAvailable: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!maybeUser) return null;
  const user: User = maybeUser;

  function updateTier(index: number, patch: Partial<TierDraft>) {
    setTiers((prev) => prev.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const title = String(data.get("title") ?? "").trim();
    const description = String(data.get("description") ?? "").trim();
    const category = data.get("category") as EventCategory;
    const venue = String(data.get("venue") ?? "").trim();
    const city = String(data.get("city") ?? "").trim();
    const address = String(data.get("address") ?? "").trim();
    const startsAt = String(data.get("startsAt") ?? "");
    const endsAt = String(data.get("endsAt") ?? "");

    if (!title || !description || !venue || !city || !address || !startsAt || !endsAt) {
      setError("Fill in every field above.");
      return;
    }
    const parsedTiers = tiers.map((tier) => ({
      name: tier.name.trim(),
      price: Number(tier.price),
      currency: "NGN",
      quantityAvailable: Number(tier.quantityAvailable),
      perks: [],
    }));
    if (parsedTiers.some((tier) => !tier.name || !tier.price || !tier.quantityAvailable)) {
      setError("Fill in every ticket tier, or remove the incomplete one.");
      return;
    }

    setError(null);
    setSubmitting(true);
    const created = await createEvent({
      title,
      description,
      category,
      venue,
      city,
      address,
      startsAt: new Date(startsAt).toISOString(),
      endsAt: new Date(endsAt).toISOString(),
      hostTalentId: user.id,
      organizerName: user.name,
      ticketTiers: parsedTiers,
    });
    setSubmitting(false);
    router.push(`/talent/events/${created.id}`);
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-10 sm:px-8">
        <h1 className="text-2xl font-bold text-text">Create an event</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
            <Input name="title" label="Event title" placeholder="e.g. Lagos Tech & Gaming Night" required />
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Description</span>
              <textarea
                name="description"
                rows={3}
                required
                placeholder="What's this event about?"
                className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card outline-none placeholder:text-placeholder"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">Category</span>
              <select
                name="category"
                defaultValue="concerts"
                className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="venue" label="Venue" placeholder="e.g. Landmark Event Centre" required />
              <Input name="city" label="City" placeholder="e.g. Lagos" required />
            </div>
            <Input name="address" label="Full address" placeholder="Street address" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input name="startsAt" type="datetime-local" label="Starts" required />
              <Input name="endsAt" type="datetime-local" label="Ends" required />
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text">Ticket tiers</h2>
              <Button
                type="button"
                variant="neutral"
                size="sm"
                onClick={() =>
                  setTiers((prev) => [...prev, { name: "", price: "", quantityAvailable: "" }])
                }
              >
                <Icon name="plus" className="size-4" />
                Add tier
              </Button>
            </div>
            {tiers.map((tier, index) => (
              <div key={index} className="grid gap-3 border-b border-card-border pb-4 last:border-0 sm:grid-cols-[2fr_1fr_1fr_auto]">
                <Input
                  label="Name"
                  value={tier.name}
                  onChange={(e) => updateTier(index, { name: e.target.value })}
                  placeholder="e.g. VIP"
                />
                <Input
                  label="Price (NGN)"
                  type="number"
                  min={0}
                  value={tier.price}
                  onChange={(e) => updateTier(index, { price: e.target.value })}
                />
                <Input
                  label="Quantity"
                  type="number"
                  min={1}
                  value={tier.quantityAvailable}
                  onChange={(e) => updateTier(index, { quantityAvailable: e.target.value })}
                />
                {tiers.length > 1 ? (
                  <button
                    type="button"
                    aria-label="Remove tier"
                    onClick={() => setTiers((prev) => prev.filter((_, i) => i !== index))}
                    className="mt-6 h-fit self-start text-slate-400 hover:text-danger"
                  >
                    <Icon name="close" className="size-5" />
                  </button>
                ) : null}
              </div>
            ))}
          </div>

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" variant="accent" size="lg" className="rounded-full" disabled={submitting}>
            {submitting ? "Publishing…" : "Publish event"}
          </Button>
        </form>
      </div>
    </AppShell>
  );
}
