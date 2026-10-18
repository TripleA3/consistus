"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CalendarBlank,
  Ticket,
  VideoCamera,
  Wallet,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";
import { Button, EmptyState } from "@/components/kit";
import { useAuth } from "@/lib/auth/AuthContext";
import { fetchNotifications, markAllRead, markRead } from "@/lib/api/notifications";
import type { AppNotification, NotificationKind } from "@/lib/types";

const KIND_ICON: Record<NotificationKind, PhosphorIcon> = {
  request: VideoCamera,
  ticket: Ticket,
  wallet: Wallet,
  system: Bell,
  event: CalendarBlank,
};

const RELATIVE = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

/**
 * Safe to read the clock here: the list only renders after its data
 * arrives in an effect, so nothing time-dependent is server-rendered.
 */
function relativeTime(iso: string): string {
  const diffMs = new Date(iso).getTime() - Date.now();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (Math.abs(diffDays) >= 1) return RELATIVE.format(diffDays, "day");
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  return RELATIVE.format(diffHours, "hour");
}

export function NotificationList({ scope }: { scope: "fan" | "talent" }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[] | null>(null);

  useEffect(() => {
    if (!user) return;
    fetchNotifications(user.id, scope).then(setNotifications);
  }, [user, scope]);

  if (!user || notifications === null) {
    return <p className="py-10 text-center text-body-md text-muted-foreground">Loading…</p>;
  }

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell size={26} />}
        title="All caught up"
        body="Requests, tickets and payouts land here."
      />
    );
  }

  const hasUnread = notifications.some((notification) => !notification.read);

  return (
    <>
      {hasUnread ? (
        <div className="mb-3 flex justify-end">
          <Button
            variant="ghost"
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
        {notifications.map((notification) => {
          const Icon = KIND_ICON[notification.kind];
          return (
            <li key={notification.id}>
              <Link
                href={notification.href ?? "#"}
                onClick={() => {
                  if (notification.read) return;
                  markRead(notification.id);
                  setNotifications(
                    (prev) =>
                      prev?.map((n) => (n.id === notification.id ? { ...n, read: true } : n)) ??
                      prev,
                  );
                }}
                className={`flex items-start gap-3 rounded-lg border p-3.5 transition-colors ${
                  notification.read
                    ? "border-border bg-card"
                    : "border-ring bg-accent"
                }`}
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-pill bg-secondary text-secondary-foreground">
                  <Icon size={19} weight="bold" />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-title-md">{notification.title}</span>
                    {notification.read ? null : (
                      <span className="size-2 shrink-0 rounded-full bg-cta" aria-label="Unread" />
                    )}
                  </span>
                  <span className="mt-0.5 block text-body-md text-muted-foreground">
                    {notification.body}
                  </span>
                  <span className="mt-1 block text-body-sm text-muted-foreground">
                    {relativeTime(notification.createdAt)}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  );
}
