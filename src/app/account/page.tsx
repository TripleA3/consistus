"use client";

import { useRouter } from "next/navigation";
import {
  Gear,
  Question,
  SignOut,
  Star,
  User as UserIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Button, ButtonLink, Card, PageHeader, StatusPill } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ThemeToggle } from "@/components/shell/ThemeToggle";
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
    <AppShell name={user.name} avatarUrl={user.avatarUrl}>
      <PageHeader
        title="Account"
        actions={
          <ButtonLink
            href="/account/settings"
            variant="outline"
            size="sm"
            leading={<Gear size={16} weight="bold" />}
          >
            Settings
          </ButtonLink>
        }
      />

      <Card className="flex items-center gap-4">
        {user.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- avatar URLs are arbitrary remote hosts
          <img src={user.avatarUrl} alt="" className="size-14 rounded-full object-cover" />
        ) : (
          <span className="flex size-14 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
            <UserIcon size={26} weight="bold" />
          </span>
        )}

        <div className="min-w-0">
          <p className="truncate text-title-lg">{user.name}</p>
          <p className="truncate text-body-md text-muted-foreground">{user.email}</p>
          <p className="mt-1.5 flex flex-wrap gap-1.5">
            {user.roles.map((role) => (
              <StatusPill key={role} tone="info">
                {role}
              </StatusPill>
            ))}
          </p>
        </div>
      </Card>

      {/* The top bar hides the theme toggle on phones, so it lives here too. */}
      <Card className="mt-3 flex items-center justify-between gap-4">
        <div>
          <p className="text-title-md">Appearance</p>
          <p className="text-body-md text-muted-foreground">Light, dark or follow your device.</p>
        </div>
        <ThemeToggle />
      </Card>

      <div className="mt-5 flex flex-col gap-3">
        {user.talentProfile ? (
          <ButtonLink
            href={`/talent/${user.id}`}
            variant="outline"
            size="lg"
            block
            className="justify-start bg-card"
            leading={<Star size={18} weight="fill" />}
          >
            View my talent profile
          </ButtonLink>
        ) : null}

        <ButtonLink
          href="/help"
          variant="outline"
          size="lg"
          block
          className="justify-start bg-card"
          leading={<Question size={18} weight="bold" />}
        >
          Help centre
        </ButtonLink>

        <Button
          variant="outline"
          size="lg"
          block
          className="justify-start bg-card"
          leading={<SignOut size={18} weight="bold" className="text-destructive" />}
          onClick={() => {
            signOut();
            router.push("/");
          }}
        >
          <span className="text-destructive">Sign out</span>
        </Button>
      </div>
    </AppShell>
  );
}
