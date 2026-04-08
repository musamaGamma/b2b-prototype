"use client";

import { cn } from "@/lib/utils";
import { SUPPLIER_CATEGORIES } from "@/lib/mockData";
import { CATEGORY_ALL_VALUE, getCategoryPalette } from "@/lib/categoryPalette";

export { CATEGORY_ALL_VALUE };

interface CategoryChipsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryChips({ activeCategory, onCategoryChange }: CategoryChipsProps) {
  const options = [CATEGORY_ALL_VALUE, ...SUPPLIER_CATEGORIES];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((cat) => {
        const p = getCategoryPalette(cat);
        const selected = activeCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "shrink-0 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors",
              selected ? p.chipActive : p.chipInactive
            )}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
