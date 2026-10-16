import type { ReactNode } from "react";

type FieldProps = {
  label: string;
  /** Ties the label and messages to the control. */
  htmlFor: string;
  children: ReactNode;
  /** Replaces the hint when present, and colours the message red. */
  error?: string;
  hint?: string;
  /** Adds the asterisk and lets the control set aria-required. */
  required?: boolean;
  className?: string;
};

/**
 * Label + control + one message. Every control in the kit expects to sit
 * inside one of these; the message id is `${htmlFor}-message`, which the
 * controls reference with aria-describedby.
 */
export function Field({
  label,
  htmlFor,
  children,
  error,
  hint,
  required = false,
  className = "",
}: FieldProps) {
  const message = error ?? hint;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={htmlFor} className="text-caption font-bold text-foreground">
        {label}
        {required ? (
          <span aria-hidden className="ml-0.5 text-destructive">
            *
          </span>
        ) : null}
      </label>

      {children}

      {message ? (
        <p
          id={`${htmlFor}-message`}
          role={error ? "alert" : undefined}
          className={`text-caption ${error ? "text-destructive" : "text-muted-foreground"}`}
        >
          {message}
        </p>
      ) : null}
    </div>
  );
}
