"use server";

import { desc, eq, inArray, or, sql } from "drizzle-orm";
import { db } from "@/db";
import { events, ticketOrderItems, ticketOrders, ticketTiers } from "@/db/schema";
import type {
  PaymentMethodType,
  TicketOrder,
  TicketOrderItem,
  TicketOrderWithEvent,
} from "@/lib/types";

function toOrderItem(row: typeof ticketOrderItems.$inferSelect): TicketOrderItem {
  return {
    id: row.id,
    orderId: row.orderId,
    tierId: row.tierId,
    tierName: row.tierName,
    unitPrice: row.unitPrice,
    quantity: row.quantity,
    lineTotal: row.lineTotal,
  };
}

function toOrder(
  row: typeof ticketOrders.$inferSelect,
  items: (typeof ticketOrderItems.$inferSelect)[],
): TicketOrder {
  return {
    id: row.id,
    eventId: row.eventId,
    buyerId: row.buyerId ?? undefined,
    buyerName: row.buyerName,
    buyerEmail: row.buyerEmail,
    buyerPhone: row.buyerPhone,
    reference: row.reference,
    paymentMethod: row.paymentMethod as PaymentMethodType,
    subtotal: row.subtotal,
    fees: row.fees,
    total: row.total,
    currency: row.currency,
    status: row.status,
    createdAt: row.createdAt.toISOString(),
    items: items.map(toOrderItem),
  };
}

export type CreateOrderInput = {
  eventId: string;
  buyerId?: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  reference: string;
  paymentMethod: PaymentMethodType;
  subtotal: number;
  fees: number;
  total: number;
  currency: string;
  items: { tierId: string; tierName: string; unitPrice: number; quantity: number }[];
};

/**
 * Records a paid order and moves the tickets out of inventory.
 *
 * Idempotent on `reference`: a resubmitted payment (double-click, back
 * button, a retried request) returns the order already recorded instead of
 * charging inventory twice.
 */
export async function createTicketOrder(input: CreateOrderInput): Promise<TicketOrder> {
  const existing = await fetchOrderByReference(input.reference);
  if (existing) return existing;

  return db.transaction(async (tx) => {
    const [order] = await tx
      .insert(ticketOrders)
      .values({
        eventId: input.eventId,
        buyerId: input.buyerId,
        buyerName: input.buyerName,
        buyerEmail: input.buyerEmail,
        buyerPhone: input.buyerPhone,
        reference: input.reference,
        paymentMethod: input.paymentMethod,
        subtotal: input.subtotal,
        fees: input.fees,
        total: input.total,
        currency: input.currency,
        status: "paid",
      })
      .returning();

    const items = input.items.length
      ? await tx
          .insert(ticketOrderItems)
          .values(
            input.items.map((item) => ({
              orderId: order.id,
              tierId: item.tierId,
              tierName: item.tierName,
              unitPrice: item.unitPrice,
              quantity: item.quantity,
              lineTotal: item.unitPrice * item.quantity,
            })),
          )
          .returning()
      : [];

    for (const item of input.items) {
      await tx
        .update(ticketTiers)
        .set({ quantitySold: sql`${ticketTiers.quantitySold} + ${item.quantity}` })
        .where(eq(ticketTiers.id, item.tierId));
    }

    return toOrder(order, items);
  });
}

/**
 * A buyer's own orders, newest first.
 *
 * Matches on the account *and* the email, so tickets bought as a guest
 * before signing up still show up once someone signs in with that address.
 */
export async function fetchOrdersForBuyer(
  userId: string,
  email: string,
): Promise<TicketOrderWithEvent[]> {
  const rows = await db
    .select()
    .from(ticketOrders)
    .innerJoin(events, eq(events.id, ticketOrders.eventId))
    .where(or(eq(ticketOrders.buyerId, userId), eq(ticketOrders.buyerEmail, email)))
    .orderBy(desc(ticketOrders.createdAt));
  if (rows.length === 0) return [];

  const items = await db
    .select()
    .from(ticketOrderItems)
    .where(
      inArray(
        ticketOrderItems.orderId,
        rows.map((row) => row.ticket_orders.id),
      ),
    );
  const itemsByOrder = new Map<string, (typeof ticketOrderItems.$inferSelect)[]>();
  for (const item of items) {
    const list = itemsByOrder.get(item.orderId) ?? [];
    list.push(item);
    itemsByOrder.set(item.orderId, list);
  }

  return rows.map((row) => ({
    ...toOrder(row.ticket_orders, itemsByOrder.get(row.ticket_orders.id) ?? []),
    event: {
      id: row.events.id,
      title: row.events.title,
      venue: row.events.venue,
      city: row.events.city,
      startsAt: row.events.startsAt.toISOString(),
      coverImage: row.events.coverImage,
    },
  }));
}

export async function fetchOrderByReference(
  reference: string,
): Promise<TicketOrder | undefined> {
  const [order] = await db
    .select()
    .from(ticketOrders)
    .where(eq(ticketOrders.reference, reference));
  if (!order) return undefined;
  const items = await db
    .select()
    .from(ticketOrderItems)
    .where(eq(ticketOrderItems.orderId, order.id));
  return toOrder(order, items);
}
