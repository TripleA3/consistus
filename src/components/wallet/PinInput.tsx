"use client";

import { useRef } from "react";

const LENGTH = 4;

type PinInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  autoFocus?: boolean;
};

export function PinInput({ value, onChange, label, autoFocus }: PinInputProps) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(LENGTH, " ").split("").slice(0, LENGTH);

  function setDigit(index: number, digit: string) {
    const clean = digit.replace(/\D/g, "").slice(-1);
    const next = value.split("");
    next[index] = clean;
    const joined = next.join("").slice(0, LENGTH);
    onChange(joined);
    if (clean && index < LENGTH - 1) {
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

export const PIN_LENGTH = LENGTH;
