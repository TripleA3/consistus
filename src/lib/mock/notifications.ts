import type { AppNotification } from "@/lib/types";

const notifications: AppNotification[] = [
  {
    id: "notif-1",
    userId: "talent-2",
    kind: "request",
    title: "New video request",
    body: "A fan asked you for a personalised video.",
    read: false,
    createdAt: "2026-08-27T10:00:00.000Z",
    href: "/talent/requests",
  },
  {
    id: "notif-2",
    userId: "talent-2",
    kind: "ticket",
    title: "Ticket confirmed",
    body: "Your tickets for Lagos Tech & Gaming Night are confirmed.",
    read: false,
    createdAt: "2026-08-26T15:30:00.000Z",
    href: "/events/event-1",
  },
  {
    id: "notif-3",
    userId: "talent-2",
    kind: "wallet",
    title: "Payout processed",
    body: "₦45,000 was sent to your default withdrawal method.",
    read: true,
    createdAt: "2026-08-24T09:15:00.000Z",
    href: "/talent/wallet",
  },
  {
    id: "notif-4",
    userId: "talent-2",
    kind: "event",
    title: "Event reminder",
    body: "Amara Divine Live: Unplugged is in 3 days.",
    read: true,
    createdAt: "2026-08-22T08:00:00.000Z",
    href: "/events/event-2",
  },
  {
    id: "notif-5",
    userId: "talent-2",
    kind: "system",
    title: "Welcome to Fannero",
    body: "Complete your profile to start receiving requests from fans.",
    read: true,
    createdAt: "2026-08-18T12:00:00.000Z",
  },
];

export function getNotificationsByUserId(userId: string): AppNotification[] {
  return notifications
    .filter((n) => n.userId === userId)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function markNotificationRead(id: string): AppNotification | undefined {
  const notification = notifications.find((n) => n.id === id);
  if (!notification) return undefined;
  notification.read = true;
  return notification;
}

export function markAllNotificationsRead(userId: string): void {
  for (const notification of notifications) {
    if (notification.userId === userId) notification.read = true;
  }
}
