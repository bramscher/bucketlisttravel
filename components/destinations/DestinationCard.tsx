"use client";

import Image from "next/image";
import { Heart, DollarSign, Shield, Home } from "lucide-react";
import type { Destination } from "@/lib/types";
import RatingDots from "@/components/ui/RatingDots";
import CostLabel from "@/components/ui/CostLabel";
import VibeTag from "@/components/ui/VibeTag";

interface Props {
  destination: Destination;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClick: (dest: Destination) => void;
}

export default function DestinationCard({
  destination: d,
  isSaved,
  onToggleSave,
  onClick,
}: Props) {
  return (
    <article
      onClick={() => onClick(d)}
      className="group bg-white rounded-3xl overflow-hidden cursor-pointer border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        {d.image_url && (
          <Image
            src={d.image_url}
            alt={d.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {/* Region badge */}
        <span className="absolute top-3.5 left-3.5 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-brand-ocean uppercase tracking-wider">
          {d.region}
        </span>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(d.id);
          }}
          className={`
            absolute top-3.5 right-3.5 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 cursor-pointer
            ${isSaved
              ? "bg-pink-500 shadow-lg shadow-pink-500/30"
              : "bg-white/90 backdrop-blur-sm hover:bg-white hover:scale-110"
            }
          `}
          aria-label={isSaved ? "Remove from bucket list" : "Add to bucket list"}
        >
          <Heart
            size={16}
            fill={isSaved ? "white" : "none"}
            className={isSaved ? "text-white" : "text-slate-500"}
            strokeWidth={2}
          />
        </button>

        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="font-heading text-2xl font-bold text-white leading-tight drop-shadow-md">
            {d.name}
          </h3>
          <p className="font-heading text-sm italic text-white/80 mt-0.5 line-clamp-1">
            {d.tagline}
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        {/* Ratings */}
        <div className="flex flex-col gap-2.5 mb-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <DollarSign size={12} /> Cost
            </span>
            <CostLabel level={d.cost_level} />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Shield size={12} /> Safety
            </span>
            <RatingDots value={d.safety_rating} color="sky" />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
              <Home size={12} /> Stay Potential
            </span>
            <RatingDots value={d.return_potential} color="emerald" />
          </div>
        </div>

        {/* Vibes */}
        <div className="flex flex-wrap gap-1.5">
          {d.vibes.map((v) => (
            <VibeTag key={v} vibe={v} />
          ))}
        </div>
      </div>
    </article>
  );
}
