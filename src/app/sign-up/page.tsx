"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/AppShell";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/lib/auth/AuthContext";
import type { TalentCategory, UserRole } from "@/lib/types";

const categories: { value: TalentCategory; label: string }[] = [
  { value: "artist", label: "Artist" },
  { value: "actor", label: "Actor" },
  { value: "comedian", label: "Comedian" },
  { value: "techie", label: "Techie" },
  { value: "athlete", label: "Athlete" },
  { value: "influencer", label: "Influencer" },
];

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [role, setRole] = useState<UserRole>("fan");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const bio = String(data.get("bio") ?? "").trim();
    const talentCategory = data.get("talentCategory") as TalentCategory | null;

    if (!name || !email || !password) {
      setError("Fill in your name, email, and password.");
      return;
    }
    if (role === "talent" && !bio) {
      setError("Tell fans a little about you.");
      return;
    }

    signUp({
      name,
      email,
      role,
      talentCategory: talentCategory ?? undefined,
      bio: bio || undefined,
    });
    router.push(role === "talent" ? `/talent/onboarding` : "/");
  }

  return (
    <AppShell>
      <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-16 sm:px-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text">Create your account</h1>
          <p className="mt-1 text-sm text-slate-500">
            Join Fannero as a fan, or set up your talent profile.
          </p>
        </div>

        <div className="flex rounded-full border border-card-border bg-white p-1">
          {(["fan", "talent"] as UserRole[]).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              aria-pressed={role === option}
              className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize transition-colors ${
                role === option ? "bg-accent text-ink" : "text-slate-500"
              }`}
            >
              {option === "fan" ? "I'm a fan" : "I'm talent"}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 rounded-2xl border border-card-border bg-white p-6">
          <Input name="name" label="Full name" placeholder="e.g. Ada Eze" required />
          <Input name="email" type="email" label="Email" placeholder="you@example.com" required />
          <Input name="password" type="password" label="Password" placeholder="••••••••" required />

          {role === "talent" ? (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Category</span>
                <select
                  name="talentCategory"
                  defaultValue="artist"
                  className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-ink">Short bio</span>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Tell fans what you do and what you can offer them."
                  className="rounded-lg border border-input-border bg-white px-3.5 py-2.5 text-base text-ink shadow-card outline-none placeholder:text-placeholder"
                />
              </label>
            </>
          ) : null}

          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <Button type="submit" variant="accent" size="lg" className="rounded-full">
            {role === "talent" ? "Create talent profile" : "Create account"}
          </Button>
        </form>
        <p className="text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-lime-500">
            Sign in
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
