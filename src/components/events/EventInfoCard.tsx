import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Icon } from "@/components/ui/Icon";
import type { EventItem } from "@/lib/types";

const categoryLabel: Record<EventItem["category"], string> = {
  concerts: "Concerts",
  nightlife: "Nightlife",
  "tech-and-gaming": "Tech & Gaming",
  "food-and-drinks": "Food & Drinks",
  networking: "Networking",
};

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: undefined,
  day: "numeric",
  month: "long",
  hour: "numeric",
  minute: "2-digit",
});

type EventInfoCardProps = {
  event: EventItem;
};

export function EventInfoCard({ event }: EventInfoCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] shadow-[0px_0px_80px_0px_rgba(228,232,247,0.4)]">
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:gap-10 sm:p-8">
        <ImagePlaceholder
          id={event.coverImage}
          label={event.title}
          className="h-64 w-full rounded-2xl sm:h-[383px] sm:w-[45%]"
        />
        <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-3xl font-semibold uppercase text-text sm:text-[36px]">
              {event.title}
            </h1>
            <p className="text-lg text-text">{categoryLabel[event.category]}</p>
            <p className="text-sm font-medium text-text/80">{event.description}</p>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-text">Date and time</h2>
            <div className="flex items-center gap-2 text-base font-medium text-text/80">
              <Icon name="calendar" className="size-5" />
              {dateTimeFormatter.format(new Date(event.startsAt))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-2xl font-semibold text-text">Location</h2>
            <div className="flex items-start gap-2 text-base font-medium text-text/80">
              <Icon name="user" className="mt-0.5 size-5 shrink-0" />
              <span>
                {event.venue}, {event.address}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-card-border px-6 py-4 sm:px-8">
        <p className="flex items-center gap-1 text-lg font-semibold text-text">
          By {event.organizerName}
        </p>
        <div className="flex items-center gap-4 text-text/70">
          <button type="button" aria-label="Save to favorites">
            <Icon name="heart" className="size-6" />
          </button>
          <button type="button" aria-label="Bookmark event">
            <Icon name="ticket" className="size-6" />
          </button>
        </div>
      </div>
    </div>
  );
}
