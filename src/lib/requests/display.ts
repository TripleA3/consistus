import type { StatusTone } from "@/components/kit";
import type { RequestStatus, RequestType } from "@/lib/types";

/** Shared by the fan's list and the talent's inbox, so they can't drift. */
export const REQUEST_TYPE_LABEL: Record<RequestType, string> = {
  "personalised-video": "Personalised video",
  "guest-speaker": "Guest speaker",
  "special-appearance": "Special appearance",
  "event-invitation": "Event invitation",
};

export const REQUEST_STATUS_TONE: Record<RequestStatus, StatusTone> = {
  draft: "neutral",
  submitted: "info",
  accepted: "info",
  declined: "danger",
  "in-progress": "warning",
  delivered: "info",
  completed: "success",
  cancelled: "neutral",
};
