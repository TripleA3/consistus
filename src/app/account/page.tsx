"use client";

import { useRouter } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";

export default function AccountPage() {
  return (
    <RequireAuth>
      <AccountView />
    </RequireAuth>
  );
}

function AccountView() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-16 sm:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text">Profile</h1>
          <ButtonLink href="/account/settings" variant="neutral" size="sm" className="gap-2">
            <Icon name="settings" className="size-4" />
            Settings
          </ButtonLink>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-card-border bg-white p-6">
          <span className="flex size-14 items-center justify-center rounded-full bg-lime-100 text-lime-500">
            <Icon name="user" className="size-7" />
          </span>
          <div>
            <p className="text-lg font-semibold text-text">{user.name}</p>
            <p className="text-sm text-slate-500">{user.email}</p>
            <p className="mt-1 flex gap-1.5">
              {user.roles.map((role) => (
                <span
                  key={role}
                  className="rounded-full bg-lime-100 px-2 py-0.5 text-xs font-medium capitalize text-lime-500"
                >
                  {role}
                </span>
              ))}
            </p>
          </div>
        </div>

        {user.talentProfile ? (
          <ButtonLink href={`/talent/${user.id}`} variant="neutral" className="justify-center">
            View my talent profile
          </ButtonLink>
        ) : null}

        <ButtonLink href="/help" variant="neutral" className="justify-center gap-2">
          <Icon name="alert-circle" className="size-4" />
          Help Center
        </ButtonLink>

        <Button
          variant="neutral"
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
    </AppShell>
  );
}
