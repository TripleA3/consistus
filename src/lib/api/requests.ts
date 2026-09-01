"use server";

import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { talentRequests } from "@/db/schema";
import { transitionRequest, type RequestEvent } from "@/lib/requests/requestStateMachine";
import type { RequestStatus, RequestType, TalentRequest } from "@/lib/types";

function toTalentRequest(row: typeof talentRequests.$inferSelect): TalentRequest {
  return {
    id: row.id,
    type: row.type as RequestType,
    fanId: row.fanId,
    talentId: row.talentId,
    message: row.message,
    occasion: row.occasion ?? undefined,
    recipientName: row.recipientName ?? undefined,
    amount: row.amount,
    currency: row.currency,
    status: row.status as RequestStatus,
    createdAt: row.createdAt.toISOString(),
    dueBy: row.dueBy?.toISOString(),
    deliveryUrl: row.deliveryUrl ?? undefined,
    termsAcceptedAt: row.termsAcceptedAt?.toISOString(),
  };
}

export type CreateRequestInput = {
  type: RequestType;
  fanId: string;
  talentId: string;
  message: string;
  amount: number;
  currency: string;
  occasion?: string;
  recipientName?: string;
  dueBy?: string;
};

export async function fetchAllRequests(): Promise<TalentRequest[]> {
  const rows = await db.select().from(talentRequests).orderBy(desc(talentRequests.createdAt));
  return rows.map(toTalentRequest);
}

export async function fetchRequestById(id: string): Promise<TalentRequest | undefined> {
  const [row] = await db.select().from(talentRequests).where(eq(talentRequests.id, id));
  return row ? toTalentRequest(row) : undefined;
}

export async function fetchRequestsByTalentId(talentId: string): Promise<TalentRequest[]> {
  const rows = await db
    .select()
    .from(talentRequests)
    .where(eq(talentRequests.talentId, talentId))
    .orderBy(desc(talentRequests.createdAt));
  return rows.map(toTalentRequest);
}

export async function fetchRequestsByFanId(fanId: string): Promise<TalentRequest[]> {
  const rows = await db
    .select()
    .from(talentRequests)
    .where(eq(talentRequests.fanId, fanId))
    .orderBy(desc(talentRequests.createdAt));
  return rows.map(toTalentRequest);
}

export async function submitRequest(input: CreateRequestInput): Promise<TalentRequest> {
  const [created] = await db
    .insert(talentRequests)
    .values({
      type: input.type,
      fanId: input.fanId,
      talentId: input.talentId,
      message: input.message,
      occasion: input.occasion,
      recipientName: input.recipientName,
      amount: input.amount,
      currency: input.currency,
      status: transitionRequest("draft", { type: "SUBMIT" }),
      dueBy: input.dueBy ? new Date(input.dueBy) : undefined,
    })
    .returning();
  return toTalentRequest(created);
}

export async function applyRequestEvent(
  id: string,
  event: RequestEvent,
  extra?: Partial<Pick<TalentRequest, "termsAcceptedAt" | "deliveryUrl">>,
): Promise<TalentRequest | undefined> {
  const [existing] = await db.select().from(talentRequests).where(eq(talentRequests.id, id));
  if (!existing) return undefined;
  const status = transitionRequest(existing.status as RequestStatus, event);
  const [updated] = await db
    .update(talentRequests)
    .set({
      status,
      termsAcceptedAt: extra?.termsAcceptedAt ? new Date(extra.termsAcceptedAt) : undefined,
      deliveryUrl: extra?.deliveryUrl,
    })
    .where(eq(talentRequests.id, id))
    .returning();
  return toTalentRequest(updated);
}
