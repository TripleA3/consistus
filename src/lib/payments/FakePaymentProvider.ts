import type { PaymentIntentResult } from "@/lib/types";
import type { CreatePaymentIntentInput, PaymentProvider } from "@/lib/payments/PaymentProvider";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Stands in for Paystack/Flutterwave. Deterministic rather than random so
 * the UI and any future test can exercise both outcomes on demand: a
 * reference ending in "fail" resolves to a failed payment, everything else
 * succeeds after a short simulated delay.
 */
export class FakePaymentProvider implements PaymentProvider {
  private intents = new Map<string, PaymentIntentResult>();

  async createIntent(input: CreatePaymentIntentInput): Promise<PaymentIntentResult> {
    const intent: PaymentIntentResult = {
      id: `pi_${input.reference}`,
      status: "requires_confirmation",
      amount: input.amount,
      currency: input.currency,
      method: input.method,
      reference: input.reference,
    };
    this.intents.set(intent.id, intent);
    return intent;
  }

  async confirmBankTransfer(intentId: string): Promise<PaymentIntentResult> {
    return this.resolveIntent(intentId);
  }

  async confirmCardPayment(intentId: string): Promise<PaymentIntentResult> {
    return this.resolveIntent(intentId);
  }

  private async resolveIntent(intentId: string): Promise<PaymentIntentResult> {
    await wait(800);
    const intent = this.intents.get(intentId);
    if (!intent) {
      throw new Error(`Unknown payment intent: ${intentId}`);
    }
    const shouldFail = intent.reference?.endsWith("fail") ?? false;
    const resolved: PaymentIntentResult = {
      ...intent,
      status: shouldFail ? "failed" : "succeeded",
    };
    this.intents.set(intentId, resolved);
    return resolved;
  }
}

export const paymentProvider = new FakePaymentProvider();
