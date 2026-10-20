import { Fire, Sparkle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink, Card } from "@/components/kit";

type LevelCardProps = {
  level: number;
  title: string;
  xpIntoLevel: number;
  xpForLevel: number;
  streakDays: number;
};

/**
 * The rewards strip from the design: a ring showing progress through the
 * current level, the level name and bar, the streak, and the action worth
 * the most XP right now.
 */
export function LevelCard({
  level,
  title,
  xpIntoLevel,
  xpForLevel,
  streakDays,
}: LevelCardProps) {
  const pct = Math.max(0, Math.min(100, Math.round((xpIntoLevel / xpForLevel) * 100)));
  const remaining = Math.max(0, xpForLevel - xpIntoLevel);

  return (
    <Card className="mb-[var(--section-gap)] flex flex-wrap items-center gap-4 p-5">
      {/* conic-gradient ring: cheaper than an SVG and themes for free. */}
      <span
        className="relative flex size-14 shrink-0 items-center justify-center rounded-full"
        style={{
          background: `conic-gradient(var(--cta) ${pct}%, var(--border) ${pct}%)`,
        }}
      >
        <span className="flex size-[46px] items-center justify-center rounded-full bg-card text-title-md tabular-nums">
          {level}
        </span>
      </span>

      <div className="min-w-[180px] flex-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <p className="text-title-md">
            Level {level} · {title}
          </p>
          <p className="text-body-md text-muted-foreground">
            {remaining.toLocaleString("en-US")} XP to level {level + 1}
          </p>
        </div>

        <div
          role="progressbar"
          aria-label={`Progress to level ${level + 1}`}
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-2 h-2 overflow-hidden rounded-pill bg-muted"
        >
          <div data-grow style={{ width: `${pct}%` }} className="h-full rounded-pill bg-cta" />
        </div>
      </div>

      <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-pill bg-muted px-3.5 text-label-lg">
        <Fire size={16} weight="fill" className="text-warning" />
        {streakDays}-day streak
      </span>

      <ButtonLink
        href="/events"
        size="sm"
        className="h-9 shrink-0"
        leading={<Sparkle size={15} weight="fill" />}
      >
        Buy a ticket · +100 XP
      </ButtonLink>
    </Card>
  );
}
