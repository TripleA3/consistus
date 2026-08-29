import { Icon } from "@/components/ui/Icon";
import type { EventItem } from "@/lib/types";

type AboutEventProps = {
  event: EventItem;
};

export function AboutEvent({ event }: AboutEventProps) {
  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h2 className="text-2xl font-semibold text-text">About This Event</h2>
        <p className="text-lg leading-relaxed text-text/80">{event.description}</p>
      </div>
      <div className="flex flex-col gap-6">
        <h3 className="text-xl font-medium text-text">What To Expect</h3>
        <ul className="flex flex-col gap-4">
          {event.highlights.map((highlight) => (
            <li key={highlight} className="flex items-center gap-4 text-lg text-text/80">
              <Icon name="check" className="size-6 shrink-0 text-lime-500" />
              {highlight}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
