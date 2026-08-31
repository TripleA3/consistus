import {
  getNotificationsByUserId,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/lib/mock/notifications";
import type { AppNotification, NotificationKind } from "@/lib/types";

const FAN_KINDS: NotificationKind[] = ["ticket", "event", "system"];
const TALENT_KINDS: NotificationKind[] = ["request", "wallet", "system"];

export async function fetchNotifications(
  userId: string,
  scope: "fan" | "talent" = "fan",
): Promise<AppNotification[]> {
  const all = getNotificationsByUserId(userId);
  const kinds = scope === "talent" ? TALENT_KINDS : FAN_KINDS;
  return all.filter((n) => kinds.includes(n.kind));
}

export async function markRead(id: string): Promise<AppNotification | undefined> {
  return markNotificationRead(id);
}

export async function markAllRead(userId: string): Promise<void> {
  markAllNotificationsRead(userId);
}
