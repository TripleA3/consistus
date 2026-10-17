import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

type PageHeaderProps = {
  title: string;
  /** One line under the title. */
  subtitle?: string;
  /** Shows a back chevron linking here. Omit on top-level tab screens. */
  back?: string;
  /** Buttons on the right of the title row. */
  actions?: ReactNode;
  /** An accent word in Instrument Serif italic, per the type spec. */
  accent?: string;
  className?: string;
};

/**
 * The first block on a screen. One per screen, and it owns the only h1.
 */
export function PageHeader({
  title,
  subtitle,
  back,
  actions,
  accent,
  className = "",
}: PageHeaderProps) {
  return (
    <header className={`mb-5 ${className}`}>
      {back ? (
        <Link
          href={back}
          className="mb-2 -ml-2 inline-flex size-9 items-center justify-center rounded-pill text-foreground hover:bg-accent"
          aria-label="Back"
        >
          <ArrowLeft size={20} weight="bold" />
        </Link>
      ) : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-headline-lg">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="font-accent font-normal italic">{accent}</span>
              </>
            ) : null}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-body-lg text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
