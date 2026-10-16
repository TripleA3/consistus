import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/** Shared shell so inputs, selects and textareas line up exactly. */
const CONTROL =
  "w-full rounded-input border border-input bg-card px-3.5 text-body text-foreground " +
  "placeholder:text-muted-foreground focus-visible:border-ring";

const INVALID = "border-destructive";

type Common = {
  /** Draws the red border and points aria-describedby at Field's message. */
  invalid?: boolean;
};

type InputProps = InputHTMLAttributes<HTMLInputElement> &
  Common & {
    /** Icon or currency symbol inside the left edge. */
    leading?: ReactNode;
    /** Unit, clear button or visibility toggle inside the right edge. */
    trailing?: ReactNode;
  };

export function Input({
  invalid = false,
  leading,
  trailing,
  className = "",
  id,
  ...props
}: InputProps) {
  const field = (
    <input
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={id ? `${id}-message` : undefined}
      className={`${CONTROL} h-12 ${invalid ? INVALID : ""} ${
        leading ? "pl-10" : ""
      } ${trailing ? "pr-10" : ""} ${className}`}
      {...props}
    />
  );

  if (!leading && !trailing) return field;

  return (
    <div className="relative">
      {leading ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground">
          {leading}
        </span>
      ) : null}
      {field}
      {trailing ? (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {trailing}
        </span>
      ) : null}
    </div>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & Common;

export function Textarea({
  invalid = false,
  className = "",
  id,
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <textarea
      id={id}
      rows={rows}
      aria-invalid={invalid || undefined}
      aria-describedby={id ? `${id}-message` : undefined}
      className={`${CONTROL} resize-y py-3 ${invalid ? INVALID : ""} ${className}`}
      {...props}
    />
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & Common;

/**
 * The native select — it gets the platform picker on phones, which beats
 * anything custom for long lists like country or category.
 */
export function Select({ invalid = false, className = "", id, ...props }: SelectProps) {
  return (
    <select
      id={id}
      aria-invalid={invalid || undefined}
      aria-describedby={id ? `${id}-message` : undefined}
      className={`${CONTROL} h-12 appearance-none bg-[length:18px] bg-[right_0.875rem_center] bg-no-repeat pr-10 ${
        invalid ? INVALID : ""
      } ${className}`}
      style={{
        // Inline so the chevron can follow currentColor in both themes.
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%239594b3' stroke-width='3' stroke-linecap='round'><path d='M6 9l6 6 6-6'/></svg>\")",
      }}
      {...props}
    />
  );
}

/**
 * Native date and datetime pickers, for the same reason as Select. Pass
 * `type="datetime-local"` for event start times.
 */
export function DateInput({ type = "date", ...props }: InputProps) {
  return <Input type={type} {...props} />;
}
