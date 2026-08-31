"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";

type NotificationPrefs = {
  email: boolean;
  push: boolean;
};

export default function SettingsPage() {
  return (
    <RequireAuth>
      <SettingsView />
    </RequireAuth>
  );
}

function SettingsView() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<NotificationPrefs>({ email: true, push: true });

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col gap-8 px-4 py-10 sm:px-8">
        <ButtonLink href="/account" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to profile
        </ButtonLink>
        <h1 className="text-2xl font-bold text-text">Settings</h1>

        <section className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <h2 className="text-base font-semibold text-text">Account</h2>
          <SettingsRow label="Name" value={user.name} />
          <SettingsRow label="Email" value={user.email} />
        </section>

        <section className="flex flex-col gap-1 rounded-2xl border border-card-border bg-white p-2">
          <h2 className="px-4 pt-3 text-base font-semibold text-text">Security</h2>
          <ButtonLink
            href="/account/settings/change-password"
            variant="neutral"
            className="!justify-between border-0 shadow-none"
          >
            Change password
            <Icon name="chevron-right" className="size-4 text-slate-400" />
          </ButtonLink>
          <ButtonLink
            href="/account/settings/change-email"
            variant="neutral"
            className="!justify-between border-0 shadow-none"
          >
            Change email
            <Icon name="chevron-right" className="size-4 text-slate-400" />
          </ButtonLink>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
          <h2 className="text-base font-semibold text-text">Notifications</h2>
          <Toggle
            label="Email notifications"
            checked={prefs.email}
            onChange={(email) => setPrefs((p) => ({ ...p, email }))}
          />
          <Toggle
            label="Push notifications"
            checked={prefs.push}
            onChange={(push) => setPrefs((p) => ({ ...p, push }))}
          />
        </section>
      </div>
    </AppShell>
  );
}

function SettingsRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-text">{value}</span>
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span className="text-text">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-lime-500" : "bg-slate-200"
        }`}
      >
        <span
          className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </label>
  );
}
