"use client";

import { useState } from "react";
import { REGIONS, VIBES, type Region, type Vibe, type SortOption } from "@/lib/types";
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react";

interface Props {
  selectedRegion: Region;
  selectedVibe: Vibe;
  sortBy: SortOption;
  onRegionChange: (r: Region) => void;
  onVibeChange: (v: Vibe) => void;
  onSortChange: (s: SortOption) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export default function FilterBar({
  selectedRegion,
  selectedVibe,
  sortBy,
  onRegionChange,
  onVibeChange,
  onSortChange,
  searchQuery = "",
  onSearchChange,
}: Props) {
  const [showAllRegions, setShowAllRegions] = useState(false);
  const visibleRegions = showAllRegions ? REGIONS : REGIONS.slice(0, 7);

  return (
    <div className="mb-8 space-y-4">
      {/* Search bar */}
      {onSearchChange && (
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white rounded-2xl border border-slate-200 text-sm font-medium text-brand-ocean placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/20 focus:border-brand-sky transition-all duration-200"
          />
        </div>
      )}

      {/* Filters row */}
      <div className="flex flex-wrap items-start gap-3">
        {/* Regions */}
        <div className="flex flex-wrap gap-1.5">
          {visibleRegions.map((r) => (
            <button
              key={r}
              onClick={() => onRegionChange(r)}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border
                ${selectedRegion === r
                  ? "bg-brand-ocean text-white border-brand-ocean shadow-soft"
                  : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-brand-ocean"
                }
              `}
            >
              {r}
            </button>
          ))}
          {REGIONS.length > 7 && (
            <button
              onClick={() => setShowAllRegions(!showAllRegions)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold text-brand-sky border border-brand-sky/20 hover:bg-brand-sky/5 transition-all duration-200 cursor-pointer flex items-center gap-1"
            >
              {showAllRegions ? "Less" : `+${REGIONS.length - 7}`}
              <ChevronDown size={12} className={`transition-transform duration-200 ${showAllRegions ? "rotate-180" : ""}`} />
            </button>
          )}
        </div>

        <div className="w-px h-7 bg-slate-200 mx-0.5 hidden sm:block self-center" />

        {/* Vibes */}
        <div className="flex flex-wrap gap-1.5">
          {VIBES.map((v) => (
            <button
              key={v}
              onClick={() => onVibeChange(v)}
              className={`
                px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer border
                ${selectedVibe === v
                  ? "bg-brand-orange text-white border-brand-orange shadow-soft"
                  : "bg-white text-slate-500 border-slate-200 hover:border-orange-200 hover:text-brand-orange"
                }
              `}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        {/* Sort */}
        <div className="relative">
          <SlidersHorizontal size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-brand-ocean cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-sky/20 appearance-none"
          >
            <option value="name">A-Z</option>
            <option value="cost-low">Budget First</option>
            <option value="cost-high">Premium First</option>
            <option value="safety">Safest</option>
            <option value="stay">Best for Long Stay</option>
          </select>
        </div>
      </div>
    </div>
  );
}
