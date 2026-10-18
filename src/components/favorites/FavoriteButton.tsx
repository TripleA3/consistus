"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "@phosphor-icons/react/dist/ssr";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  fetchFavoriteIds,
  toggleFavoriteEvent,
  toggleFavoriteTalent,
} from "@/lib/api/favorites";

type FavoriteButtonProps = {
  /** Exactly one of these identifies what's being saved. */
  eventId?: string;
  talentId?: string;
  className?: string;
  /** Shows a text label beside the heart, for wider surfaces. */
  withLabel?: boolean;
};

/**
 * Heart toggle for saving an event or a talent.
 *
 * Signed-out visitors are sent to sign-in rather than shown a heart that
 * silently does nothing — there's nowhere to save to without an account.
 */
export function FavoriteButton({
  eventId,
  talentId,
  className = "",
  withLabel = false,
}: FavoriteButtonProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchFavoriteIds(user.id).then((ids) => {
      setSaved(
        eventId ? ids.eventIds.includes(eventId) : talentId ? ids.talentIds.includes(talentId) : false,
      );
    });
  }, [user, eventId, talentId]);

  async function toggle() {
    if (!user) {
      router.push("/sign-in");
      return;
    }
    setBusy(true);
    try {
      const next = eventId
        ? await toggleFavoriteEvent(user.id, eventId)
        : talentId
          ? await toggleFavoriteTalent(user.id, talentId)
          : false;
      setSaved(next);
    } finally {
      setBusy(false);
    }
  }

  const label = saved ? "Remove from favorites" : "Save to favorites";

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={label}
      aria-pressed={saved}
      className={`inline-flex items-center gap-2 transition-colors disabled:opacity-50 ${
        saved ? "text-destructive" : "text-muted-foreground hover:text-destructive"
      } ${className}`}
    >
      <Heart size={22} weight={saved ? "fill" : "bold"} />
      {withLabel ? (
        <span className="text-label-lg">{saved ? "Saved" : "Save"}</span>
      ) : null}
    </button>
  );
}
