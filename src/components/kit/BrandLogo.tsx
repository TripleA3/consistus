import { Star } from "@phosphor-icons/react/dist/ssr";

type BrandLogoProps = {
  /** Tile edge in px; the glyph and wordmark scale with it. */
  size?: number;
  /** Drops the wordmark, leaving the tile — for tight headers and avatars. */
  markOnly?: boolean;
  className?: string;
};

/** The lockup: indigo tile with a lime star, then "Fannero". */
export function BrandLogo({ size = 32, markOnly = false, className = "" }: BrandLogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span
        style={{ width: size, height: size, borderRadius: Math.round(size * 0.3) }}
        className="flex shrink-0 items-center justify-center bg-primary text-cta"
      >
        <Star weight="fill" size={Math.round(size * 0.5)} />
      </span>

      {markOnly ? null : (
        <span
          style={{ fontSize: Math.round(size * 0.625) }}
          className="font-extrabold tracking-[-0.025em]"
        >
          Fannero
        </span>
      )}
    </span>
  );
}
