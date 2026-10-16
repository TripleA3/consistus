import { Check } from "@phosphor-icons/react/dist/ssr";

type StepperProps = {
  /** Short labels, one per step. */
  steps: string[];
  /** Zero-based index of the step being filled in. */
  current: number;
  className?: string;
};

/**
 * The progress rail at the top of the create wizard and checkout. Labels
 * drop out below 480px, leaving the dots and the connector.
 */
export function Stepper({ steps, current, className = "" }: StepperProps) {
  return (
    <ol
      aria-label={`Step ${current + 1} of ${steps.length}`}
      className={`flex items-center ${className}`}
    >
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;

        return (
          <li
            key={step}
            aria-current={active ? "step" : undefined}
            className={`flex items-center gap-2 ${index === steps.length - 1 ? "" : "flex-1"}`}
          >
            <span
              className={`flex size-7 shrink-0 items-center justify-center rounded-pill text-caption font-extrabold ${
                done
                  ? "bg-primary text-primary-foreground"
                  : active
                    ? "bg-cta text-cta-foreground"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {done ? <Check size={15} weight="bold" /> : index + 1}
            </span>

            <span
              className={`hidden shrink-0 text-caption font-bold min-[480px]:inline ${
                active ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {step}
            </span>

            {index === steps.length - 1 ? null : (
              <span
                aria-hidden
                className={`mx-1 h-0.5 min-w-4 flex-1 rounded-pill ${
                  done ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
