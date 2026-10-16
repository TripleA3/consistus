import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

/**
 * cta       the one lime action per screen
 * primary   deep indigo, for secondary-but-important actions
 * secondary tinted indigo fill, for repeated actions in a list
 * outline   bordered, for cancel/back and card actions
 * ghost     text only, for low-emphasis and toolbar actions
 * icon      square, for bare icons (pass only an icon as children)
 */
export type ButtonVariant =
  | "cta"
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "icon";

export type ButtonSize = "sm" | "md" | "lg";

const BASE =
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-pill font-bold " +
  "transition-colors disabled:pointer-events-none";

const VARIANTS: Record<ButtonVariant, string> = {
  cta: "bg-cta text-cta-foreground shadow-sm hover:brightness-[.97]",
  primary: "bg-primary text-primary-foreground shadow-xs hover:brightness-110",
  secondary: "bg-secondary text-secondary-foreground hover:brightness-[.97]",
  outline: "border border-border bg-transparent text-foreground hover:bg-accent",
  ghost: "bg-transparent text-foreground hover:bg-accent",
  icon: "bg-transparent text-foreground hover:bg-accent",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-caption",
  md: "h-11 px-5 text-body",
  lg: "h-[52px] px-6 text-body",
};

/** Icon buttons are square, so they take a width rather than padding. */
const ICON_SIZES: Record<ButtonSize, string> = {
  sm: "size-9",
  md: "size-10",
  lg: "size-11",
};

export function buttonClasses(
  variant: ButtonVariant = "cta",
  size: ButtonSize = "md",
  className = "",
) {
  const metrics = variant === "icon" ? ICON_SIZES[size] : SIZES[size];
  return `${BASE} ${VARIANTS[variant]} ${metrics} ${className}`.trim();
}

type Shared = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label. */
  leading?: ReactNode;
  /** Rendered after the label. */
  trailing?: ReactNode;
  /** Stretches to the container — the phone pattern for a screen's CTA. */
  block?: boolean;
};

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  Shared & { children?: ReactNode };

export function Button({
  variant = "cta",
  size = "md",
  leading,
  trailing,
  block = false,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type={props.type ?? "button"}
      className={buttonClasses(variant, size, `${block ? "w-full" : ""} ${className}`)}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </button>
  );
}

type ButtonLinkProps = Omit<React.ComponentProps<typeof Link>, "children"> &
  Shared & { children?: ReactNode };

/** Same shapes as Button, for actions that are really navigation. */
export function ButtonLink({
  variant = "cta",
  size = "md",
  leading,
  trailing,
  block = false,
  className = "",
  children,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={buttonClasses(variant, size, `${block ? "w-full" : ""} ${className}`)}
      {...props}
    >
      {leading}
      {children}
      {trailing}
    </Link>
  );
}
