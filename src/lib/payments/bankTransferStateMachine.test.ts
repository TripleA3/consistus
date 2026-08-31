import { describe, expect, it } from "vitest";
import { transition, type BankTransferStatus } from "@/lib/payments/bankTransferStateMachine";

describe("bank transfer state machine", () => {
  it("moves from awaiting_transfer to pending_confirmation on fan confirmation", () => {
    expect(transition("awaiting_transfer", { type: "FAN_CONFIRMED_TRANSFER" })).toBe(
      "pending_confirmation",
    );
  });

  it("expires if the timer runs out while awaiting transfer", () => {
    expect(transition("awaiting_transfer", { type: "TIMER_EXPIRED" })).toBe("expired");
  });

  it("moves from pending_confirmation to processing once verification starts", () => {
    expect(transition("pending_confirmation", { type: "VERIFICATION_STARTED" })).toBe(
      "processing",
    );
  });

  it("resolves processing to succeeded or failed", () => {
    expect(transition("processing", { type: "VERIFICATION_SUCCEEDED" })).toBe("succeeded");
    expect(transition("processing", { type: "VERIFICATION_FAILED" })).toBe("failed");
  });

  it("allows retrying from failed and expired back to awaiting_transfer", () => {
    expect(transition("failed", { type: "RETRY" })).toBe("awaiting_transfer");
    expect(transition("expired", { type: "RETRY" })).toBe("awaiting_transfer");
  });

  it("is a terminal state once succeeded", () => {
    const allEvents: Array<Parameters<typeof transition>[1]> = [
      { type: "FAN_CONFIRMED_TRANSFER" },
      { type: "TIMER_EXPIRED" },
      { type: "VERIFICATION_STARTED" },
      { type: "VERIFICATION_SUCCEEDED" },
      { type: "VERIFICATION_FAILED" },
      { type: "RETRY" },
    ];
    for (const event of allEvents) {
      expect(transition("succeeded", event)).toBe("succeeded");
    }
  });

  it("ignores events that don't apply to the current state", () => {
    const irrelevant: BankTransferStatus = "awaiting_transfer";
    expect(transition(irrelevant, { type: "VERIFICATION_SUCCEEDED" })).toBe("awaiting_transfer");
    expect(transition("processing", { type: "FAN_CONFIRMED_TRANSFER" })).toBe("processing");
  });
});
