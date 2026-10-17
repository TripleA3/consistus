import type { ReactNode } from "react";
import { ButtonLink } from "@/components/kit/Button";

type EmptyStateProps = {
  /** A Phosphor icon, usually at size 28. */
  icon?: ReactNode;
  title: string;
  /** One or two lines saying what would fill this space. */
  body?: string;
  /** The action that resolves the emptiness. */
  action?: { label: string; href: string };
  className?: string;
};

/**
 * Shown wherever a list has nothing in it. Every list screen needs one —
 * an empty feed with no explanation reads as a bug.
 */
export function EmptyState({ icon, title, body, action, className = "" }: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center rounded-xl border border-dashed border-border px-6 py-10 text-center ${className}`}
    >
      {icon ? (
        <span className="mb-3 flex size-14 items-center justify-center rounded-pill bg-muted text-muted-foreground">
          {icon}
        </span>
      ) : null}

      <h3 className="text-title-md">{title}</h3>
      {body ? <p className="mt-1 max-w-[42ch] text-body-md text-muted-foreground">{body}</p> : null}

      {action ? (
        <ButtonLink href={action.href} size="sm" className="mt-4">
          {action.label}
        </ButtonLink>
      ) : null}
    </div>
  );
}
