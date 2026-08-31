import { ButtonLink } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { RequestType } from "@/lib/types";

const options: { type: RequestType; label: string; icon: IconName }[] = [
  { type: "guest-speaker", label: "Guest speaker", icon: "user" },
  { type: "event-invitation", label: "Event invitation", icon: "mail" },
];

type RequestOptionsProps = {
  talentId: string;
};

/**
 * The video and special-appearance requests get top billing as CTAs on the
 * profile header; guest-speaker and event-invitation are secondary paths
 * to the same request flow.
 */
export function RequestOptions({ talentId }: RequestOptionsProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {options.map((option) => (
        <ButtonLink
          key={option.type}
          href={`/talent/${talentId}/request/${option.type}`}
          variant="neutral"
          size="sm"
          className="flex-1 justify-center gap-2"
        >
          <Icon name={option.icon} className="size-4" />
          {option.label}
        </ButtonLink>
      ))}
    </div>
  );
}
