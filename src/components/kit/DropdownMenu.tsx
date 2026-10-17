"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";

export type MenuItem = {
  label: string;
  icon?: ReactNode;
  /** A link item. Give either this or `onSelect`. */
  href?: string;
  onSelect?: () => void;
  /** Red label, for destructive items like Cancel order. */
  danger?: boolean;
};

type DropdownMenuProps = {
  /** The button that opens the menu. */
  trigger: ReactNode;
  items: MenuItem[];
  label: string;
  /** Which edge the panel lines up with. */
  align?: "start" | "end";
  className?: string;
};

/** Overflow actions on a card or a screen header. */
export function DropdownMenu({
  trigger,
  items,
  label,
  align = "end",
  className = "",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={root} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? id : undefined}
        aria-label={label}
        onClick={() => setOpen((value) => !value)}
        className="flex size-10 items-center justify-center rounded-pill text-foreground hover:bg-accent"
      >
        {trigger}
      </button>

      {open ? (
        <div
          id={id}
          role="menu"
          aria-label={label}
          className={`absolute top-[calc(100%+4px)] z-[var(--z-dropdown)] min-w-48 overflow-hidden rounded-lg border border-border bg-popover py-1 text-popover-foreground shadow-lg ${
            align === "end" ? "right-0" : "left-0"
          }`}
        >
          {items.map((item) => {
            const classes = `flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-body-lg font-bold hover:bg-accent ${
              item.danger ? "text-destructive" : "text-foreground"
            }`;

            if (item.href) {
              return (
                <Link
                  key={item.label}
                  role="menuitem"
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={classes}
                >
                  {item.icon}
                  {item.label}
                </Link>
              );
            }

            return (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                className={classes}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
