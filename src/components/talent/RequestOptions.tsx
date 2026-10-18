import { EnvelopeSimple, Microphone } from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { ButtonLink } from "@/components/kit";
import type { RequestType } from "@/lib/types";

const OPTIONS: { type: RequestType; label: string; icon: PhosphorIcon }[] = [
  { type: "guest-speaker", label: "Guest speaker", icon: Microphone },
  { type: "event-invitation", label: "Event invitation", icon: EnvelopeSimple },
];

/**
 * The video and special-appearance requests get top billing as CTAs in the
 * profile header; guest-speaker and event-invitation are secondary paths
 * to the same request flow.
 */
export function RequestOptions({ talentId }: { talentId: string }) {
  return (
    <div className="mb-[var(--section-gap)] grid grid-cols-2 gap-3">
      {OPTIONS.map((option) => (
        <ButtonLink
          key={option.type}
          href={`/talent/${talentId}/request/${option.type}`}
          variant="outline"
          className="bg-card"
          leading={<option.icon size={17} weight="bold" />}
        >
          {option.label}
        </ButtonLink>
      ))}
    </div>
  );
}
