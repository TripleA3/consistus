const gradients = [
  "from-lime-200 to-lime-500",
  "from-slate-200 to-slate-400",
  "from-amber-100 to-amber-300",
  "from-sky-100 to-sky-300",
  "from-rose-100 to-rose-300",
  "from-violet-100 to-violet-300",
];

function hashToIndex(key: string, length: number) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % length;
}

type ImagePlaceholderProps = {
  id: string;
  label?: string;
  className?: string;
};

/**
 * Stand-in for a real photo/cover image. The Figma file's photography could
 * not be downloaded in this environment (see docs/open-questions.md); this
 * renders a deterministic gradient block instead, keyed by `id`, so cards
 * stay visually distinct without pretending to be final art. Swap for a
 * real `<img>` sourced from the media layer once assets are available.
 */
export function ImagePlaceholder({ id, label, className }: ImagePlaceholderProps) {
  const gradient = gradients[hashToIndex(id, gradients.length)];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${gradient} ${className ?? ""}`}
      role="img"
      aria-label={label ?? "Placeholder image"}
    >
      {label ? (
        <span className="px-2 text-center text-xs font-medium text-ink/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}
