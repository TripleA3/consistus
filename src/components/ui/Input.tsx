import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  error?: string;
  icon?: IconName;
};

export function Input({
  label,
  hint,
  error,
  icon,
  id,
  className,
  ...props
}: InputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-ink">
          {label}
        </label>
      ) : null}
      <div
        className={`flex items-center gap-2 rounded-lg border bg-white px-3.5 py-2.5 shadow-card transition-colors focus-within:border-accent ${
          error ? "border-danger" : "border-input-border"
        } ${className ?? ""}`}
      >
        {icon ? (
          <Icon name={icon} className="size-5 shrink-0 text-placeholder" />
        ) : null}
        <input
          id={inputId}
          className="w-full flex-1 bg-transparent font-display text-base text-ink outline-none placeholder:text-placeholder"
          aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
          aria-invalid={Boolean(error)}
          {...props}
        />
      </div>
      {hint && !error ? (
        <p id={hintId} className="text-xs text-slate-500">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-xs text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
