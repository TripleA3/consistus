"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Ticket } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, EmptyState, Field, Input } from "@/components/kit";
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
      <EmptyState
        icon={<Ticket size={26} />}
        title="No tickets selected"
        body="Pick at least one ticket to carry on."
        action={{ label: "Choose tickets", href: `/events/${event.id}/checkout/tickets` }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 lg:flex-row lg:items-start">
      <div className="min-w-0 flex-1">
        <Card className="flex flex-col gap-4">
          <Field label="Full name" htmlFor="buyer-name" error={errors.name} required>
            <Input
              id="buyer-name"
              name="name"
              autoComplete="name"
              placeholder="Ada Okafor"
              defaultValue={buyer.name}
              invalid={Boolean(errors.name)}
            />
          </Field>

          <Field label="Email" htmlFor="buyer-email" error={errors.email} required>
            <Input
              id="buyer-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
              defaultValue={buyer.email}
              invalid={Boolean(errors.email)}
            />
          </Field>

          <Field
            label="Phone number"
            htmlFor="buyer-phone"
            error={errors.phone}
            hint="We'll text your ticket reference here."
            required
          >
            <Input
              id="buyer-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="0801 234 5678"
              defaultValue={buyer.phone}
              invalid={Boolean(errors.phone)}
            />
          </Field>
        </Card>

        <div className="mt-4 flex gap-3">
          <ButtonLink
            href={`/events/${event.id}/checkout/tickets`}
            variant="outline"
            size="lg"
            className="bg-card"
          >
            Back
          </ButtonLink>
          <Button type="submit" size="lg" className="flex-1">
            Continue
          </Button>
        </div>
      </div>

      <OrderSummary />
    </form>
  );
}
