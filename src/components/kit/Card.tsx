import type { ReactNode } from "react";
import Link from "next/link";

type CardProps = {
  children: ReactNode;
  /** Makes the whole card a link, which also opts it into the lift hover. */
  href?: string;
  /** No padding — for cards that start with a full-bleed cover image. */
  flush?: boolean;
  className?: string;
};

/**
 * The default surface. Linked cards lift and their inner image scales on
 * hover via the motion layer; add `data-no-lift` to opt a card out.
 */
export function Card({ children, href, flush = false, className = "" }: CardProps) {
  const classes = `block overflow-hidden rounded-lg bg-card text-card-foreground shadow-xs ${
    flush ? "" : "p-4"
  } ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return <div className={classes}>{children}</div>;
}
