"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "fanero-theme";
/** Mirrored for the shell, which needs the resolved value, not the preference. */
const RESOLVED_KEY = "fanero-dark";

const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function prefersDark() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function readTheme(): Theme {
  try {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system";
  } catch {
    return "system";
  }
}

function readIsDark(): boolean {
  return document.documentElement.classList.contains("dark");
}

function apply(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && prefersDark());
  document.documentElement.classList.toggle("dark", dark);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    localStorage.setItem(RESOLVED_KEY, dark ? "1" : "0");
  } catch {
    // Private browsing — the class still applies for this session.
  }
  emit();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  // Only "system" follows the OS; an explicit choice stays put.
  const onMediaChange = () => {
    if (readTheme() === "system") apply("system");
  };
  media.addEventListener("change", onMediaChange);
  return () => {
    listeners.delete(onChange);
    media.removeEventListener("change", onMediaChange);
  };
}

/**
 * Light / dark / system, persisted as `fanero-theme`.
 *
 * The theme lives on <html> and in localStorage — state React doesn't own —
 * so it's read through useSyncExternalStore rather than mirrored into
 * component state. First paint is handled by ThemeScript; this only reads
 * the value back and lets the UI change it.
 */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "system" as Theme);
  const isDark = useSyncExternalStore(subscribe, readIsDark, () => false);
  const setTheme = useCallback((next: Theme) => apply(next), []);
  return { theme, isDark, setTheme };
}
