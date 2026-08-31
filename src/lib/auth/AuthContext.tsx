"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TalentCategory, User, UserRole } from "@/lib/types";
import { DEMO_USER } from "@/lib/auth/session";

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
  signIn: (email: string) => void;
  signUp: (input: SignUpInput) => void;
  signOut: () => void;
};

const AuthReactContext = createContext<AuthContextValue | null>(null);

/**
 * Stubbed auth for the brief's single-account default. There is no real
 * backend: `signIn` always resolves to the one seed account (any email
 * "works", matching the brief's approved default), and `signUp` mints a
 * fresh local user from the form. State is kept in localStorage so it
 * survives reloads within this browser, and nowhere else — replace with a
 * real provider (NextAuth, Clerk, ...) without touching call sites, since
 * everything goes through `useAuth()`.
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

  function signIn(email: string) {
    setUser({ ...DEMO_USER, email: email || DEMO_USER.email });
  }

  function signUp(input: SignUpInput) {
    const id = `user-${Date.now().toString(36)}`;
    const newUser: User = {
      id,
      name: input.name,
      email: input.email,
      roles: [input.role],
      talentProfile:
        input.role === "talent"
          ? {
              id: `profile-${id}`,
              userId: id,
              category: input.talentCategory ?? "artist",
              bio: input.bio ?? "",
              verified: false,
              ratePerVideo: 20000,
              ratePerAppearance: 100000,
              followerCount: 0,
            }
          : undefined,
    };
    setUser(newUser);
  }

  function signOut() {
    setUser(null);
  }

  return (
    <AuthReactContext.Provider value={{ user, status, signIn, signUp, signOut }}>
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
