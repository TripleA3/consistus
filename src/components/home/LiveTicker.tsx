import {
  Confetti,
  Crown,
  Fire,
  Ticket,
  UsersThree,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

/** The design's own ticker copy, verbatim from its bundle. */
const ITEMS: { icon: PhosphorIcon; text: string }[] = [
  { icon: Ticket, text: "Nia Kalu just dropped VIP tickets for Afro Night Live" },
  { icon: UsersThree, text: "312 fans joined Comedy Lovers NG today" },
  { icon: Crown, text: "Kemi A. hit Level 24" },
  { icon: Fire, text: "Tunde Ade Uncensored is 92% sold" },
  { icon: VideoCamera, text: "Zara Bello delivered 18 videos this week" },
  { icon: Confetti, text: "New: Owambe Sunday in Ikeja" },
];

/**
 * A single scrolling line of what's happening. `data-marquee` hands it to
 * the motion layer, which doubles the content and animates it, and stops
 * entirely under reduced motion.
 */
export function LiveTicker() {
  return (
    <div
      data-no-reveal
      className="mb-6 overflow-hidden rounded-pill bg-card py-3 shadow-xs"
      aria-label="Live activity"
    >
      {/* Rendered twice so -50% loops seamlessly. React owns both halves,
          which keeps the motion layer from cloning into this subtree and
          breaking hydration; the second pass is hidden from assistive tech. */}
      <div data-marquee data-marquee-prefilled className="flex w-max items-center gap-8 px-4">
        {[0, 1].map((pass) =>
          ITEMS.map((item) => (
            <span
              key={`${pass}-${item.text}`}
              aria-hidden={pass === 1 || undefined}
              className="flex shrink-0 items-center gap-2.5"
            >
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <item.icon size={14} weight="fill" />
              </span>
              <span className="whitespace-nowrap text-label-lg">{item.text}</span>
              <span aria-hidden className="size-1 rounded-full bg-border" />
            </span>
          )),
        )}
      </div>
    </div>
  );
}
