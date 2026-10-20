import Link from "next/link";
import { SealCheck } from "@phosphor-icons/react/dist/ssr";
import { CoverPlaceholder } from "@/components/kit";
import { money } from "@/lib/format";
import { talentPhoto } from "@/lib/images";
import type { TalentProfile, User } from "@/lib/types";

const CATEGORY_LABEL: Record<TalentProfile["category"], string> = {
  artist: "Music",
  actor: "Film & TV",
  comedian: "Comedy",
  techie: "Tech",
  athlete: "Sports",
  influencer: "Creator",
};

/**
 * The Top celebrities tile from the design: a tall portrait carrying its
 * category badge, with the name and video rate sitting underneath on the
 * page rather than on a card.
 */
export function CelebrityCard({ talent, profile }: { talent: User; profile: TalentProfile }) {
  return (
    <Link href={`/talent/${talent.id}`} className="group block">
      <div className="relative overflow-hidden rounded-lg">
        <CoverPlaceholder
          src={talentPhoto(talent.id, talent.name)}
          alt=""
          seed={talent.id}
          className="aspect-[195/244] rounded-lg"
        />
        <span className="absolute left-2.5 top-2.5 rounded-pill bg-card/92 px-2.5 py-1 text-label-md text-foreground backdrop-blur-[6px]">
          {CATEGORY_LABEL[profile.category]}
        </span>
      </div>

      <p className="mt-2 flex items-center gap-1 text-title-md">
        <span className="truncate">{talent.name}</span>
        {profile.verified ? (
          <SealCheck size={15} weight="fill" className="shrink-0 text-link" aria-label="Verified" />
        ) : null}
      </p>
      <p className="text-body-md text-muted-foreground">
        Video from <span className="font-bold text-foreground">{money(profile.ratePerVideo)}</span>
      </p>
    </Link>
  );
}
