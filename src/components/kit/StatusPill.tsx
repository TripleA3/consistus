import type { ReactNode } from "react";

/**
 * The shared vocabulary for every state badge: order status, request
 * status, challenge state, payout state.
 */
export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

const TONES: Record<StatusTone, string> = {
  neutral: "bg-muted text-muted-foreground",
  info: "bg-secondary text-secondary-foreground",
  success: "bg-success-soft text-success",
  warning: "bg-warning-soft text-warning-foreground",
  danger: "bg-danger-soft text-destructive",
};

export function StatusPill({
  children,
  tone = "neutral",
  leading,
  className = "",
}: {
  children: ReactNode;
  tone?: StatusTone;
  leading?: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 rounded-pill px-2.5 py-1 text-label-sm uppercase tracking-wide ${TONES[tone]} ${className}`}
    >
      {leading}
      {children}
    </span>
  );
}
