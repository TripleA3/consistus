"use client";

import { Monitor, Moon, Sun } from "@phosphor-icons/react/dist/ssr";
import { useTheme, type Theme } from "@/components/theme/useTheme";

const ORDER: Theme[] = ["light", "dark", "system"];
const ICONS = { light: Sun, dark: Moon, system: Monitor } as const;
const LABELS = { light: "Light", dark: "Dark", system: "System" } as const;

/**
 * Cycles light → dark → system. The full three-way choice also lives in
 * Account → Settings → Appearance, which is where phones get it.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const Icon = ICONS[theme];
  const next = ORDER[(ORDER.indexOf(theme) + 1) % ORDER.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Theme: ${LABELS[theme]}. Switch to ${LABELS[next]}.`}
      className="flex size-10 items-center justify-center rounded-pill text-foreground hover:bg-accent"
    >
      <Icon size={20} weight="bold" />
    </button>
  );
}
