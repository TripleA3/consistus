"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { burstFrom } from "@/lib/motion/burst";

const EXPO = "cubic-bezier(.16, 1, .3, 1)"; // entrances, settles
const BACK = "cubic-bezier(.34, 1.56, .64, 1)"; // springy pops, overshoot

/**
 * Tracks which nodes are already wired, so re-scans after navigation don't
 * double-bind them. Deliberately a WeakSet rather than a data attribute:
 * writing attributes onto React-owned nodes before their subtree hydrates
 * breaks hydration, and entries here are dropped when nodes are collected.
 */
const bound = new WeakSet<Element>();

function markBound(el: Element) {
  if (bound.has(el)) return false;
  bound.add(el);
  return true;
}

type Flags = { reduced: boolean; canHover: boolean };

/* ---------------------------------------------------------------- reveals */

function revealKeyframes(kind: string, reduced: boolean): Keyframe[] {
  // Under reduced motion every reveal degrades to a plain fade.
  if (reduced || kind === "fade") return [{ opacity: 0 }, { opacity: 1 }];
  if (kind === "scale") return [{ opacity: 0, transform: "scale(.92)" }, { opacity: 1, transform: "scale(1)" }];
  if (kind === "left")
    return [
      { opacity: 0, transform: "translateX(-32px)" },
      { opacity: 1, transform: "translateX(0)" },
    ];
  return [
    { opacity: 0, transform: "translateY(32px)" },
    { opacity: 1, transform: "translateY(0)" },
  ];
}

function setupReveals({ reduced }: Flags) {
  const main = document.querySelector("main");
  if (!main) return () => {};

  const targets: { el: Element; kind: string; delay: number }[] = [];

  // Each direct child of <main> is a section.
  for (const section of Array.from(main.children)) {
    if (section.hasAttribute("data-no-reveal") || !markBound(section)) continue;
    targets.push({
      el: section,
      kind: section.getAttribute("data-reveal") ?? "up",
      delay: Number(section.getAttribute("data-delay") ?? 0),
    });
  }

  // Grid children stagger, capped so long lists don't crawl in.
  for (const grid of Array.from(main.querySelectorAll("*"))) {
    if (getComputedStyle(grid).display !== "grid") continue;
    Array.from(grid.children).forEach((child, i) => {
      if (child.hasAttribute("data-no-reveal") || !markBound(child)) return;
      targets.push({
        el: child,
        kind: child.getAttribute("data-reveal") ?? "up",
        delay: Math.min(i, 7) * 70,
      });
    });
  }

  // Anything opted in explicitly, wherever it sits.
  for (const el of Array.from(document.querySelectorAll("[data-reveal]"))) {
    if (!markBound(el)) continue;
    targets.push({
      el,
      kind: el.getAttribute("data-reveal") ?? "up",
      delay: Number(el.getAttribute("data-delay") ?? 0),
    });
  }

  if (targets.length === 0) return () => {};

  const byEl = new Map(targets.map((t) => [t.el, t]));
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = byEl.get(entry.target);
        if (!target) continue;
        entry.target.animate(revealKeyframes(target.kind, reduced), {
          duration: 900,
          delay: target.delay,
          easing: EXPO,
          fill: "both",
        });
        observer.unobserve(entry.target);
      }
    },
    { threshold: 0.06, rootMargin: "0px 0px -6% 0px" },
  );

  for (const { el } of targets) observer.observe(el);
  return () => observer.disconnect();
}

/* ------------------------------------------------------------- hover lift */

/** A card is a link/article that looks like one: rounded, or holding an image. */
function isCard(el: Element) {
  if (!(el instanceof HTMLElement)) return false;
  if (el.hasAttribute("data-no-lift")) return false;
  const radius = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0;
  return radius >= 16 || el.querySelector("img, [data-cover-placeholder]") !== null;
}

function setupCardLift({ canHover, reduced }: Flags) {
  if (!canHover || reduced) return () => {};
  const cards = Array.from(document.querySelectorAll("main a, main article")).filter(isCard);
  const cleanups: (() => void)[] = [];

  for (const card of cards) {
    if (!markBound(card)) continue;
    const image = card.querySelector("img, [data-cover-placeholder]");

    const enter = () => {
      card.animate([{ transform: "translateY(0)" }, { transform: "translateY(-6px)" }], {
        duration: 500,
        easing: BACK,
        fill: "forwards",
      });
      image?.animate([{ transform: "scale(1)" }, { transform: "scale(1.07)" }], {
        duration: 900,
        easing: EXPO,
        fill: "forwards",
      });
    };
    const leave = () => {
      card.animate([{ transform: "translateY(-6px)" }, { transform: "translateY(0)" }], {
        duration: 600,
        easing: EXPO,
        fill: "forwards",
      });
      image?.animate([{ transform: "scale(1.07)" }, { transform: "scale(1)" }], {
        duration: 700,
        easing: EXPO,
        fill: "forwards",
      });
    };

    card.addEventListener("pointerenter", enter);
    card.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      card.removeEventListener("pointerenter", enter);
      card.removeEventListener("pointerleave", leave);
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

/* -------------------------------------------------------- tilt & magnetic */

function setupTilt({ canHover, reduced }: Flags) {
  if (!canHover || reduced) return () => {};
  const cleanups: (() => void)[] = [];

  for (const el of Array.from(document.querySelectorAll("[data-tilt]"))) {
    if (!(el instanceof HTMLElement) || !markBound(el)) continue;

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.transition = "transform 120ms ease-out";
      el.style.transform = `perspective(900px) rotateX(${-y * 12}deg) rotateY(${x * 14}deg) scale(1.03)`;
    };
    const leave = () => {
      el.style.transition = `transform 800ms ${EXPO}`;
      el.style.transform = "";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

function setupMagnetic({ canHover, reduced }: Flags) {
  if (!canHover || reduced) return () => {};
  const cleanups: (() => void)[] = [];

  for (const el of Array.from(document.querySelectorAll("[data-magnetic]"))) {
    if (!(el instanceof HTMLElement) || !markBound(el)) continue;

    const move = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      el.style.transition = "transform 150ms ease-out";
      el.style.transform = `translate(${x * 0.22}px, ${y * 0.3}px)`;
    };
    const leave = () => {
      el.style.transition = `transform 700ms ${BACK}`;
      el.style.transform = "";
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

/* ----------------------------------------------------------- press spring */

function setupPressSpring({ reduced }: Flags) {
  if (reduced) return () => {};

  const down = (event: PointerEvent) => {
    const button = (event.target as Element | null)?.closest?.("button, [role='button']");
    if (!button || button.hasAttribute("disabled")) return;
    button.animate([{ transform: "scale(1)" }, { transform: "scale(.94)" }], {
      duration: 140,
      easing: "ease-out",
      fill: "forwards",
    });
  };
  const up = (event: PointerEvent) => {
    const button = (event.target as Element | null)?.closest?.("button, [role='button']");
    if (!button) return;
    button.animate([{ transform: "scale(.94)" }, { transform: "scale(1)" }], {
      duration: 520,
      easing: BACK,
      fill: "forwards",
    });
  };

  document.addEventListener("pointerdown", down);
  document.addEventListener("pointerup", up);
  document.addEventListener("pointercancel", up);
  return () => {
    document.removeEventListener("pointerdown", down);
    document.removeEventListener("pointerup", up);
    document.removeEventListener("pointercancel", up);
  };
}

/* ------------------------------------------------- progress bars & counts */

function setupGrow({ reduced }: Flags) {
  const bars = Array.from(document.querySelectorAll("[data-grow]")).filter(markBound);
  if (bars.length === 0) return () => {};

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const bar = entry.target as HTMLElement;
        const target = bar.getAttribute("data-grow") || bar.style.width || "0%";
        if (reduced) {
          bar.style.width = target;
        } else {
          bar.animate([{ width: "0%" }, { width: target }], {
            duration: 1400,
            delay: 200,
            easing: EXPO,
            fill: "both",
          });
        }
        observer.unobserve(bar);
      }
    },
    { threshold: 0.3 },
  );

  for (const bar of bars) observer.observe(bar);
  return () => observer.disconnect();
}

/** Splits "₦1,250.50+" into its prefix, numeric value and suffix. */
function parseCount(text: string) {
  const match = text.match(/-?[\d,]*\.?\d+/);
  if (!match) return null;
  const raw = match[0];
  return {
    prefix: text.slice(0, match.index ?? 0),
    suffix: text.slice((match.index ?? 0) + raw.length),
    value: Number(raw.replace(/,/g, "")),
    decimals: raw.includes(".") ? raw.split(".")[1].length : 0,
    grouped: raw.includes(","),
  };
}

function setupCountUp({ reduced }: Flags) {
  const nodes = Array.from(document.querySelectorAll("[data-count]")).filter(markBound);
  if (nodes.length === 0) return () => {};

  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const el = entry.target as HTMLElement;
      observer.unobserve(el);

      const parsed = parseCount(el.textContent ?? "");
      if (!parsed || reduced) continue;

      const { prefix, suffix, value, decimals, grouped } = parsed;
      const format = (n: number) =>
        `${prefix}${n.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
          useGrouping: grouped,
        })}${suffix}`;

      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - start) / 1300, 1);
        // ease-out-expo
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
        el.textContent = format(value * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      el.textContent = format(0);
      requestAnimationFrame(tick);
    }
  });

  for (const node of nodes) observer.observe(node);
  return () => observer.disconnect();
}

/* --------------------------------------------------- float, drift, marquee */

function setupFloatAndDrift({ reduced }: Flags) {
  if (reduced) return () => {};
  const animations: Animation[] = [];

  Array.from(document.querySelectorAll("[data-float]"))
    .filter(markBound)
    .forEach((el, i) => {
      animations.push(
        el.animate([{ transform: "translateY(0)" }, { transform: "translateY(-10px)" }], {
          duration: 2600 + 500 * i,
          delay: 300 * i,
          direction: "alternate",
          iterations: Infinity,
          easing: "ease-in-out",
        }),
      );
    });

  Array.from(document.querySelectorAll("[data-drift]"))
    .filter(markBound)
    .forEach((el, i) => {
      animations.push(
        el.animate(
          [
            { transform: "translate(0, 0) rotate(0deg)" },
            { transform: "translate(14px, -10px) rotate(3deg)" },
          ],
          {
            duration: 6000 + 900 * i,
            direction: "alternate",
            iterations: Infinity,
            easing: "ease-in-out",
          },
        ),
      );
    });

  return () => animations.forEach((a) => a.cancel());
}

const doubled = new WeakSet<Element>();

function setupMarquee({ reduced }: Flags) {
  const tracks = Array.from(document.querySelectorAll("[data-marquee]")).filter(markBound);
  const cleanups: (() => void)[] = [];

  for (const track of tracks) {
    if (!(track instanceof HTMLElement)) continue;
    // The track holds its content twice, so -50% lands seamlessly back at 0.
    // A <Marquee> component should render the duplicate itself; this is the
    // fallback for plain markup.
    if (track.childElementCount && !doubled.has(track)) {
      doubled.add(track);
      track.innerHTML += track.innerHTML;
    }
    if (reduced) continue;

    const speed = Number(track.getAttribute("data-marquee")) || 50;
    const duration = (track.scrollWidth / 2 / speed) * 1000;
    const animation = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration, iterations: Infinity, easing: "linear" },
    );

    const slow = () => (animation.playbackRate = 0.25);
    const normal = () => (animation.playbackRate = 1);
    track.addEventListener("pointerenter", slow);
    track.addEventListener("pointerleave", normal);

    cleanups.push(() => {
      animation.cancel();
      track.removeEventListener("pointerenter", slow);
      track.removeEventListener("pointerleave", normal);
    });
  }
  return () => cleanups.forEach((fn) => fn());
}

/* ------------------------------------------------------------------ burst */

function setupBurst() {
  const onClick = (event: MouseEvent) => {
    const el = (event.target as Element | null)?.closest?.("[data-burst]");
    if (el) burstFrom(el, Number(el.getAttribute("data-burst")) || 16);
  };
  document.addEventListener("click", onClick);
  return () => document.removeEventListener("click", onClick);
}

/* --------------------------------------------------------------- provider */

/**
 * One global motion layer, as the handoff asks for. Screens opt in through
 * data attributes (`data-reveal`, `data-tilt`, `data-magnetic`, `data-grow`,
 * `data-count`, `data-float`, `data-drift`, `data-marquee`, `data-burst`)
 * rather than importing anything.
 *
 * Everything re-scans on navigation and when nodes are added, since App
 * Router swaps content without remounting this provider.
 */
export function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const flags: Flags = {
      reduced: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
      // Lift, tilt and magnetic are meaningless without a real pointer, and
      // on touch they fire on tap and stick.
      canHover: window.matchMedia("(hover: hover) and (pointer: fine)").matches,
    };

    let cleanups: (() => void)[] = [];
    const scan = () => {
      cleanups.push(
        setupReveals(flags),
        setupCardLift(flags),
        setupTilt(flags),
        setupMagnetic(flags),
        setupGrow(flags),
        setupCountUp(flags),
        setupFloatAndDrift(flags),
        setupMarquee(flags),
      );
    };

    // App Router hydrates page segments separately from the root layout, so
    // scanning immediately can touch nodes React hasn't reconciled yet.
    // Two frames puts this safely after hydration and first paint.
    let first = requestAnimationFrame(() => {
      first = requestAnimationFrame(scan);
    });
    const globals = [setupPressSpring(flags), setupBurst()];

    // Content that arrives later (loaded lists, opened sheets) still gets wired.
    let queued = 0;
    const mutations = new MutationObserver(() => {
      cancelAnimationFrame(queued);
      queued = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(first);
      cancelAnimationFrame(queued);
      mutations.disconnect();
      cleanups.forEach((fn) => fn());
      globals.forEach((fn) => fn());
      cleanups = [];
    };
  }, [pathname]);

  return null;
}
