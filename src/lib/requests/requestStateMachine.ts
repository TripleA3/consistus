import type { RequestStatus } from "@/lib/types";

export type RequestEvent =
  | { type: "SUBMIT" }
  | { type: "ACCEPT" }
  | { type: "DECLINE" }
  | { type: "START_WORK" }
  | { type: "DELIVER" }
  | { type: "FAN_CONFIRMS" }
  | { type: "CANCEL" };

/**
 * Pure state transition function for a fan's request to talent (video,
 * guest speaker, special appearance, or event invitation) — the "request
 * state machine" the brief calls for tests on. No side effects.
 */
export function transitionRequest(
  status: RequestStatus,
  event: RequestEvent,
): RequestStatus {
  switch (status) {
    case "draft":
      if (event.type === "SUBMIT") return "submitted";
      if (event.type === "CANCEL") return "cancelled";
      return status;
    case "submitted":
      if (event.type === "ACCEPT") return "accepted";
      if (event.type === "DECLINE") return "declined";
      if (event.type === "CANCEL") return "cancelled";
      return status;
    case "accepted":
      if (event.type === "START_WORK") return "in-progress";
      if (event.type === "CANCEL") return "cancelled";
      return status;
    case "in-progress":
      if (event.type === "DELIVER") return "delivered";
      if (event.type === "CANCEL") return "cancelled";
      return status;
    case "delivered":
      if (event.type === "FAN_CONFIRMS") return "completed";
      return status;
    case "declined":
    case "cancelled":
    case "completed":
      return status;
    default:
      return status;
  }
}

export const REQUEST_STATUS_LABEL: Record<RequestStatus, string> = {
  draft: "Draft",
  submitted: "Awaiting response",
  accepted: "Accepted",
  declined: "Declined",
  "in-progress": "In progress",
  delivered: "Delivered",
  completed: "Completed",
  cancelled: "Cancelled",
};
