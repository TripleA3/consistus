import type { HTMLAttributes } from "react";

/**
 * Mirrors the Figma "_Shadow card" component used for celebrity, event and
 * request cards throughout the discovery screens.
 */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-card-border bg-white shadow-card ${className ?? ""}`}
      {...props}
    />
  );
}
