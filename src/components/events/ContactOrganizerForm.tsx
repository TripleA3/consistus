"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Button, Card, Field, Input, Textarea } from "@/components/kit";

export function ContactOrganizerForm({ organizerName }: { organizerName: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const message = String(data.get("message") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();

    if (!message || !email) {
      setError("Add your message and email.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setError(null);
    try {
      // No backend yet — simulated round trip through the data-access layer.
      await new Promise((resolve) => setTimeout(resolve, 500));
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("That didn't send. Try again.");
    }
  }

  if (status === "sent") {
    return (
      <Card className="text-center">
        <CheckCircle size={30} weight="fill" className="mx-auto mb-2 text-success" />
        <p className="text-title-md">Message sent</p>
        <p className="mt-1 text-body-md text-muted-foreground">
          {organizerName} will reply by email.
        </p>
      </Card>
    );
  }

  return (
    <Card>
      <h2 className="text-title-md">Contact organiser</h2>
      <p className="mt-0.5 text-body-md text-muted-foreground">
        Questions about the event? Ask {organizerName}.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
        <Field label="Message" htmlFor="contact-message">
          <Textarea
            id="contact-message"
            name="message"
            rows={3}
            placeholder="What would you like to know?"
          />
        </Field>

        <Field label="Email" htmlFor="contact-email">
          <Input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
          />
        </Field>

        {error ? (
          <p role="alert" className="text-body-md text-destructive">
            {error}
          </p>
        ) : null}

        <Button type="submit" block disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Send message"}
        </Button>
      </form>
    </Card>
  );
}
