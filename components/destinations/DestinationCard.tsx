"use client";

import { useState } from "react";
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
  const [hovered, setHovered] = useState(false);

  return (
    <article
      onClick={() => onClick(d)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        bg-white rounded-2xl overflow-hidden cursor-pointer
        border transition-all duration-300
        ${hovered
          ? "border-brand-sky-light shadow-[0_20px_40px_rgba(14,165,233,0.12)] -translate-y-1"
          : "border-slate-200 shadow-sm"
        }
      `}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {d.image_url && (
          <Image
            src={d.image_url}
            alt={d.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-transform duration-500 ${
              hovered ? "scale-105" : "scale-100"
            }`}
          />
        )}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Region badge */}
        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-brand-ocean">
          {d.region}
        </span>

        {/* Favorite button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(d.id);
          }}
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform duration-200 cursor-pointer"
          aria-label={isSaved ? "Remove from bucket list" : "Add to bucket list"}
        >
          <Heart
            size={17}
            fill={isSaved ? "#EC4899" : "none"}
            className={isSaved ? "text-pink-500" : "text-slate-400"}
          />
        </button>

        {/* Name overlay */}
        <h3 className="absolute bottom-3 left-4 font-heading text-2xl font-bold text-white drop-shadow-md">
          {d.name}
        </h3>
      </div>

      {/* Body */}
      <div className="p-5">
        <p className="font-heading text-base italic text-brand-sky mb-3 leading-snug">
          {d.tagline}
        </p>

        {/* Ratings */}
        <div className="flex flex-col gap-2 mb-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <DollarSign size={13} className="text-orange-500" /> Cost
            </span>
            <CostLabel level={d.cost_level} />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Shield size={13} className="text-brand-sky" /> Safety
            </span>
            <RatingDots value={d.safety_rating} color="sky" />
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Home size={13} className="text-emerald-500" /> Stay Potential
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
