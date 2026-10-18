"use client";

import { usePathname } from "next/navigation";
import { Stepper } from "@/components/kit";

const STEPS = [
  { key: "tickets", label: "Tickets" },
  { key: "details", label: "Your details" },
  { key: "review", label: "Pay" },
] as const;

export function StepIndicator() {
  const pathname = usePathname();
  const matched = STEPS.findIndex((step) => pathname.includes(`/checkout/${step.key}`));
  // Past the three tracked steps (pay/* or receipt) — show everything done.
  const current = matched === -1 ? STEPS.length : matched;

  return (
    <Stepper
      steps={STEPS.map((step) => step.label)}
      current={current}
      className="mb-[var(--section-gap)]"
    />
  );
}
