import type { ButtonHTMLAttributes } from "react";
import Link from "next/link";

export type ButtonVariant = "primary" | "accent" | "outline" | "ghost" | "neutral";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variantClasses: Record<ButtonVariant, string> = {
  // Filled pale-lime chip/CTA — matches "_Nav item base" filter chips and
  // primary CTAs across the home and checkout frames.
  primary:
    "bg-primary border-[3px] border-[#f7ffe9] text-ink shadow-[0_0_3px_rgba(0,0,0,0.05)] hover:brightness-95 rounded-md",
  // Active/selected tab or nav item state.
  accent:
    "bg-accent border-4 border-lime-100 text-ink rounded-md hover:brightness-95",
  // Outline button used over the dark navy celebrity/event cards.
  outline:
    "bg-transparent border border-primary text-background shadow-button rounded-xl hover:bg-white/10",
  // Neutral icon button (header actions).
  ghost:
    "bg-[#ededed] border-[3px] border-[#f6f6f6] text-ink rounded-md hover:bg-[#e2e2e2]",
  // Low-emphasis action on light surfaces.
  neutral:
    "bg-white border border-card-border text-ink rounded-lg hover:bg-slate-50",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-2.5 text-base",
};

export function buttonClasses(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className = "",
) {
  return `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={buttonClasses(variant, size, className)}
      {...props}
    />
  );
}

type ButtonLinkProps = React.ComponentProps<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props} />;
}
