"use client";

import Image from "next/image";
import { X, Heart, Calendar, DollarSign, Sun, Star } from "lucide-react";
import type { Destination } from "@/lib/types";
import CostLabel from "@/components/ui/CostLabel";
import RatingDots from "@/components/ui/RatingDots";
import VibeTag from "@/components/ui/VibeTag";

interface Props {
  destination: Destination;
  isSaved: boolean;
  onToggleSave: (id: string) => void;
  onClose: () => void;
}

export default function DestinationModal({
  destination: d,
  isSaved,
  onToggleSave,
  onClose,
}: Props) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-brand-ocean/50 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin"
      >
        {/* Hero */}
        <div className="relative h-72">
          {d.image_url && (
            <Image
              src={d.image_url}
              alt={d.name}
              fill
              sizes="700px"
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 rounded-full cursor-pointer hover:bg-white transition-colors duration-200"
            aria-label="Close"
          >
            <X size={20} className="text-brand-ocean" />
          </button>

          <div className="absolute bottom-5 left-7 right-7">
            <span className="inline-block px-3 py-1 bg-white/90 rounded-full text-xs font-semibold text-brand-ocean mb-2">
              {d.region} · {d.country}
            </span>
            <h2 className="font-heading text-4xl font-bold text-white drop-shadow-lg">
              {d.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-7">
          <p className="font-heading text-xl italic text-brand-sky mb-1">
            {d.tagline}
          </p>
          <p className="font-body text-sm leading-relaxed text-slate-600 mb-6">
            {d.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { icon: Calendar, color: "text-brand-sky", label: "Best Time", value: d.best_months },
              { icon: DollarSign, color: "text-orange-500", label: "Daily Budget", value: d.avg_daily_budget },
              { icon: Sun, color: "text-amber-500", label: "Ideal Stay", value: d.ideal_stay_duration },
            ].map((s) => (
              <div key={s.label} className="bg-brand-bg rounded-xl p-4 text-center">
                <s.icon size={18} className={`${s.color} mx-auto mb-1.5`} />
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  {s.label}
                </div>
                <div className="text-sm font-semibold text-brand-ocean">
                  {s.value || "—"}
                </div>
              </div>
            ))}
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Cost Level</span>
              <CostLabel level={d.cost_level} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Safety</span>
              <RatingDots value={d.safety_rating} color="sky" />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-medium text-slate-500">Long-Stay Potential</span>
              <RatingDots value={d.return_potential} color="emerald" />
            </div>
          </div>

          {/* Highlights */}
          <h4 className="font-heading text-xl font-bold text-brand-ocean mb-3">
            Must-Do Experiences
          </h4>
          <div className="grid grid-cols-2 gap-2.5 mb-6">
            {d.highlights.map((h) => (
              <div
                key={h}
                className="flex items-center gap-2 px-3.5 py-2.5 bg-brand-bg rounded-lg"
              >
                <Star size={13} className="text-orange-500 fill-orange-500 flex-shrink-0" />
                <span className="text-sm font-medium text-brand-ocean">{h}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {d.vibes.map((v) => (
                <VibeTag key={v} vibe={v} />
              ))}
            </div>
            <button
              onClick={() => onToggleSave(d.id)}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${isSaved
                  ? "bg-pink-500 text-white hover:bg-pink-600"
                  : "bg-brand-sky text-white hover:bg-brand-sky-dark"
                }
              `}
            >
              <Heart size={15} fill={isSaved ? "white" : "none"} />
              {isSaved ? "Saved" : "Save to Bucket List"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
