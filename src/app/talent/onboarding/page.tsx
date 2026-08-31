"use client";

import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
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
    <AppShell>
      <div className="mx-auto flex max-w-lg flex-col items-center gap-6 px-4 py-20 text-center sm:px-8">
        <span className="flex size-16 items-center justify-center rounded-full bg-lime-100 text-lime-500">
          <Icon name="check" className="size-8" />
        </span>
        <div>
          <h1 className="text-2xl font-bold text-text">You&apos;re set up, {user.name.split(" ")[0]}!</h1>
          <p className="mt-2 text-sm text-slate-500">
            Your talent profile is live. Fans can now find you and send requests.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <ButtonLink href={`/talent/${user.id}`} variant="accent" className="flex-1 justify-center rounded-full">
            View my profile
          </ButtonLink>
          <ButtonLink href="/talent/dashboard" variant="neutral" className="flex-1 justify-center rounded-full">
            Go to dashboard
          </ButtonLink>
        </div>
      </div>
    </AppShell>
  );
}
