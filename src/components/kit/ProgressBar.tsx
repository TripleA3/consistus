type ProgressBarProps = {
  /** 0–100. Values outside the range are clamped. */
  value: number;
  /** Names the bar for screen readers, e.g. "XP to level 4". */
  label: string;
  /** Shows the percentage, or your own text, above the track. */
  caption?: string;
  /** Lime instead of indigo — for XP and challenge progress. */
  accent?: boolean;
  className?: string;
};

/**
 * The fill grows from zero when the bar first scrolls into view (the
 * motion layer reads `data-grow` and the inline width).
 */
export function ProgressBar({
  value,
  label,
  caption,
  accent = false,
  className = "",
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className={className}>
      {caption ? (
        <div className="mb-1.5 flex items-center justify-between gap-2 text-body-md">
          <span className="font-bold text-foreground">{caption}</span>
          <span className="tabular-nums text-muted-foreground">{pct}%</span>
        </div>
      ) : null}

      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 overflow-hidden rounded-pill bg-muted"
      >
        <div
          data-grow
          style={{ width: `${pct}%` }}
          className={`h-full rounded-pill ${accent ? "bg-cta" : "bg-primary"}`}
        />
      </div>
    </div>
  );
}
