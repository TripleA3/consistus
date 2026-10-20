"use client";

import { useState } from "react";
import { SealCheck, User as UserIcon } from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, CoverPlaceholder } from "@/components/kit";
import { FavoriteButton } from "@/components/favorites/FavoriteButton";
import { compact, money } from "@/lib/format";
import { talentPhoto } from "@/lib/images";
import type { TalentProfile, User } from "@/lib/types";

const CATEGORY_LABEL: Record<TalentProfile["category"], string> = {
  artist: "Artist",
  actor: "Actor",
  comedian: "Comedian",
  techie: "Techie",
  athlete: "Athlete",
  influencer: "Influencer",
};

export function TalentProfileHeader({
  talent,
  profile,
}: {
  talent: User;
  profile: TalentProfile;
}) {
  const [following, setFollowing] = useState(false);

  return (
    <Card flush className="mb-[var(--section-gap)]">
      <CoverPlaceholder
        src={talentPhoto(talent.id, talent.name)}
        alt=""
        seed={talent.id}
        className="aspect-[3/1]"
      />

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          {/* Pulled up so the avatar straddles the cover, as on the design. */}
          <span className="-mt-12 flex size-20 shrink-0 items-center justify-center rounded-full border-4 border-card bg-secondary text-secondary-foreground">
            <UserIcon size={32} weight="bold" />
          </span>

          <Button
            variant={following ? "outline" : "cta"}
            size="sm"
            aria-pressed={following}
            onClick={() => setFollowing((value) => !value)}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </div>

        <h2 className="mt-2 flex items-center gap-1.5 text-headline-sm">
          {talent.name}
          {profile.verified ? (
            <SealCheck size={20} weight="fill" className="text-link" aria-label="Verified" />
          ) : null}
        </h2>

        <p className="text-body-md text-muted-foreground">
          {CATEGORY_LABEL[profile.category]} · {compact(profile.followerCount)} followers
        </p>

        <p className="mt-3 text-body-lg text-muted-foreground">{profile.bio}</p>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <ButtonLink
            href={`/talent/${talent.id}/request/personalised-video`}
            size="lg"
            className="flex-1"
          >
            Video · {money(profile.ratePerVideo)}
          </ButtonLink>

          <ButtonLink
            href={`/talent/${talent.id}/request/special-appearance`}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Appearance · {money(profile.ratePerAppearance)}
          </ButtonLink>

          <FavoriteButton
            talentId={talent.id}
            withLabel
            className="h-[52px] justify-center rounded-pill border border-border px-5 sm:w-auto"
          />
        </div>
      </div>
    </Card>
  );
}
