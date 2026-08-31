import type { TicketTier } from "@/lib/types";

export const SERVICE_FEE_RATE = 0.035;
export const SERVICE_FEE_FIXED = 100;

export type CartLine = {
  tier: TicketTier;
  quantity: number;
};

export type OrderTotals = {
  subtotal: number;
  fees: number;
  total: number;
};

export function calculateLineTotal(line: CartLine): number {
  return line.tier.price * line.quantity;
}

export function calculateSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, line) => sum + calculateLineTotal(line), 0);
}

/** Flat percentage service fee plus a fixed charge, waived on an empty cart. */
export function calculateFees(subtotal: number): number {
  if (subtotal <= 0) return 0;
  return Math.round(subtotal * SERVICE_FEE_RATE + SERVICE_FEE_FIXED);
}

export function calculateOrderTotals(lines: CartLine[]): OrderTotals {
  const subtotal = calculateSubtotal(lines);
  const fees = calculateFees(subtotal);
  return { subtotal, fees, total: subtotal + fees };
}

export function availableQuantity(tier: TicketTier): number {
  return Math.max(0, tier.quantityAvailable - tier.quantitySold);
}
