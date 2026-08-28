import { Icon, type IconName } from "@/components/ui/Icon";

const steps: { icon: IconName; title: string; description: string }[] = [
  {
    icon: "search",
    title: "Discover",
    description:
      "Browse events and talent by category, or search for the person or show you're after.",
  },
  {
    icon: "ticket",
    title: "Book or request",
    description:
      "Buy tickets to an event, or commission a personalised video, shoutout, or appearance.",
  },
  {
    icon: "video",
    title: "Enjoy the moment",
    description:
      "Get your ticket, your video, or your confirmed appearance — delivered straight to you.",
  },
];

/**
 * The Figma frame for this section (under 6007:41251) is an unbuilt grey
 * placeholder with no content. Built to a reasonable spec here — see
 * docs/open-questions.md.
 */
export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works-heading" className="flex flex-col gap-6">
      <h2 id="how-it-works-heading" className="text-2xl font-bold text-text">
        How It Works
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {steps.map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col gap-3 rounded-xl border border-card-border bg-white p-5"
          >
            <div className="flex size-10 items-center justify-center rounded-full bg-lime-100 text-lime-500">
              <Icon name={step.icon} className="size-5" />
            </div>
            <p className="text-sm font-semibold text-slate-400">Step {index + 1}</p>
            <h3 className="text-base font-semibold text-ink">{step.title}</h3>
            <p className="text-sm text-slate-500">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
