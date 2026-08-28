"use client";

import { useState } from "react";
import { Chip } from "@/components/ui/Chip";

type CategoryChipsProps = {
  categories: { value: string; label: string }[];
  onChange?: (value: string) => void;
};

export function CategoryChips({ categories, onChange }: CategoryChipsProps) {
  const [active, setActive] = useState(categories[0]?.value);

  return (
    <div className="flex flex-wrap items-center gap-3" role="tablist" aria-label="Filter by category">
      {categories.map((category) => (
        <Chip
          key={category.value}
          variant={active === category.value ? "active" : "filled"}
          role="tab"
          aria-selected={active === category.value}
          onClick={() => {
            setActive(category.value);
            onChange?.(category.value);
          }}
        >
          {category.label}
        </Chip>
      ))}
    </div>
  );
}
