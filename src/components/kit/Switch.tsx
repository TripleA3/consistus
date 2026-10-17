"use client";

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Visible label, rendered to the left of the track. */
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
};

/**
 * A labelled row with the toggle on the right — the shape every settings
 * and notification-preference row uses.
 */
export function Switch({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  className = "",
}: SwitchProps) {
  return (
    <label
      className={`flex items-center justify-between gap-4 ${
        disabled ? "opacity-45" : "cursor-pointer"
      } ${className}`}
    >
      <span className="min-w-0">
        <span className="block text-body-lg font-bold text-foreground">{label}</span>
        {description ? (
          <span className="mt-0.5 block text-body-md text-muted-foreground">{description}</span>
        ) : null}
      </span>

      {/* The track is the positioning context; the real checkbox covers it
          so focus, keyboard and the label association stay the browser's. */}
      <span className="relative block h-7 w-12 shrink-0">
        <input
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => onChange(event.target.checked)}
          className="peer absolute inset-0 z-10 m-0 size-full cursor-[inherit] appearance-none rounded-pill"
        />
        <span
          aria-hidden
          className={`absolute inset-0 rounded-pill transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--ring)] ${
            checked ? "bg-primary" : "bg-input"
          }`}
        />
        <span
          aria-hidden
          className={`absolute top-1 size-5 rounded-full bg-white shadow-xs transition-[left] duration-200 ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </label>
  );
}
