"use client";

type Option<T extends string> = { value: T; label: string };

type SegmentedProps<T extends string> = {
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  label: string;
  className?: string;
};

/**
 * Two or three mutually exclusive options in one track — used for
 * currency, ticket type and the fan/talent switch on auth screens.
 * For navigating between views of a screen, use Tabs instead.
 */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className = "",
}: SegmentedProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={`inline-flex items-center gap-1 rounded-pill bg-muted p-1 ${className}`}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={`h-9 rounded-pill px-4 text-label-lg transition-colors ${
              selected
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
