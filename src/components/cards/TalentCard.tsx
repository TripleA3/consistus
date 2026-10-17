import { SealCheck, User as UserIcon } from "@phosphor-icons/react/dist/ssr";
import { Card, CoverPlaceholder } from "@/components/kit";
import { compact, money } from "@/lib/format";
import type { TalentProfile, User } from "@/lib/types";

const CATEGORY_LABELS: Record<TalentProfile["category"], string> = {
  artist: "Artist",
  actor: "Actor",
  comedian: "Comedian",
  techie: "Techie",
  athlete: "Athlete",
  influencer: "Influencer",
};

/**
 * A talent in the Discover rail. Fixed width so the rail scrolls
 * sideways on a phone rather than squeezing.
 */
export function TalentCard({ talent, profile }: { talent: User; profile: TalentProfile }) {
  return (
    <Card href={`/talent/${talent.id}`} flush className="w-[164px] shrink-0 sm:w-[184px]">
      <CoverPlaceholder className="aspect-square">
        <UserIcon size={34} />
      </CoverPlaceholder>

      <div className="p-3">
        <h3 className="flex items-center gap-1 text-title-md">
          <span className="truncate">{talent.name}</span>
          {profile.verified ? (
            <SealCheck size={15} weight="fill" className="shrink-0 text-link" aria-label="Verified" />
          ) : null}
        </h3>

        <p className="mt-0.5 text-body-md text-muted-foreground">
          {CATEGORY_LABELS[profile.category]} · {compact(profile.followerCount)}
        </p>

        <p className="mt-2 text-label-lg">
          <span className="text-link">{money(profile.ratePerVideo)}</span>
          <span className="font-normal text-muted-foreground"> / video</span>
        </p>
      </div>
    </Card>
  );
}
