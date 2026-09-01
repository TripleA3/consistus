"use server";

import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import type { AppNotification, NotificationKind } from "@/lib/types";

const FAN_KINDS: NotificationKind[] = ["ticket", "event", "system"];
const TALENT_KINDS: NotificationKind[] = ["request", "wallet", "system"];

function toAppNotification(row: typeof notifications.$inferSelect): AppNotification {
  return {
    id: row.id,
    userId: row.userId,
    kind: row.kind as NotificationKind,
    title: row.title,
    body: row.body,
    read: row.read,
    createdAt: row.createdAt.toISOString(),
    href: row.href ?? undefined,
  };
}

export async function fetchNotifications(
  userId: string,
  scope: "fan" | "talent" = "fan",
): Promise<AppNotification[]> {
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt));
  const kinds = scope === "talent" ? TALENT_KINDS : FAN_KINDS;
  return rows.filter((row) => kinds.includes(row.kind as NotificationKind)).map(toAppNotification);
}

export async function markRead(id: string): Promise<AppNotification | undefined> {
  const [updated] = await db
    .update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, id))
    .returning();
  return updated ? toAppNotification(updated) : undefined;
}

export async function markAllRead(userId: string): Promise<void> {
  await db
    .update(notifications)
    .set({ read: true })
    .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
}
