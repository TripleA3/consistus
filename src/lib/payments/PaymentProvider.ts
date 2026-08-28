import type { PaymentIntentResult, PaymentMethodType } from "@/lib/types";

export interface CreatePaymentIntentInput {
  amount: number;
  currency: string;
  method: PaymentMethodType;
  reference: string;
}

/**
 * Payment provider boundary. Fannero has no real payment integration yet —
 * every screen builds against this interface and `FakePaymentProvider` so a
 * real Paystack/Flutterwave adapter can drop in later without touching UI.
 */
export interface PaymentProvider {
  createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult>;
  confirmBankTransfer(intentId: string): Promise<PaymentIntentResult>;
  confirmCardPayment(intentId: string): Promise<PaymentIntentResult>;
}
