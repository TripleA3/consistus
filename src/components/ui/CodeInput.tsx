"use client";

import { useRef } from "react";

const DEFAULT_LENGTH = 4;

type CodeInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  autoFocus?: boolean;
  length?: number;
};

/** Boxed numeric-code entry — used for wallet PINs and email/phone verification codes. */
export function CodeInput({
  value,
  onChange,
  label,
  autoFocus,
  length = DEFAULT_LENGTH,
}: CodeInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").split("").slice(0, length);

  function setDigit(index: number, digit: string) {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[index] = clean;
    const joined = next.join("").slice(0, length);
    onChange(joined);
    if (clean && index < length - 1) {
      refs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !digits[index].trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
  }

  return (
    <div className="flex flex-col items-center gap-2">
      {label ? <span className="text-sm font-medium text-ink">{label}</span> : null}
      <div className="flex gap-3">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            autoFocus={autoFocus && index === 0}
            value={digit.trim()}
            onChange={(e) => setDigit(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            aria-label={`Digit ${index + 1}`}
            className="size-12 rounded-lg border border-input-border text-center text-lg font-semibold text-ink shadow-card outline-none focus:border-accent"
          />
        ))}
      </div>
    </div>
  );
}
