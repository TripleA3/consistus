"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { TalentProfile, User } from "@/lib/types";

const categoryLabel: Record<TalentProfile["category"], string> = {
  artist: "Artist",
  actor: "Actor",
  comedian: "Comedian",
  techie: "Techie",
  athlete: "Athlete",
  influencer: "Influencer",
};

const currencyFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const followerFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

type TalentProfileHeaderProps = {
  talent: User;
  profile: TalentProfile;
};

export function TalentProfileHeader({ talent, profile }: TalentProfileHeaderProps) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] shadow-[0px_0px_80px_0px_rgba(228,232,247,0.4)]">
      <ImagePlaceholder id={talent.id} className="h-40 w-full sm:h-56" />
      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <ImagePlaceholder
              id={`${talent.id}-avatar`}
              className="-mt-16 size-24 shrink-0 rounded-full border-4 border-white"
            />
            <div className="flex flex-col gap-1 pt-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold text-text">{talent.name}</h1>
                {profile.verified ? (
                  <span
                    className="flex size-5 items-center justify-center rounded-full bg-lime-500 text-white"
                    title="Verified talent"
                  >
                    <Icon name="check" className="size-3" />
                  </span>
                ) : null}
              </div>
              <p className="text-sm text-slate-500">
                {categoryLabel[profile.category]} ·{" "}
                {followerFormatter.format(profile.followerCount)} followers
              </p>
            </div>
          </div>
          <Button
            variant={following ? "neutral" : "accent"}
            className="rounded-full"
            onClick={() => setFollowing((f) => !f)}
            aria-pressed={following}
          >
            {following ? "Following" : "Follow"}
          </Button>
        </div>

        <p className="max-w-2xl text-base leading-relaxed text-text/80">{profile.bio}</p>

        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={`/talent/${talent.id}/request/personalised-video`}
            variant="accent"
            className="flex-1 justify-center rounded-full"
          >
            Request a video — {currencyFormatter.format(profile.ratePerVideo)}
          </ButtonLink>
          <ButtonLink
            href={`/talent/${talent.id}/request/special-appearance`}
            variant="outline-light"
            className="flex-1 justify-center rounded-full"
          >
            Book an appearance — {currencyFormatter.format(profile.ratePerAppearance)}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
