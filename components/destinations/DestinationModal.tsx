"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Heart, Calendar, DollarSign, Sun, Star, MapPin } from "lucide-react";
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
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] bg-brand-ocean/40 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl scrollbar-thin animate-scale-in"
      >
        {/* Hero */}
        <div className="relative h-80">
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-full cursor-pointer hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label="Close"
          >
            <X size={18} className="text-brand-ocean" />
          </button>

          <div className="absolute bottom-6 left-7 right-7">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={14} className="text-white/70" />
              <span className="text-sm font-medium text-white/80">
                {d.region} · {d.country}
              </span>
            </div>
            <h2 className="font-heading text-4xl font-bold text-white drop-shadow-lg leading-tight">
              {d.name}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-7">
          <p className="font-heading text-xl italic text-brand-sky mb-2">
            {d.tagline}
          </p>
          <p className="text-sm leading-relaxed text-slate-600 mb-7">
            {d.description}
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mb-7">
            {[
              { icon: Calendar, color: "text-brand-sky", bg: "bg-sky-50", label: "Best Time", value: d.best_months },
              { icon: DollarSign, color: "text-orange-500", bg: "bg-orange-50", label: "Daily Budget", value: d.avg_daily_budget },
              { icon: Sun, color: "text-amber-500", bg: "bg-amber-50", label: "Ideal Stay", value: d.ideal_stay_duration },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-2xl p-4 text-center`}>
                <s.icon size={18} className={`${s.color} mx-auto mb-2`} strokeWidth={1.8} />
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {s.label}
                </div>
                <div className="text-sm font-bold text-brand-ocean">
                  {s.value || "\u2014"}
                </div>
              </div>
            ))}
          </div>

          {/* Ratings */}
          <div className="grid grid-cols-3 gap-4 mb-7 p-4 bg-slate-50/80 rounded-2xl">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Cost</span>
              <CostLabel level={d.cost_level} />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safety</span>
              <RatingDots value={d.safety_rating} color="sky" />
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Long-Stay</span>
              <RatingDots value={d.return_potential} color="emerald" />
            </div>
          </div>

          {/* Highlights */}
          <h4 className="font-heading text-xl font-bold text-brand-ocean mb-3">
            Must-Do Experiences
          </h4>
          <div className="grid grid-cols-2 gap-2 mb-7">
            {d.highlights.map((h) => (
              <div
                key={h}
                className="flex items-start gap-2.5 px-4 py-3 bg-brand-bg rounded-xl"
              >
                <Star size={13} className="text-brand-orange fill-brand-orange flex-shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-brand-ocean leading-snug">{h}</span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex flex-wrap gap-2">
              {d.vibes.map((v) => (
                <VibeTag key={v} vibe={v} size="md" />
              ))}
            </div>
            <button
              onClick={() => onToggleSave(d.id)}
              className={`
                flex items-center gap-2 px-6 py-2.5 rounded-2xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${isSaved
                  ? "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/20"
                  : "bg-brand-sky text-white hover:bg-brand-sky-dark shadow-lg shadow-brand-sky/20"
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
