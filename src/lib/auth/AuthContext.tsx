"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TalentCategory, TalentProfile, User, UserRole } from "@/lib/types";
import {
  signIn as signInAction,
  signUp as signUpAction,
  updateTalentProfile as updateTalentProfileAction,
} from "@/lib/api/auth";

const STORAGE_KEY = "fannero-auth-user";

export type SignUpInput = {
  name: string;
  email: string;
  role: UserRole;
  talentCategory?: TalentCategory;
  bio?: string;
};

type AuthContextValue = {
  user: User | null;
  status: "loading" | "ready";
  signIn: (email: string) => Promise<void>;
  signUp: (input: SignUpInput) => Promise<void>;
  signOut: () => void;
  updateTalentProfile: (patch: Partial<TalentProfile>) => Promise<void>;
};

const AuthReactContext = createContext<AuthContextValue | null>(null);

/**
 * Stubbed auth for the brief's single-account default: no real password
 * check, `signIn` always resolves to the one seed account (any email
 * "works"). Session identity is now backed by real DB rows (see
 * src/lib/api/auth.ts) so ids are stable and satisfy the FK constraints
 * other tables reference; only the *session* (who's currently signed in
 * on this device) is client-side, mirrored to localStorage so it survives
 * reloads in this browser. Replace with a real provider (NextAuth,
 * Clerk, ...) without touching call sites, since everything goes through
 * `useAuth()`.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<"loading" | "ready">("loading");
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from external storage on mount
        setUser(JSON.parse(raw) as User);
      }
    } catch {
      // Ignore corrupted data — user just starts signed out.
    } finally {
      hydrated.current = true;
      setStatus("ready");
    }
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // Ignore — storage disabled or full.
    }
  }, [user]);

  // `email` is ignored by the backend (no real password check, per the
  // brief's stubbed-auth default) but kept on the signature since the form
  // still collects it and callers may want to display what was typed.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function signIn(_email: string) {
    const signedIn = await signInAction();
    setUser(signedIn);
  }

  async function signUp(input: SignUpInput) {
    const created = await signUpAction(input);
    setUser(created);
  }

  function signOut() {
    setUser(null);
  }

  async function updateTalentProfile(patch: Partial<TalentProfile>) {
    setUser((prev) =>
      prev?.talentProfile ? { ...prev, talentProfile: { ...prev.talentProfile, ...patch } } : prev,
    );
    if (user) {
      await updateTalentProfileAction(user.id, patch);
    }
  }

  return (
    <AuthReactContext.Provider
      value={{ user, status, signIn, signUp, signOut, updateTalentProfile }}
    >
      {children}
    </AuthReactContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthReactContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
