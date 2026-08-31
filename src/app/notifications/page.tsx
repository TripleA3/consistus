"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function FanNotificationsPage() {
  return (
    <RequireAuth>
      <AppShell>
        <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-10 sm:px-8">
          <h1 className="text-2xl font-bold text-text">Notifications</h1>
          <NotificationList scope="fan" />
        </div>
      </AppShell>
    </RequireAuth>
  );
}
