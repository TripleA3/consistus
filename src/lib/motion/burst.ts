/**
 * Confetti burst — fired on join, purchase success, vote and winner
 * announcements.
 *
 * Particles are appended to <body> as fixed-position nodes and removed when
 * their animation finishes, so nothing accumulates in the DOM.
 */

const COLOURS = ["#c6f432", "#7b7dec", "#3f38c4", "#ffb020", "#ff5d8f"];
const EASE = "cubic-bezier(.2,.8,.3,1)";

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Throws `n` particles out from the viewport point (x, y). */
export function burst(x: number, y: number, n = 16) {
  if (typeof document === "undefined" || prefersReducedMotion()) return;

  for (let i = 0; i < n; i += 1) {
    const particle = document.createElement("span");
    const size = 5 + Math.random() * 7;
    const round = Math.random() < 0.5;

    particle.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${
      COLOURS[i % COLOURS.length]
    };border-radius:${round ? "50%" : "2px"};pointer-events:none;z-index:9999;will-change:transform,opacity`;
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = 40 + Math.random() * 70;
    const endX = Math.cos(angle) * distance;
    // Gravity pulls every particle down by the end of its arc.
    const endY = Math.sin(angle) * distance + 30;

    particle
      .animate(
        [
          { transform: "translate(-50%, -50%) rotate(0deg) scale(1)", opacity: 1 },
          {
            transform: `translate(calc(-50% + ${endX}px), calc(-50% + ${endY}px)) rotate(${
              Math.random() * 540
            }deg) scale(.3)`,
            opacity: 0,
          },
        ],
        { duration: 700 + Math.random() * 400, easing: EASE, fill: "forwards" },
      )
      .addEventListener("finish", () => particle.remove());
  }
}

/** Bursts from the centre of an element. */
export function burstFrom(element: Element, n = 16) {
  const rect = element.getBoundingClientRect();
  burst(rect.left + rect.width / 2, rect.top + rect.height / 2, n);
}
