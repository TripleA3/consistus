"use client";

import type { ReactNode } from "react";
import Link from "next/link";

type ChipProps = {
  children: ReactNode;
  /** Filled indigo when selected, bordered when not. */
  selected?: boolean;
  /** Small count or icon after the label. */
  trailing?: ReactNode;
  leading?: ReactNode;
  onClick?: () => void;
  href?: string;
  className?: string;
};

const BASE =
  "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-pill px-3.5 text-caption font-bold " +
  "transition-colors";

/** A filter or category pill. Rows of them go in a ChipRow. */
export function Chip({
  children,
  selected = false,
  leading,
  trailing,
  onClick,
  href,
  className = "",
}: ChipProps) {
  const classes = `${BASE} ${
    selected
      ? "bg-primary text-primary-foreground"
      : "border border-border bg-card text-foreground hover:bg-accent"
  } ${className}`;

  const content = (
    <>
      {leading}
      {children}
      {trailing}
    </>
  );

  if (href) {
    return (
      <Link href={href} aria-current={selected ? "page" : undefined} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} aria-pressed={selected} className={classes}>
      {content}
    </button>
  );
}

/**
 * Wraps on desktop; on phones `data-chip-row` turns it into a single
 * edge-to-edge scrolling line (tokens/mobile.css).
 */
export function ChipRow({
  children,
  className = "",
  label,
}: {
  children: ReactNode;
  className?: string;
  /** Names the group for screen readers, e.g. "Filter by category". */
  label?: string;
}) {
  return (
    <div
      data-chip-row
      role={label ? "group" : undefined}
      aria-label={label}
      className={`flex flex-wrap items-center gap-2 ${className}`}
    >
      {children}
    </div>
  );
}
