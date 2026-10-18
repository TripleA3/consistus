"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AppleLogo, GoogleLogo } from "@phosphor-icons/react/dist/ssr";
import { BrandLogo, Button, Field, Input, Segmented } from "@/components/kit";
import { useAuth } from "@/lib/auth/AuthContext";

type Mode = "sign-up" | "sign-in";

const COPY = {
  "sign-up": {
    title: "Create your account",
    subtitle: "One account for fans, celebrities and organisers.",
    submit: "Create account",
  },
  "sign-in": {
    title: "Welcome back",
    subtitle: "Sign in to pick up where you left off.",
    submit: "Sign in",
  },
} as const;

/**
 * The onboarding screen from the design: brand mark top-left, then a
 * centred column with the sign up / sign in switch, the form, the social
 * options and the legal line.
 *
 * Both routes render this; the switch navigates between them so each mode
 * keeps its own URL, which is what the rest of the app links to.
 */
export function AuthScreen({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { signIn, signUp } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const copy = COPY[mode];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password || (mode === "sign-up" && !name)) {
      setError("Fill in every field to continue.");
      return;
    }

    setBusy(true);
    try {
      // The design drops the talent/fan choice from sign-up: everyone starts
      // as a fan and adds a talent profile later, at /talent/onboarding.
      if (mode === "sign-up") await signUp({ name, email, role: "fan" });
      else await signIn(email);
      router.push("/");
    } finally {
      setBusy(false);
    }
  }

  return (
    /*
     * The design centres the whole block vertically, with the brand mark at
     * the page gutter rather than above the column - measured off the
     * design file, where content spans y 228-920 of an 1140px page.
     */
    <div className="flex min-h-dvh flex-col justify-center px-[var(--gutter)] py-10">
      <Link href="/" aria-label="Fannero home" className="self-start">
        <BrandLogo size={32} />
      </Link>

      <main className="mx-auto w-full max-w-[400px] pt-8">
        <Segmented
          block
          label="Sign up or sign in"
          value={mode}
          onChange={(next) => router.push(next === "sign-up" ? "/sign-up" : "/sign-in")}
          options={[
            { value: "sign-up", label: "Sign up" },
            { value: "sign-in", label: "Sign in" },
          ]}
          className="mb-7"
        />

        <h1 className="text-headline-md">{copy.title}</h1>
        <p className="mt-1 text-body-md text-muted-foreground">{copy.subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-4">
          {mode === "sign-up" ? (
            <Field label="Full name" htmlFor="name">
              <Input id="name" name="name" autoComplete="name" placeholder="Ada Okafor" />
            </Field>
          ) : null}

          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@email.com"
            />
          </Field>

          <Field label="Password" htmlFor="password">
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
              placeholder={mode === "sign-up" ? "At least 8 characters" : "Your password"}
            />
          </Field>

          {error ? (
            <p role="alert" className="text-body-md text-destructive">
              {error}
            </p>
          ) : null}

          <Button type="submit" size="lg" block disabled={busy} className="mt-2">
            {busy ? "One moment…" : copy.submit}
          </Button>
        </form>

        {/* No rule: the design file has only the centred label here. */}
        <p className="mb-6 mt-6 text-center text-body-sm text-muted-foreground">
          or continue with
        </p>

        {/* 193x47 each, a 14px gap apart, bordered in --input not --border.
            Height is inline so it beats the size class deterministically. */}
        <div className="grid grid-cols-2 gap-3.5">
          <Button
            variant="outline"
            size="lg"
            style={{ height: 47 }}
            className="gap-2 border-input bg-card text-label-lg"
            leading={<GoogleLogo size={14} weight="bold" />}
          >
            Google
          </Button>
          <Button
            variant="outline"
            size="lg"
            style={{ height: 47 }}
            className="gap-2 border-input bg-card text-label-lg"
            leading={<AppleLogo size={14} weight="fill" />}
          >
            Apple
          </Button>
        </div>

        <p className="mt-6 text-center text-body-sm text-muted-foreground">
          By continuing you agree to our{" "}
          <Link href="/legal/terms" className="text-link hover:underline">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/legal/privacy" className="text-link hover:underline">
            Privacy policy
          </Link>
          .
        </p>
      </main>
    </div>
  );
}
