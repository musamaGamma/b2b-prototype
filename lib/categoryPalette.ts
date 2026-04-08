import { SUPPLIER_CATEGORIES } from "./mockData";

export const CATEGORY_ALL_VALUE = "All";

export type CategoryPalette = {
  chipInactive: string;
  chipActive: string;
  topBar: string;
  cardBorder: string;
  cardRing: string;
  badge: string;
  metricIcon: string;
  tagChip: string;
};

const PALETTES: CategoryPalette[] = [
  {
    chipInactive: "border border-sky-200/90 bg-sky-50 text-sky-900 hover:bg-sky-100 hover:border-sky-300",
    chipActive: "border border-sky-600 bg-sky-600 text-white shadow-sm hover:bg-sky-700",
    topBar: "bg-sky-600",
    cardBorder: "border-sky-200/90",
    cardRing: "ring-sky-200/40",
    badge: "bg-sky-600 text-white",
    metricIcon: "text-sky-600",
    tagChip: "border-sky-200/80 bg-sky-50/80 text-sky-950",
  },
  {
    chipInactive: "border border-emerald-200/90 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 hover:border-emerald-300",
    chipActive: "border border-emerald-600 bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
    topBar: "bg-emerald-600",
    cardBorder: "border-emerald-200/90",
    cardRing: "ring-emerald-200/40",
    badge: "bg-emerald-600 text-white",
    metricIcon: "text-emerald-600",
    tagChip: "border-emerald-200/80 bg-emerald-50/80 text-emerald-950",
  },
  {
    chipInactive: "border border-violet-200/90 bg-violet-50 text-violet-900 hover:bg-violet-100 hover:border-violet-300",
    chipActive: "border border-violet-600 bg-violet-600 text-white shadow-sm hover:bg-violet-700",
    topBar: "bg-violet-600",
    cardBorder: "border-violet-200/90",
    cardRing: "ring-violet-200/40",
    badge: "bg-violet-600 text-white",
    metricIcon: "text-violet-600",
    tagChip: "border-violet-200/80 bg-violet-50/80 text-violet-950",
  },
  {
    chipInactive: "border border-amber-200/90 bg-amber-50 text-amber-950 hover:bg-amber-100 hover:border-amber-300",
    chipActive: "border border-amber-500 bg-amber-500 text-zinc-950 shadow-sm hover:bg-amber-600",
    topBar: "bg-amber-500",
    cardBorder: "border-amber-200/90",
    cardRing: "ring-amber-200/40",
    badge: "bg-amber-500 text-zinc-950",
    metricIcon: "text-amber-600",
    tagChip: "border-amber-200/80 bg-amber-50/80 text-amber-950",
  },
  {
    chipInactive: "border border-rose-200/90 bg-rose-50 text-rose-900 hover:bg-rose-100 hover:border-rose-300",
    chipActive: "border border-rose-600 bg-rose-600 text-white shadow-sm hover:bg-rose-700",
    topBar: "bg-rose-600",
    cardBorder: "border-rose-200/90",
    cardRing: "ring-rose-200/40",
    badge: "bg-rose-600 text-white",
    metricIcon: "text-rose-600",
    tagChip: "border-rose-200/80 bg-rose-50/80 text-rose-950",
  },
  {
    chipInactive: "border border-teal-200/90 bg-teal-50 text-teal-900 hover:bg-teal-100 hover:border-teal-300",
    chipActive: "border border-teal-600 bg-teal-600 text-white shadow-sm hover:bg-teal-700",
    topBar: "bg-teal-600",
    cardBorder: "border-teal-200/90",
    cardRing: "ring-teal-200/40",
    badge: "bg-teal-600 text-white",
    metricIcon: "text-teal-600",
    tagChip: "border-teal-200/80 bg-teal-50/80 text-teal-950",
  },
  {
    chipInactive: "border border-orange-200/90 bg-orange-50 text-orange-950 hover:bg-orange-100 hover:border-orange-300",
    chipActive: "border border-orange-600 bg-orange-600 text-white shadow-sm hover:bg-orange-700",
    topBar: "bg-orange-600",
    cardBorder: "border-orange-200/90",
    cardRing: "ring-orange-200/40",
    badge: "bg-orange-600 text-white",
    metricIcon: "text-orange-600",
    tagChip: "border-orange-200/80 bg-orange-50/80 text-orange-950",
  },
  {
    chipInactive: "border border-indigo-200/90 bg-indigo-50 text-indigo-900 hover:bg-indigo-100 hover:border-indigo-300",
    chipActive: "border border-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700",
    topBar: "bg-indigo-600",
    cardBorder: "border-indigo-200/90",
    cardRing: "ring-indigo-200/40",
    badge: "bg-indigo-600 text-white",
    metricIcon: "text-indigo-600",
    tagChip: "border-indigo-200/80 bg-indigo-50/80 text-indigo-950",
  },
  {
    chipInactive: "border border-fuchsia-200/90 bg-fuchsia-50 text-fuchsia-900 hover:bg-fuchsia-100 hover:border-fuchsia-300",
    chipActive: "border border-fuchsia-600 bg-fuchsia-600 text-white shadow-sm hover:bg-fuchsia-700",
    topBar: "bg-fuchsia-600",
    cardBorder: "border-fuchsia-200/90",
    cardRing: "ring-fuchsia-200/40",
    badge: "bg-fuchsia-600 text-white",
    metricIcon: "text-fuchsia-600",
    tagChip: "border-fuchsia-200/80 bg-fuchsia-50/80 text-fuchsia-950",
  },
  {
    chipInactive: "border border-cyan-200/90 bg-cyan-50 text-cyan-900 hover:bg-cyan-100 hover:border-cyan-300",
    chipActive: "border border-cyan-600 bg-cyan-600 text-white shadow-sm hover:bg-cyan-700",
    topBar: "bg-cyan-600",
    cardBorder: "border-cyan-200/90",
    cardRing: "ring-cyan-200/40",
    badge: "bg-cyan-600 text-white",
    metricIcon: "text-cyan-600",
    tagChip: "border-cyan-200/80 bg-cyan-50/80 text-cyan-950",
  },
];

const NEUTRAL: CategoryPalette = {
  chipInactive: "border border-slate-200/90 bg-slate-100 text-slate-700 hover:bg-slate-200 hover:border-slate-300",
  chipActive: "border border-slate-700 bg-slate-800 text-white shadow-sm hover:bg-slate-900",
  topBar: "bg-slate-500",
  cardBorder: "border-slate-200/90",
  cardRing: "ring-slate-200/40",
  badge: "bg-slate-700 text-white",
  metricIcon: "text-slate-600",
  tagChip: "border-slate-200/80 bg-slate-100 text-slate-800",
};

const KNOWN_INDEX = new Map<string, number>();
(() => {
  let i = 0;
  for (const c of SUPPLIER_CATEGORIES) {
    KNOWN_INDEX.set(c.toLowerCase(), i % PALETTES.length);
    i++;
  }
})();

function simpleHash(s: string): number {
  let h = 0;
  for (let k = 0; k < s.length; k++) {
    h = (h << 5) - h + s.charCodeAt(k);
    h |= 0;
  }
  return Math.abs(h);
}

export function getCategoryPalette(name: string): CategoryPalette {
  const key = name.trim().toLowerCase();
  if (!key || key === CATEGORY_ALL_VALUE.toLowerCase()) return NEUTRAL;
  const known = KNOWN_INDEX.get(key);
  if (known != null) return PALETTES[known];
  return PALETTES[simpleHash(key) % PALETTES.length];
}
