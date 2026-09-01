"use server";

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { walletBalances, walletPins, walletTransactions, withdrawalMethods } from "@/db/schema";
import type {
  WalletSummary,
  WalletTransaction,
  WithdrawalMethod,
  WithdrawalMethodType,
} from "@/lib/types";

function toWalletTransaction(row: typeof walletTransactions.$inferSelect): WalletTransaction {
  return {
    id: row.id,
    talentId: row.talentId,
    kind: row.kind,
    reason: row.reason,
    amount: row.amount,
    currency: row.currency,
    createdAt: row.createdAt.toISOString(),
    relatedRequestId: row.relatedRequestId ?? undefined,
  };
}

function toWithdrawalMethod(row: typeof withdrawalMethods.$inferSelect): WithdrawalMethod {
  return {
    id: row.id,
    talentId: row.talentId,
    type: row.type as WithdrawalMethodType,
    label: row.label,
    last4: row.last4,
    isDefault: row.isDefault,
  };
}

export async function fetchWalletSummary(talentId: string): Promise<WalletSummary> {
  const [row] = await db.select().from(walletBalances).where(eq(walletBalances.talentId, talentId));
  return (
    row ?? {
      talentId,
      availableBalance: 0,
      pendingBalance: 0,
      currency: "NGN",
    }
  );
}

export async function fetchTransactions(talentId: string): Promise<WalletTransaction[]> {
  const rows = await db
    .select()
    .from(walletTransactions)
    .where(eq(walletTransactions.talentId, talentId))
    .orderBy(desc(walletTransactions.createdAt));
  return rows.map(toWalletTransaction);
}

export async function fetchWithdrawalMethods(talentId: string): Promise<WithdrawalMethod[]> {
  const rows = await db
    .select()
    .from(withdrawalMethods)
    .where(eq(withdrawalMethods.talentId, talentId));
  return rows.map(toWithdrawalMethod);
}

export type AddMethodInput = {
  talentId: string;
  type: WithdrawalMethod["type"];
  label: string;
  last4: string;
  isDefault: boolean;
};

export async function createWithdrawalMethod(input: AddMethodInput): Promise<WithdrawalMethod> {
  if (input.isDefault) {
    await db
      .update(withdrawalMethods)
      .set({ isDefault: false })
      .where(eq(withdrawalMethods.talentId, input.talentId));
  }
  const [created] = await db.insert(withdrawalMethods).values(input).returning();
  return toWithdrawalMethod(created);
}

/** scrypt with a per-PIN random salt — the mock store kept PINs in plaintext (see docs/open-questions.md). */
function hashPin(pin: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(pin, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPinHash(pin: string, stored: string): boolean {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const hashBuffer = Buffer.from(hash, "hex");
  const candidate = scryptSync(pin, salt, 64);
  return candidate.length === hashBuffer.length && timingSafeEqual(candidate, hashBuffer);
}

export async function checkHasPin(talentId: string): Promise<boolean> {
  const [row] = await db.select().from(walletPins).where(eq(walletPins.talentId, talentId));
  return Boolean(row);
}

export async function createPin(talentId: string, pin: string): Promise<void> {
  const pinHash = hashPin(pin);
  await db
    .insert(walletPins)
    .values({ talentId, pinHash })
    .onConflictDoUpdate({ target: walletPins.talentId, set: { pinHash } });
}

export async function confirmPin(talentId: string, pin: string): Promise<boolean> {
  const [row] = await db.select().from(walletPins).where(eq(walletPins.talentId, talentId));
  if (!row) return false;
  return verifyPinHash(pin, row.pinHash);
}

export async function submitWithdrawal(
  talentId: string,
  amount: number,
  methodLabel: string,
): Promise<WalletTransaction> {
  const [existing] = await db.select().from(walletBalances).where(eq(walletBalances.talentId, talentId));
  const currency = existing?.currency ?? "NGN";
  const availableBalance = (existing?.availableBalance ?? 0) - amount;
  await db
    .insert(walletBalances)
    .values({ talentId, availableBalance, pendingBalance: existing?.pendingBalance ?? 0, currency })
    .onConflictDoUpdate({ target: walletBalances.talentId, set: { availableBalance } });

  const [created] = await db
    .insert(walletTransactions)
    .values({
      talentId,
      kind: "debit",
      reason: `Withdrawal to ${methodLabel}`,
      amount,
      currency,
    })
    .returning();
  return toWalletTransaction(created);
}
