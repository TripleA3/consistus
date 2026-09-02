"use server";

import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db";
import { talentRequests, users, walletBalances, walletTransactions } from "@/db/schema";
import { transitionRequest, type RequestEvent } from "@/lib/requests/requestStateMachine";
import type {
  RequestStatus,
  RequestType,
  TalentRequest,
  TalentRequestWithTalent,
} from "@/lib/types";

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

/** How a completed request reads on the talent's wallet statement. */
const REQUEST_EARNING_LABEL: Record<RequestType, string> = {
  "personalised-video": "Personalised video",
  "guest-speaker": "Guest speaker",
  "special-appearance": "Special appearance",
  "event-invitation": "Event invitation",
};

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

/**
 * A fan's own requests, newest first, with the talent they were sent to —
 * so the fan-side list can name the talent without a second lookup.
 */
export async function fetchRequestsForFan(
  fanId: string,
): Promise<TalentRequestWithTalent[]> {
  const rows = await db
    .select()
    .from(talentRequests)
    .innerJoin(users, eq(users.id, talentRequests.talentId))
    .where(eq(talentRequests.fanId, fanId))
    .orderBy(desc(talentRequests.createdAt));
  return rows.map((row) => ({
    ...toTalentRequest(row.talent_requests),
    talent: { id: row.users.id, name: row.users.name },
  }));
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

  return db.transaction(async (tx) => {
    const [updated] = await tx
      .update(talentRequests)
      .set({
        status,
        termsAcceptedAt: extra?.termsAcceptedAt ? new Date(extra.termsAcceptedAt) : undefined,
        deliveryUrl: extra?.deliveryUrl,
      })
      .where(eq(talentRequests.id, id))
      .returning();

    // Completing a request is what actually pays the talent — the fan's
    // confirmation screen promises exactly this. Guarded on the status
    // having just changed, so re-confirming can't pay twice.
    if (status === "completed" && existing.status !== "completed") {
      await tx.insert(walletTransactions).values({
        talentId: updated.talentId,
        kind: "credit",
        reason: `${REQUEST_EARNING_LABEL[updated.type as RequestType]}${
          updated.recipientName ? ` — ${updated.recipientName}` : ""
        }`,
        amount: updated.amount,
        currency: updated.currency,
        relatedRequestId: updated.id,
      });
      await tx
        .insert(walletBalances)
        .values({
          talentId: updated.talentId,
          availableBalance: updated.amount,
          currency: updated.currency,
        })
        .onConflictDoUpdate({
          target: walletBalances.talentId,
          set: {
            availableBalance: sql`${walletBalances.availableBalance} + ${updated.amount}`,
          },
        });
    }

    return toTalentRequest(updated);
  });
}
