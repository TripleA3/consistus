"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { EventItem, PaymentMethodType } from "@/lib/types";
import { calculateOrderTotals, type CartLine } from "@/lib/pricing";
import { createTicketOrder } from "@/lib/api/orders";
import { useAuth } from "@/lib/auth/AuthContext";

export type BuyerDetails = {
  name: string;
  email: string;
  phone: string;
};

type CheckoutState = {
  event: EventItem;
  quantities: Record<string, number>;
  buyer: BuyerDetails;
  paymentMethod: PaymentMethodType | null;
  reference: string;
};

type CheckoutContextValue = {
  event: EventItem;
  quantities: Record<string, number>;
  setQuantity: (tierId: string, quantity: number) => void;
  lines: CartLine[];
  totals: ReturnType<typeof calculateOrderTotals>;
  buyer: BuyerDetails;
  setBuyer: (buyer: BuyerDetails) => void;
  paymentMethod: PaymentMethodType | null;
  setPaymentMethod: (method: PaymentMethodType) => void;
  reference: string;
  /**
   * Persists the purchase once payment succeeds. Both payment methods call
   * this, so the order is recorded in exactly one place. Idempotent on the
   * checkout reference — calling it twice records one order.
   */
  recordOrder: (method: PaymentMethodType) => Promise<void>;
};

const CheckoutReactContext = createContext<CheckoutContextValue | null>(null);

function storageKey(eventId: string) {
  return `fannero-checkout-${eventId}`;
}

type StoredCheckoutState = Omit<CheckoutState, "event">;

export function CheckoutProvider({
  event,
  children,
}: {
  event: EventItem;
  children: ReactNode;
}) {
  const { user } = useAuth();
  const [state, setState] = useState<CheckoutState>(() => ({
    event,
    quantities: {},
    buyer: { name: "", email: "", phone: "" },
    paymentMethod: null,
    reference: `FAN-${event.id}-${Date.now().toString(36).toUpperCase()}`,
  }));
  const hydrated = useRef(false);

  // Hydrate from sessionStorage once on mount, so a reload or direct
  // navigation mid-checkout (e.g. landing straight on the payment step)
  // doesn't silently drop the cart. Falls back to the fresh default above
  // when nothing is stored, storage is unavailable, or parsing fails.
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey(event.id));
      if (raw) {
        const stored = JSON.parse(raw) as StoredCheckoutState;
        // One-time hydration from external storage on mount — not a
        // derived-state loop, so the extra render this causes is expected.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState((prev) => ({ ...prev, ...stored }));
      }
    } catch {
      // Ignore — private browsing or corrupted data, just start fresh.
    } finally {
      hydrated.current = true;
    }
  }, [event.id]);

  useEffect(() => {
    if (!hydrated.current) return;
    const toStore: StoredCheckoutState = {
      quantities: state.quantities,
      buyer: state.buyer,
      paymentMethod: state.paymentMethod,
      reference: state.reference,
    };
    try {
      sessionStorage.setItem(storageKey(event.id), JSON.stringify(toStore));
    } catch {
      // Ignore — e.g. storage full or disabled.
    }
  }, [state, event.id]);

  const setQuantity = useCallback((tierId: string, quantity: number) => {
    setState((prev) => ({
      ...prev,
      quantities: { ...prev.quantities, [tierId]: Math.max(0, quantity) },
    }));
  }, []);

  const setBuyer = useCallback((buyer: BuyerDetails) => {
    setState((prev) => ({ ...prev, buyer }));
  }, []);

  const setPaymentMethod = useCallback((method: PaymentMethodType) => {
    setState((prev) => ({ ...prev, paymentMethod: method }));
  }, []);

  const lines = useMemo<CartLine[]>(
    () =>
      event.ticketTiers
        .map((tier) => ({ tier, quantity: state.quantities[tier.id] ?? 0 }))
        .filter((line) => line.quantity > 0),
    [event.ticketTiers, state.quantities],
  );

  const totals = useMemo(() => calculateOrderTotals(lines), [lines]);

  const recordOrder = useCallback(
    async (method: PaymentMethodType) => {
      if (lines.length === 0) return;
      await createTicketOrder({
        eventId: event.id,
        buyerId: user?.id,
        buyerName: state.buyer.name,
        buyerEmail: state.buyer.email,
        buyerPhone: state.buyer.phone,
        reference: state.reference,
        paymentMethod: method,
        subtotal: totals.subtotal,
        fees: totals.fees,
        total: totals.total,
        currency: event.ticketTiers[0]?.currency ?? "NGN",
        items: lines.map((line) => ({
          tierId: line.tier.id,
          tierName: line.tier.name,
          unitPrice: line.tier.price,
          quantity: line.quantity,
        })),
      });
    },
    [event, lines, totals, state.buyer, state.reference, user?.id],
  );

  const value: CheckoutContextValue = {
    event,
    quantities: state.quantities,
    setQuantity,
    lines,
    totals,
    buyer: state.buyer,
    setBuyer,
    paymentMethod: state.paymentMethod,
    setPaymentMethod,
    reference: state.reference,
    recordOrder,
  };

  return (
    <CheckoutReactContext.Provider value={value}>{children}</CheckoutReactContext.Provider>
  );
}

export function useCheckout(): CheckoutContextValue {
  const ctx = useContext(CheckoutReactContext);
  if (!ctx) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return ctx;
}
