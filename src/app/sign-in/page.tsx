"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    // No real backend — any credentials sign in as the one seed account.
    signIn(email);
    router.push("/");
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to continue to Fannero.</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Password" placeholder="••••••••" required />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" variant="accent" size="lg" className="rounded-full">
            Sign in
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/sign-up" className="font-medium text-lime-500">
            Sign up
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
