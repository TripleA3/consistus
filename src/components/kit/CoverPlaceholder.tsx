import type { ReactNode } from "react";

type CoverPlaceholderProps = {
  /** Centred over the stripes — usually an icon or an initial. */
  children?: ReactNode;
  /** Tailwind aspect utility; 16/9 for event covers, 1/1 for avatars. */
  className?: string;
};

/**
 * Stands in wherever a real cover image hasn't been supplied. The stripes
 * themselves come from `[data-cover-placeholder]` in globals.css, so one
 * rule covers every placeholder in the app.
 */
export function CoverPlaceholder({
  children,
  className = "aspect-[16/9] rounded-lg",
}: CoverPlaceholderProps) {
  return (
    <div
      data-cover-placeholder
      aria-hidden
      className={`flex w-full items-center justify-center overflow-hidden text-indigo-200 ${className}`}
    >
      {children}
    </div>
  );
}
