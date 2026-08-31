"use client";

import { useState, type FormEvent } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { ButtonLink, Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Icon } from "@/components/ui/Icon";
import { CodeInput } from "@/components/ui/CodeInput";
import { useAuth } from "@/lib/auth/AuthContext";

type Step = "gate" | "new-value" | "verify" | "done";

type SecurityChangeFlowProps = {
  field: "password" | "email";
};

const copy = {
  password: {
    title: "Change password",
    gateHint: "Confirm your current password to continue.",
    newLabel: "New password",
    confirmLabel: "Confirm new password",
    verifyHint: "We sent a code to your email to confirm this change.",
    doneTitle: "Password changed",
    doneBody: "Use your new password the next time you sign in.",
  },
  email: {
    title: "Change email",
    gateHint: "Confirm your current password to continue.",
    newLabel: "New email address",
    confirmLabel: "Confirm new email address",
    verifyHint: "We sent a code to your new email address to confirm this change.",
    doneTitle: "Email changed",
    doneBody: "Sign in with your new email address next time.",
  },
} as const;

/**
 * Mirrors the Figma "Settings - Make Changes / Change Password|Email /
 * Verify New Password|Email / Confirmation" frames (node 3979:34387,
 * Desktop 112/114/117-119) — two parallel flows sharing one shape:
 * confirm current password -> enter new value -> verify a code -> done.
 */
export function SecurityChangeFlow({ field }: SecurityChangeFlowProps) {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("gate");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newValue, setNewValue] = useState("");
  const [confirmValue, setConfirmValue] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!user) return null;
  const text = copy[field];

  function handleGate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentPassword) {
      setError("Enter your current password.");
      return;
    }
    setError(null);
    setStep("new-value");
  }

  function handleNewValue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newValue)) {
      setError("Enter a valid email address.");
      return;
    }
    if (field === "password" && newValue.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (newValue !== confirmValue) {
      setError(`The ${field === "password" ? "passwords" : "emails"} don't match.`);
      return;
    }
    setError(null);
    setStep("verify");
  }

  function handleVerify() {
    if (code.length !== 6) {
      setError("Enter the 6-digit code.");
      return;
    }
    // No real verification provider — any complete code confirms the mock flow.
    setError(null);
    setStep("done");
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 sm:px-8">
        <ButtonLink href="/account/settings" variant="neutral" size="sm" className="w-fit gap-2">
          <Icon name="arrow-left" className="size-4" />
          Back to settings
        </ButtonLink>

        {step === "gate" ? (
          <form onSubmit={handleGate} className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">{text.title}</h1>
            <p className="text-sm text-slate-500">{text.gateHint}</p>
            <Input
              type="password"
              label="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" variant="accent">
              Continue
            </Button>
          </form>
        ) : null}

        {step === "new-value" ? (
          <form onSubmit={handleNewValue} className="flex flex-col gap-4 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">{text.title}</h1>
            <Input
              type={field === "password" ? "password" : "email"}
              label={text.newLabel}
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
            />
            <Input
              type={field === "password" ? "password" : "email"}
              label={text.confirmLabel}
              value={confirmValue}
              onChange={(e) => setConfirmValue(e.target.value)}
            />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button type="submit" variant="accent">
              Continue
            </Button>
          </form>
        ) : null}

        {step === "verify" ? (
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-card-border bg-white p-6">
            <h1 className="text-xl font-semibold text-text">Verify it&apos;s you</h1>
            <p className="text-center text-sm text-slate-500">{text.verifyHint}</p>
            <CodeInput value={code} onChange={setCode} length={6} autoFocus />
            {error ? <p className="text-sm text-danger">{error}</p> : null}
            <Button variant="accent" onClick={handleVerify}>
              Confirm
            </Button>
          </div>
        ) : null}

        {step === "done" ? (
          <div className="flex flex-col items-center gap-4 rounded-2xl border border-card-border bg-white p-8 text-center">
            <span className="flex size-14 items-center justify-center rounded-full bg-lime-100 text-lime-500">
              <Icon name="check" className="size-6" />
            </span>
            <h1 className="text-xl font-semibold text-text">{text.doneTitle}</h1>
            <p className="text-sm text-slate-500">{text.doneBody}</p>
            <ButtonLink href="/account/settings" variant="accent" className="rounded-full">
              Back to settings
            </ButtonLink>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}
