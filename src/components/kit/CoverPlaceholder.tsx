import type { ReactNode } from "react";

/**
 * Deterministic, so the same event or talent always gets the same cover —
 * on the server and on the client, which keeps hydration happy.
 */
function hash(seed: string) {
  // FNV-1a: ids differ in only a few characters, and the classic h*31 has
  // too little avalanche to spread those across the treatments.
  let h = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/*
 * Six treatments from the brand ramps, so a grid of covers reads as a set
 * rather than one stripe repeated. Each is a background-image pair applied
 * over a base colour.
 */
const TREATMENTS = [
  {
    base: "var(--indigo-900)",
    image: "repeating-linear-gradient(45deg, var(--indigo-800) 0 18px, transparent 18px 40px)",
  },
  {
    base: "var(--indigo-800)",
    image:
      "radial-gradient(circle at 70% 25%, var(--indigo-600) 0 22%, transparent 22%), " +
      "radial-gradient(circle at 25% 80%, var(--indigo-950) 0 28%, transparent 28%)",
  },
  {
    base: "var(--indigo-950)",
    image: "repeating-linear-gradient(-30deg, var(--indigo-700) 0 10px, transparent 10px 34px)",
  },
  {
    base: "var(--indigo-700)",
    image:
      "radial-gradient(circle at 50% 110%, var(--lime-400) 0 18%, transparent 18%), " +
      "linear-gradient(160deg, var(--indigo-950) 0 40%, transparent 40%)",
  },
  {
    base: "var(--indigo-900)",
    image:
      "repeating-radial-gradient(circle at 15% 15%, var(--indigo-600) 0 2px, transparent 2px 16px)",
  },
  {
    base: "var(--indigo-600)",
    image:
      "linear-gradient(120deg, var(--indigo-950) 0 45%, transparent 45%), " +
      "repeating-linear-gradient(90deg, var(--indigo-800) 0 6px, transparent 6px 28px)",
  },
] as const;

type CoverPlaceholderProps = {
  /** A real image. When set, everything else is ignored and it renders. */
  src?: string;
  /** Alt text for a real image. Decorative placeholders stay aria-hidden. */
  alt?: string;
  /** Any stable id — the same seed always picks the same treatment. */
  seed?: string;
  /** Centred over the pattern, usually an icon. */
  children?: ReactNode;
  /** Tailwind aspect and radius; 16/9 for covers, 1/1 for avatars. */
  className?: string;
};

/**
 * Stands in wherever a real cover hasn't been supplied. Pass `src` the
 * moment real artwork exists and the layout is unchanged — nothing else
 * about the card has to move.
 */
export function CoverPlaceholder({
  src,
  alt = "",
  seed,
  children,
  className = "aspect-[16/9] rounded-lg",
}: CoverPlaceholderProps) {
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- covers come from arbitrary remote hosts
      <img src={src} alt={alt} className={`w-full object-cover ${className}`} />
    );
  }

  const treatment = TREATMENTS[seed ? hash(seed) % TREATMENTS.length : 0];

  return (
    <div
      aria-hidden
      style={{ backgroundColor: treatment.base, backgroundImage: treatment.image }}
      className={`flex w-full items-center justify-center overflow-hidden text-indigo-200 ${className}`}
    >
      {children}
    </div>
  );
}
