import type { ReactNode } from "react";
import Link from "next/link";

type SectionProps = {
  title: string;
  children: ReactNode;
  /** Sits under the title, one line. */
  subtitle?: string;
  /** "See all" style link on the title row. */
  action?: { label: string; href: string };
  /** Replaces the action with arbitrary controls (a Segmented, say). */
  aside?: ReactNode;
  className?: string;
};

/**
 * A titled block of a screen. Direct children of `main` are revealed on
 * scroll by the motion layer, so screens should compose Sections rather
 * than nesting their own headings.
 */
export function Section({
  title,
  subtitle,
  action,
  aside,
  children,
  className = "",
}: SectionProps) {
  return (
    <section className={`mb-[var(--section-gap)] ${className}`}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="truncate text-title-lg">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-body-md text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {aside ??
          (action ? (
            <Link
              href={action.href}
              className="shrink-0 text-label-lg text-link hover:underline"
            >
              {action.label}
            </Link>
          ) : null)}
      </div>

      {children}
    </section>
  );
}
