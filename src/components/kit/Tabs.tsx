"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export type TabDef = {
  /** Also the query value when the tabs are links. */
  value: string;
  label: string;
  /** Shown as a small pill after the label. */
  count?: number;
};

type TabsProps = {
  tabs: TabDef[];
  value: string;
  /** Omit when `hrefFor` is given — then the tabs are links. */
  onChange?: (value: string) => void;
  /** Makes the tabs navigation, so a tab survives a reload and shares. */
  hrefFor?: (value: string) => string;
  label: string;
  className?: string;
};

/**
 * Underlined tabs for switching between views of one screen (Events →
 * Going / Hosting / Past). Scrolls horizontally rather than wrapping, so
 * four or five tabs still work at 390px.
 */
export function Tabs({
  tabs,
  value,
  onChange,
  hrefFor,
  label,
  className = "",
}: TabsProps) {
  return (
    <div
      role={hrefFor ? undefined : "tablist"}
      aria-label={label}
      className={`-mx-[var(--gutter)] flex gap-1 overflow-x-auto border-b border-border px-[var(--gutter)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {tabs.map((tab) => {
        const active = tab.value === value;
        const inner = (
          <>
            {tab.label}
            {tab.count === undefined ? null : (
              <span
                className={`rounded-pill px-1.5 py-0.5 text-label-sm ${
                  active ? "bg-cta text-cta-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            )}
          </>
        );

        // -1px pulls the indicator onto the container's own border.
        const classes = `-mb-px flex shrink-0 items-center gap-2 border-b-2 px-3 pb-2.5 pt-2 text-body-lg font-bold transition-colors ${
          active
            ? "border-cta text-foreground"
            : "border-transparent text-muted-foreground hover:text-foreground"
        }`;

        if (hrefFor) {
          return (
            <Link
              key={tab.value}
              href={hrefFor(tab.value)}
              aria-current={active ? "page" : undefined}
              className={classes}
            >
              {inner}
            </Link>
          );
        }

        return (
          <button
            key={tab.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange?.(tab.value)}
            className={classes}
          >
            {inner}
          </button>
        );
      })}
    </div>
  );
}

/** The body below a Tabs row. Only the selected panel renders. */
export function TabPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div role="tabpanel" className={`pt-5 ${className}`}>
      {children}
    </div>
  );
}
