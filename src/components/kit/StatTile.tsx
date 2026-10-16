import type { ReactNode } from "react";

type StatTileProps = {
  label: string;
  /**
   * The number as it should read — "₦45,000", "12", "4.9". The motion
   * layer counts it up on first view, keeping any prefix and suffix.
   */
  value: string;
  icon?: ReactNode;
  /** A small delta or note under the value. */
  note?: string;
  /** Lime fill, for the one figure that matters most on the screen. */
  highlight?: boolean;
  className?: string;
};

/** One figure in a row of two to four. */
export function StatTile({
  label,
  value,
  icon,
  note,
  highlight = false,
  className = "",
}: StatTileProps) {
  return (
    <div
      className={`rounded-tile p-4 ${
        highlight ? "bg-cta text-cta-foreground" : "bg-card text-card-foreground shadow-xs"
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span
          className={`text-caption font-bold ${
            highlight ? "opacity-70" : "text-muted-foreground"
          }`}
        >
          {label}
        </span>
        {icon ? <span className={highlight ? "opacity-70" : "text-muted-foreground"}>{icon}</span> : null}
      </div>

      <p data-count className="mt-1.5 text-headline-sm font-extrabold tabular-nums">
        {value}
      </p>

      {note ? (
        <p className={`mt-0.5 text-caption ${highlight ? "opacity-70" : "text-muted-foreground"}`}>
          {note}
        </p>
      ) : null}
    </div>
  );
}
