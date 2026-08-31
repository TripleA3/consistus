export type BankTransferStatus =
  | "awaiting_transfer"
  | "pending_confirmation"
  | "processing"
  | "succeeded"
  | "failed"
  | "expired";

export type BankTransferEvent =
  | { type: "FAN_CONFIRMED_TRANSFER" }
  | { type: "TIMER_EXPIRED" }
  | { type: "VERIFICATION_STARTED" }
  | { type: "VERIFICATION_SUCCEEDED" }
  | { type: "VERIFICATION_FAILED" }
  | { type: "RETRY" };

/**
 * Pure state transition function for the bank-transfer payment flow — the
 * "all 6 states" the brief calls for. No side effects, so it's cheap to
 * unit test; screens call this to decide what to render next rather than
 * juggling status strings inline.
 */
export function transition(
  status: BankTransferStatus,
  event: BankTransferEvent,
): BankTransferStatus {
  switch (status) {
    case "awaiting_transfer":
      if (event.type === "FAN_CONFIRMED_TRANSFER") return "pending_confirmation";
      if (event.type === "TIMER_EXPIRED") return "expired";
      return status;
    case "pending_confirmation":
      if (event.type === "VERIFICATION_STARTED") return "processing";
      return status;
    case "processing":
      if (event.type === "VERIFICATION_SUCCEEDED") return "succeeded";
      if (event.type === "VERIFICATION_FAILED") return "failed";
      return status;
    case "failed":
      if (event.type === "RETRY") return "awaiting_transfer";
      return status;
    case "expired":
      if (event.type === "RETRY") return "awaiting_transfer";
      return status;
    case "succeeded":
      return status;
    default:
      return status;
  }
}

export const BANK_TRANSFER_STATUS_COPY: Record<
  BankTransferStatus,
  { title: string; description: string }
> = {
  awaiting_transfer: {
    title: "Make your transfer",
    description: "Send the exact amount to the account below, then confirm.",
  },
  pending_confirmation: {
    title: "Confirming your transfer",
    description: "We've noted your confirmation and are checking with your bank.",
  },
  processing: {
    title: "Verifying payment",
    description: "This usually takes a few seconds.",
  },
  succeeded: {
    title: "Payment received",
    description: "Your tickets are confirmed.",
  },
  failed: {
    title: "We couldn't verify your transfer",
    description: "Double check the details and try again, or use a different method.",
  },
  expired: {
    title: "Transfer window expired",
    description: "This payment session timed out before a transfer was confirmed.",
  },
};
