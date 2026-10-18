"use client";

import { CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { ButtonLink } from "@/components/kit";
import { AppShell } from "@/components/shell/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";

export default function TalentOnboardingPage() {
  return (
    <RequireAuth role="talent">
      <OnboardingView />
    </RequireAuth>
  );
}

function OnboardingView() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <AppShell name={user.name} avatarUrl={user.avatarUrl}>
      <div className="mx-auto max-w-md py-10 text-center">
        <CheckCircle size={64} weight="fill" className="mx-auto text-success" />

        <h1 className="mt-4 text-headline-lg">
          You&apos;re set up,{" "}
          <span className="font-accent font-normal italic">{user.name.split(" ")[0]}</span>
        </h1>
        <p className="mt-2 text-body-lg text-muted-foreground">
          Your talent profile is live. Fans can find you and send requests.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/talent/${user.id}`} size="lg" className="flex-1">
            View my profile
          </ButtonLink>
          <ButtonLink
            href="/talent/dashboard"
            variant="outline"
            size="lg"
            className="flex-1 bg-card"
          >
            Go to dashboard
          </ButtonLink>
        </div>
      </div>
    </AppShell>
  );
}
