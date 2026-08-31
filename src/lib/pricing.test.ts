import { describe, expect, it } from "vitest";
import {
  calculateFees,
  calculateLineTotal,
  calculateOrderTotals,
  calculateSubtotal,
  availableQuantity,
  type CartLine,
} from "@/lib/pricing";
import type { TicketTier } from "@/lib/types";

function makeTier(overrides: Partial<TicketTier> = {}): TicketTier {
  return {
    id: "tier-1",
    eventId: "event-1",
    name: "Regular",
    price: 10000,
    currency: "NGN",
    quantityAvailable: 100,
    quantitySold: 40,
    perks: [],
    ...overrides,
  };
}

describe("calculateLineTotal", () => {
  it("multiplies price by quantity", () => {
    expect(calculateLineTotal({ tier: makeTier({ price: 5000 }), quantity: 3 })).toBe(15000);
  });

  it("is zero for zero quantity", () => {
    expect(calculateLineTotal({ tier: makeTier(), quantity: 0 })).toBe(0);
  });
});

describe("calculateSubtotal", () => {
  it("sums multiple lines", () => {
    const lines: CartLine[] = [
      { tier: makeTier({ price: 10000 }), quantity: 2 },
      { tier: makeTier({ price: 45000 }), quantity: 1 },
    ];
    expect(calculateSubtotal(lines)).toBe(65000);
  });

  it("returns zero for an empty cart", () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe("calculateFees", () => {
  it("waives fees on an empty subtotal", () => {
    expect(calculateFees(0)).toBe(0);
  });

  it("applies the percentage rate plus the fixed charge", () => {
    // 10000 * 0.035 + 100 = 450
    expect(calculateFees(10000)).toBe(450);
  });

  it("rounds to the nearest whole currency unit", () => {
    // 333 * 0.035 = 11.655 -> +100 = 111.655 -> rounds to 112
    expect(calculateFees(333)).toBe(112);
  });
});

describe("calculateOrderTotals", () => {
  it("combines subtotal and fees into a total", () => {
    const lines: CartLine[] = [{ tier: makeTier({ price: 15000 }), quantity: 2 }];
    const totals = calculateOrderTotals(lines);
    expect(totals.subtotal).toBe(30000);
    expect(totals.fees).toBe(calculateFees(30000));
    expect(totals.total).toBe(totals.subtotal + totals.fees);
  });

  it("is all zeroes for an empty cart", () => {
    expect(calculateOrderTotals([])).toEqual({ subtotal: 0, fees: 0, total: 0 });
  });
});

describe("availableQuantity", () => {
  it("subtracts sold from available", () => {
    expect(availableQuantity(makeTier({ quantityAvailable: 100, quantitySold: 40 }))).toBe(60);
  });

  it("never goes negative", () => {
    expect(availableQuantity(makeTier({ quantityAvailable: 10, quantitySold: 25 }))).toBe(0);
  });
});
