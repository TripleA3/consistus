import { Card } from "@/components/ui/Card";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { ButtonLink } from "@/components/ui/Button";
import type { TalentProfile, User } from "@/lib/types";

type CelebrityCardProps = {
  talent: User;
  profile: TalentProfile;
};

const categoryLabel: Record<TalentProfile["category"], string> = {
  artist: "Artist",
  actor: "Actor",
  comedian: "Comedian",
  techie: "Techie",
  athlete: "Athlete",
  influencer: "Influencer",
};

export function CelebrityCard({ talent, profile }: CelebrityCardProps) {
  return (
    <Card className="flex h-[351px] w-full max-w-[289px] shrink-0 flex-col">
      <ImagePlaceholder id={talent.id} className="h-[199px] w-full" />
      <div className="flex flex-1 flex-col justify-between gap-3 bg-navy px-3 py-2.5 text-white">
        <div>
          <p className="text-base font-medium">{talent.name}</p>
          <p className="text-sm text-white/70">{categoryLabel[profile.category]}</p>
        </div>
        <div className="flex items-center gap-3">
          <ButtonLink
            href={`/talent/${talent.id}`}
            variant="outline"
            size="sm"
            className="flex-1 justify-center"
          >
            View details
          </ButtonLink>
          <ButtonLink
            href={`/talent/${talent.id}/request`}
            variant="outline"
            size="sm"
            className="flex-1 justify-center"
          >
            Request
          </ButtonLink>
        </div>
      </div>
    </Card>
  );
}
