"use client";

import { REGIONS, VIBES, type Region, type Vibe, type SortOption } from "@/lib/types";

interface Props {
  selectedRegion: Region;
  selectedVibe: Vibe;
  sortBy: SortOption;
  onRegionChange: (r: Region) => void;
  onVibeChange: (v: Vibe) => void;
  onSortChange: (s: SortOption) => void;
}

export default function FilterBar({
  selectedRegion,
  selectedVibe,
  sortBy,
  onRegionChange,
  onVibeChange,
  onSortChange,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-7">
      {/* Regions */}
      <div className="flex flex-wrap gap-1.5">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => onRegionChange(r)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${selectedRegion === r
                ? "bg-brand-sky text-white border-brand-sky"
                : "bg-white text-slate-500 border-slate-200 hover:border-brand-sky-light hover:text-brand-sky"
              }
              border
            `}
          >
            {r}
          </button>
        ))}
      </div>

      <div className="w-px h-7 bg-slate-200 mx-1 hidden sm:block" />

      {/* Vibes */}
      <div className="flex flex-wrap gap-1.5">
        {VIBES.map((v) => (
          <button
            key={v}
            onClick={() => onVibeChange(v)}
            className={`
              px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer
              ${selectedVibe === v
                ? "bg-brand-orange text-white border-brand-orange"
                : "bg-white text-slate-500 border-slate-200 hover:border-orange-300 hover:text-brand-orange"
              }
              border
            `}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Sort */}
      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-sm font-medium text-brand-ocean cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
      >
        <option value="name">Sort: A-Z</option>
        <option value="cost-low">Sort: Budget First</option>
        <option value="cost-high">Sort: Premium First</option>
        <option value="safety">Sort: Safest First</option>
        <option value="stay">Sort: Best for Long Stay</option>
      </select>
    </div>
  );
}
