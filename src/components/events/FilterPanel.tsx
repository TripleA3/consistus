"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type FilterPanelProps = {
  categories: { value: string; label: string }[];
  activeCategory: string;
  onCategoryChange: (value: string) => void;
};

type SectionKey = "categories" | "date" | "price" | "location" | "currency";

const sectionLabels: Record<SectionKey, string> = {
  categories: "Categories",
  date: "Date",
  price: "Price",
  location: "Location",
  currency: "Currency",
};

/**
 * Mirrors the "Filter By" accordion sidebar (node 6007:40807). Category
 * filtering is wired to real data; Date/Price/Location/Currency expand but
 * have no backing facets in the mock data yet — noted in
 * docs/open-questions.md.
 */
export function FilterPanel({ categories, activeCategory, onCategoryChange }: FilterPanelProps) {
  const [open, setOpen] = useState<SectionKey>("categories");

  return (
    <aside className="flex w-full flex-col gap-6 rounded-2xl border border-[#e5e7eb] p-6 shadow-[0px_0px_80px_0px_rgba(228,232,247,0.4)] sm:w-64">
      <h2 className="text-lg font-semibold text-black">Filter By</h2>
      <div className="flex flex-col gap-4">
        {(Object.keys(sectionLabels) as SectionKey[]).map((key) => {
          const isOpen = open === key;
          return (
            <div key={key} className="flex flex-col gap-3 border-b border-card-border pb-4 last:border-0 last:pb-0">
              <button
                type="button"
                className="flex w-full items-center justify-between text-sm text-text"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? ("" as SectionKey) : key)}
              >
                {sectionLabels[key]}
                <Icon
                  name="chevron-down"
                  className={`size-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && key === "categories" ? (
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <label
                      key={category.value}
                      className="flex items-center gap-2 text-sm text-slate-500"
                    >
                      <input
                        type="radio"
                        name="category"
                        checked={activeCategory === category.value}
                        onChange={() => onCategoryChange(category.value)}
                        className="accent-lime-500"
                      />
                      {category.label}
                    </label>
                  ))}
                </div>
              ) : null}
              {isOpen && key !== "categories" ? (
                <p className="text-xs text-slate-400">Coming soon.</p>
              ) : null}
            </div>
          );
        })}
      </div>
    </aside>
  );
}
