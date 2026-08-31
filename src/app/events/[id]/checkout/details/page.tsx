"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button, ButtonLink } from "@/components/ui/Button";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { useCheckout } from "@/lib/checkout/CheckoutContext";

export default function CheckoutDetailsPage() {
  const router = useRouter();
  const { event, buyer, setBuyer, lines } = useCheckout();
  const [errors, setErrors] = useState<Partial<Record<keyof typeof buyer, string>>>({});

  function handleSubmit(formEvent: FormEvent<HTMLFormElement>) {
    formEvent.preventDefault();
    const data = new FormData(formEvent.currentTarget);
    const next = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
    };

    const nextErrors: typeof errors = {};
    if (!next.name) nextErrors.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!next.phone) nextErrors.phone = "Enter a phone number we can reach you on.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setBuyer(next);
    router.push(`/events/${event.id}/checkout/review`);
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-card-border p-12 text-center">
        <p className="text-base text-slate-500">Select at least one ticket to continue.</p>
        <ButtonLink href={`/events/${event.id}/checkout/tickets`} variant="primary">
          Choose tickets
        </ButtonLink>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <h1 className="text-2xl font-semibold text-text">Secure your spot</h1>
      <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
        <div className="flex flex-1 flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
          <Input
            name="name"
            label="Full name"
            placeholder="e.g. Ada Eze"
            defaultValue={buyer.name}
            error={errors.name}
          />
          <Input
            name="email"
            type="email"
            label="Email"
            placeholder="you@example.com"
            defaultValue={buyer.email}
            error={errors.email}
          />
          <Input
            name="phone"
            type="tel"
            label="Phone number"
            placeholder="e.g. 0801 234 5678"
            defaultValue={buyer.phone}
            error={errors.phone}
          />
        </div>
        <OrderSummary />
      </div>
      <div className="flex items-center justify-between">
        <ButtonLink href={`/events/${event.id}/checkout/tickets`} variant="neutral">
          Back
        </ButtonLink>
        <Button type="submit" variant="accent" size="lg" className="rounded-full">
          Continue
        </Button>
      </div>
    </form>
  );
}
