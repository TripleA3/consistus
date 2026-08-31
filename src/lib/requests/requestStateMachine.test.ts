import { describe, expect, it } from "vitest";
import { transitionRequest } from "@/lib/requests/requestStateMachine";
import type { RequestStatus } from "@/lib/types";

describe("request state machine", () => {
  it("moves from draft to submitted, or to cancelled", () => {
    expect(transitionRequest("draft", { type: "SUBMIT" })).toBe("submitted");
    expect(transitionRequest("draft", { type: "CANCEL" })).toBe("cancelled");
  });

  it("moves from submitted to accepted or declined", () => {
    expect(transitionRequest("submitted", { type: "ACCEPT" })).toBe("accepted");
    expect(transitionRequest("submitted", { type: "DECLINE" })).toBe("declined");
  });

  it("walks the happy path through to completed", () => {
    let status: RequestStatus = "draft";
    status = transitionRequest(status, { type: "SUBMIT" });
    status = transitionRequest(status, { type: "ACCEPT" });
    status = transitionRequest(status, { type: "START_WORK" });
    status = transitionRequest(status, { type: "DELIVER" });
    status = transitionRequest(status, { type: "FAN_CONFIRMS" });
    expect(status).toBe("completed");
  });

  it("allows cancelling from submitted, accepted, or in-progress", () => {
    expect(transitionRequest("submitted", { type: "CANCEL" })).toBe("cancelled");
    expect(transitionRequest("accepted", { type: "CANCEL" })).toBe("cancelled");
    expect(transitionRequest("in-progress", { type: "CANCEL" })).toBe("cancelled");
  });

  it("treats declined, cancelled, and completed as terminal", () => {
    const terminal: RequestStatus[] = ["declined", "cancelled", "completed"];
    const allEvents: RequestEventLike[] = [
      { type: "SUBMIT" },
      { type: "ACCEPT" },
      { type: "DECLINE" },
      { type: "START_WORK" },
      { type: "DELIVER" },
      { type: "FAN_CONFIRMS" },
      { type: "CANCEL" },
    ];
    for (const status of terminal) {
      for (const event of allEvents) {
        expect(transitionRequest(status, event)).toBe(status);
      }
    }
  });

  it("ignores events that don't apply to the current state", () => {
    expect(transitionRequest("accepted", { type: "DELIVER" })).toBe("accepted");
    expect(transitionRequest("delivered", { type: "ACCEPT" })).toBe("delivered");
  });
});

type RequestEventLike = Parameters<typeof transitionRequest>[1];
