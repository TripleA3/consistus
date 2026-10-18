"use client";

import { PageHeader } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { NotificationList } from "@/components/notifications/NotificationList";

export default function TalentNotificationsPage() {
  return (
    <RequireAuth role="talent">
      <AppShell>
        <PageHeader title="Notifications" subtitle="Requests, payouts and account activity." />
        <NotificationList scope="talent" />
      </AppShell>
    </RequireAuth>
  );
}
