"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import type { UserRole } from "@/lib/types";

type RequireAuthProps = {
  children: React.ReactNode;
  role?: UserRole;
};

/**
 * Client-side route guard for the stubbed auth system — there's no real
 * session/cookie to check on the server, so protection happens after
 * mount: redirect to sign-in if signed out, or home if signed in but
 * missing the required role. Renders nothing while that check runs, to
 * avoid flashing protected content.
 */
export function RequireAuth({ children, role }: RequireAuthProps) {
  const { user, status } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (status !== "ready") return;
    if (!user) {
      router.replace("/sign-in");
      return;
    }
    if (role && !user.roles.includes(role)) {
      router.replace("/");
    }
  }, [status, user, role, router]);

  if (status !== "ready" || !user || (role && !user.roles.includes(role))) {
    return null;
  }

  return <>{children}</>;
}
