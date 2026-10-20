"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import {
  CalendarBlank,
  MagnifyingGlass,
  MusicNote,
  Play,
  Smiley,
  VideoCamera,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Button } from "@/components/kit";

const QUICK: { label: string; icon: PhosphorIcon; href: string }[] = [
  { label: "Concerts", icon: MusicNote, href: "/events?category=concerts" },
  { label: "Comedy", icon: Smiley, href: "/events?category=nightlife" },
  { label: "Video shoutouts", icon: VideoCamera, href: "/" },
  { label: "This weekend", icon: CalendarBlank, href: "/events" },
];

/**
 * The indigo hero from the design: greeting, headline with its one serif
 * accent, a search pill carrying the lime Search button, quick filters,
 * and the photo panel with its delivery card. The panel is hidden below
 * lg, where the design stacks to the copy alone.
 */
export function HeroPanel({ name }: { name: string }) {
  const router = useRouter();

  function onSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get("q");
    router.push(q ? `/events?q=${encodeURIComponent(String(q))}` : "/events");
  }

  return (
    <section
      data-no-reveal
      className="relative mb-6 overflow-hidden rounded-xl bg-surface-brand text-on-brand"
    >
      <div className="relative z-10 max-w-[520px] p-6 sm:p-8">
        <p className="flex items-center gap-3 text-label-lg">
          <span className="h-0.5 w-7 rounded-pill bg-cta" />
          Good evening, {name.split(" ")[0]}
        </p>

        <h1 className="mt-3 text-display-sm">
          Get closer to
          <br />
          the stars you <span className="font-accent font-normal italic">love.</span>
        </h1>

        <form
          onSubmit={onSearch}
          className="mt-6 flex h-14 w-full max-w-[327px] items-center gap-2 rounded-pill bg-card pl-4 pr-2"
        >
          <MagnifyingGlass size={18} weight="bold" className="shrink-0 text-muted-foreground" />
          <input
            name="q"
            aria-label="Search celebrities or events"
            placeholder="Search celebrities or events"
            className="min-w-0 flex-1 bg-transparent text-control text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Button type="submit" className="h-10 shrink-0 px-5">
            Search
          </Button>
        </form>

        <div data-chip-row className="mt-5 flex flex-wrap gap-2">
          {QUICK.map((item) => (
            <a
              key={item.label}
              href={item.href}
              data-pill
              className="inline-flex h-9 shrink-0 items-center gap-2 rounded-pill border border-white/25 px-3.5 text-label-lg text-on-brand hover:bg-white/10"
            >
              <item.icon size={15} weight="bold" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* Photo panel: lime stripes behind, the delivery card in front. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[38%] min-[820px]:block">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "repeating-linear-gradient(55deg, var(--lime-400) 0 22px, transparent 22px 54px)",
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element -- static design asset */}
        <img
          src="/images/hero.png"
          alt=""
          className="absolute inset-0 size-full object-cover object-top"
        />

        <div className="absolute bottom-10 left-0 flex w-[228px] -translate-x-10 items-center gap-2.5 rounded-pill bg-card p-2.5 text-card-foreground shadow-md">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-cta text-cta-foreground">
            <Play size={16} weight="fill" />
          </span>
          <span className="min-w-0">
            <span className="block whitespace-nowrap text-field">Your video from Nia Kalu</span>
            <span className="block text-body-sm text-muted-foreground">Delivered in 2 days</span>
          </span>
        </div>
      </div>
    </section>
  );
}
