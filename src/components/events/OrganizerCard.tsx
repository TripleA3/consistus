"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/ui/ImagePlaceholder";
import { Button } from "@/components/ui/Button";
import type { EventItem } from "@/lib/types";

type OrganizerCardProps = {
  event: EventItem;
};

const followerFormatter = new Intl.NumberFormat("en-US", { notation: "compact" });

export function OrganizerCard({ event }: OrganizerCardProps) {
  const [following, setFollowing] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-text">Organized By</h2>
      <div className="flex items-center justify-between rounded-xl border border-black/10 p-4">
        <div className="flex items-center gap-3">
          <ImagePlaceholder id={event.hostTalentId} className="size-11 shrink-0 rounded-full" />
          <div>
            <p className="text-lg font-medium text-text">{event.organizerName}</p>
            <p className="text-sm font-medium text-text/70">
              {followerFormatter.format(event.organizerFollowers)} Followers
            </p>
          </div>
        </div>
        <Button
          variant={following ? "neutral" : "accent"}
          size="sm"
          className="rounded-full"
          onClick={() => setFollowing((f) => !f)}
          aria-pressed={following}
        >
          {following ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
}
