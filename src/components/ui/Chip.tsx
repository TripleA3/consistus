import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";

export type ChipVariant = "filled" | "active" | "subtle";

const variantClasses: Record<ChipVariant, string> = {
  // Category / filter pill — Figma "_Nav item base" on lime fill.
  filled:
    "bg-primary border-4 border-lime-100 text-ink hover:brightness-95",
  // Selected nav/tab state — Figma "_Nav item base" on Sulu/400 fill.
  active: "bg-accent border-4 border-lime-100 text-ink",
  // Unselected nav item — transparent, muted text.
  subtle: "bg-transparent border-4 border-transparent text-slate-400 hover:text-slate-900",
};

export function chipClasses(variant: ChipVariant = "filled", className = "") {
  return `inline-flex shrink-0 items-center gap-2 overflow-hidden rounded-md px-3 py-2 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 ${variantClasses[variant]} ${className}`;
}

type ChipProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ChipVariant;
  icon?: IconName;
  children: ReactNode;
};

/**
 * Mirrors the Figma "_Nav item base" component: used both as page/subpage
 * nav items and as category filter chips throughout the home and discovery
 * screens.
 */
export function Chip({
  variant = "filled",
  icon,
  children,
  className,
  ...props
}: ChipProps) {
  return (
    <button type="button" className={chipClasses(variant, className)} {...props}>
      {icon ? <Icon name={icon} className="size-5" /> : null}
      <span className="whitespace-nowrap">{children}</span>
    </button>
  );
}

type ChipLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ChipVariant;
  icon?: IconName;
};

export function ChipLink({
  variant = "subtle",
  icon,
  children,
  className,
  ...props
}: ChipLinkProps) {
  return (
    <Link className={chipClasses(variant, className)} {...props}>
      {icon ? <Icon name={icon} className="size-5" /> : null}
      <span className="whitespace-nowrap">{children}</span>
    </Link>
  );
}
