"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { RequireAuth } from "@/components/auth/RequireAuth";
import { Button, ButtonLink } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { useAuth } from "@/lib/auth/AuthContext";
import { updateTalentDirectoryProfile } from "@/lib/api/talents";

type Status = "form" | "pending" | "verified";

export default function VerifyTalentPage() {
  return (
    <RequireAuth role="talent">
      <VerifyView />
    </RequireAuth>
  );
}

function VerifyView() {
  const { user, updateTalentProfile } = useAuth();
  const [status, setStatus] = useState<Status>(
    user?.talentProfile?.verified ? "verified" : "form",
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("pending");
    // No real ID-verification provider — simulate a short review window.
    await new Promise((resolve) => setTimeout(resolve, 1200));
    // Keep the auth session and the public talent directory in sync — two
    // separate mock stores, since there's no shared backend yet.
    updateTalentProfile({ verified: true });
    await updateTalentDirectoryProfile(user!.id, { verified: true });
    setStatus("verified");
  }

  if (!user) return null;

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-8">
        <ButtonLink href="/talent/wallet" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to wallet
        </ButtonLink>

        {status === "form" ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
            <div>
              <h1 className="text-xl font-semibold text-text">Get verified</h1>
              <p className="mt-1 text-sm text-slate-500">
                Verified talent get a badge on their profile and priority placement.
              </p>
            </div>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-medium text-ink">ID type</span>
              <select
                name="idType"
                defaultValue="national-id"
                className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card"
              >
                <option value="national-id">National ID</option>
                <option value="passport">Passport</option>
                <option value="drivers-license">Driver&apos;s license</option>
              </select>
            </label>
            <Input name="idNumber" label="ID number" placeholder="Enter your ID number" required />
            <Button type="submit" variant="accent">
              Submit for review
            </Button>
          </form>
        ) : null}

        {status === "pending" ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-card-border bg-white p-10 text-center">
            <span className="size-10 animate-spin rounded-full border-4 border-lime-100 border-t-lime-500" />
            <p className="text-sm text-slate-500">Reviewing your details…</p>
          </div>
        ) : null}

        {status === "verified" ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-card-border bg-white p-10 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-lime-100 text-lime-500">
              <Icon name="shield" className="size-7" />
            </span>
            <h1 className="text-xl font-semibold text-text">You&apos;re verified!</h1>
            <p className="text-sm text-slate-500">
              Your profile now shows the verified badge to fans.
            </p>
            <ButtonLink href={`/talent/${user.id}`} variant="accent" className="rounded-full">
              View my profile
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
