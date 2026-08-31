"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchNotifications, markAllRead, markRead } from "@/lib/api/notifications";
import type { AppNotification, NotificationKind } from "@/lib/types";

const kindIcon: Record<NotificationKind, IconName> = {
  request: "video",
  ticket: "ticket",
  wallet: "wallet",
  system: "bell",
  event: "calendar",
};

const relativeFormatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

function relativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) >= 1) return relativeFormatter.format(diffDays, "day");
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return relativeFormatter.format(diffHours, "hour");
}

type NotificationListProps = {
  scope: "fan" | "talent";
};

export function NotificationList({ scope }: NotificationListProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id, scope).then(setNotifications);
  }, [user, scope]);

  if (!user || notifications === null) {
    return <p className="text-sm text-slate-500">Loading…</p>;
  }

  if (notifications.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-sm text-slate-500">
        You&apos;re all caught up — nothing here yet.
      </div>
    );
  }

  const hasUnread = notifications.some((n) => !n.read);

  return (
    <div className="flex flex-col gap-4">
      {hasUnread ? (
        <div className="flex justify-end">
          <Button
            variant="neutral"
            size="sm"
            onClick={async () => {
              await markAllRead(user.id);
              setNotifications((prev) => prev?.map((n) => ({ ...n, read: true })) ?? prev);
            }}
          >
            Mark all as read
          </Button>
        </div>
      ) : null}
      <ul className="flex flex-col gap-2">
        {notifications.map((notification) => (
          <li key={notification.id}>
            <Link
              href={notification.href ?? "#"}
              onClick={() => {
                if (!notification.read) {
                  markRead(notification.id);
                  setNotifications((prev) =>
                    prev?.map((n) => (n.id === notification.id ? { ...n, read: true } : n)) ??
                      prev,
                  );
                }
              }}
              className={`flex items-start gap-4 rounded-xl border p-4 transition-colors ${
                notification.read ? "border-card-border bg-white" : "border-lime-500/40 bg-lime-100/30"
              }`}
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-lime-100 text-lime-500">
                <Icon name={kindIcon[notification.kind]} className="size-5" />
              </span>
              <span className="flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-text">{notification.title}</span>
                  {!notification.read ? (
                    <span className="size-2 rounded-full bg-lime-500" aria-label="Unread" />
                  ) : null}
                </span>
                <span className="mt-0.5 block text-sm text-slate-500">{notification.body}</span>
                <span className="mt-1 block text-xs text-slate-400">
                  {relativeTime(notification.createdAt)}
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
