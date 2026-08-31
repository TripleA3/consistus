"use client";

import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";

const steps = [
  { key: "tickets", label: "Select Your Ticket" },
  { key: "details", label: "Secure your spot" },
  { key: "review", label: "Payment Review" },
] as const;

export function StepIndicator() {
  const pathname = usePathname();
  const matchedIndex = steps.findIndex((step) => pathname.includes(`/checkout/${step.key}`));
  // Past the three tracked steps (pay/* or receipt) — show everything done.
  const activeIndex = matchedIndex === -1 ? steps.length : matchedIndex;

  return (
    <ol className="flex items-center justify-center gap-3 sm:gap-6" aria-label="Checkout progress">
      {steps.map((step, index) => {
        const state = index < activeIndex ? "done" : index === activeIndex ? "current" : "upcoming";
        return (
          <li key={step.key} className="flex items-center gap-3 sm:gap-6">
            <div className="flex flex-col items-center gap-2">
              <span
                aria-current={state === "current" ? "step" : undefined}
                className={`flex size-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  state === "upcoming"
                    ? "border-card-border text-slate-400"
                    : "border-lime-500 text-lime-500"
                }`}
              >
                {state === "done" ? <Icon name="check" className="size-4" /> : index + 1}
              </span>
              <span
                className={`text-xs font-medium ${
                  state === "upcoming" ? "text-slate-400" : "text-text"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <div
                aria-hidden="true"
                className={`h-px w-8 border-t border-dashed sm:w-16 ${
                  index < activeIndex ? "border-lime-500" : "border-card-border"
                }`}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
