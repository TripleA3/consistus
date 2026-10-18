"use client";

import { PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function FanNotificationsPage() {
  return (
    <RequireAuth>
      <AppShell>
        <PageHeader title="Notifications" subtitle="Requests, tickets and replies." />
        <NotificationList scope="fan" />
      </AppShell>
    </RequireAuth>
  );
}
