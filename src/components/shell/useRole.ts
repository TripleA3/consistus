"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Role } from "@/lib/roles";

const STORAGE_KEY = "fanero-role";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function read(): Role {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "talent" || stored === "organizer" ? stored : "fan";
  } catch {
    return "fan";
  }
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  // Another tab switching role should move this one too.
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * The viewer's active role, which drives navigation, the home hero and
 * what they're allowed to create.
 *
 * Kept in localStorage for now, matching the prototype. The build spec puts
 * it on the user record server-side — when the Prisma migration lands this
 * reads from the session instead, and only this file changes.
 */
export function useRole() {
  const role = useSyncExternalStore(subscribe, read, () => "fan" as Role);

  const setRole = useCallback((next: Role) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Private browsing — the change applies for this session only.
    }
    emit();
  }, []);

  return { role, setRole };
}
