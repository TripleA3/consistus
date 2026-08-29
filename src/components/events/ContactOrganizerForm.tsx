"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type ContactOrganizerFormProps = {
  organizerName: string;
};

export function ContactOrganizerForm({ organizerName }: ContactOrganizerFormProps) {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    if (!message || !email) {
      setError("Please fill in both your message and email.");
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
      setError("Something went wrong sending your message. Please try again.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-[#e5e7eb] p-8 text-center shadow-[0px_0px_80px_0px_rgba(228,232,247,0.4)]">
        <p className="text-xl font-bold text-[#3a3a3a]">Message sent</p>
        <p className="mt-2 text-base text-slate-500">
          {organizerName} will get back to you by email soon.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 rounded-2xl border border-[#e5e7eb] p-6 shadow-[0px_0px_80px_0px_rgba(228,232,247,0.4)] sm:p-8"
    >
      <div className="flex flex-col gap-2">
        <p className="text-xl font-bold text-[#3a3a3a]">Contact Organizer</p>
        <p className="text-base text-black">
          Have any questions? Reach out to the event organizer
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Input name="message" label="Message" placeholder="Type your message here" />
        <Input name="email" type="email" label="Email" placeholder="Enter your email" />
      </div>
      {error ? <p className="text-sm text-danger">{error}</p> : null}
      <Button
        type="submit"
        variant="accent"
        className="w-fit rounded-full"
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
