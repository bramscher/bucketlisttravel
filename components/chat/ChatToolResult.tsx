"use client";

import Link from "next/link";
import { Search, MapPin, User, Check, ExternalLink, Plane } from "lucide-react";

interface Props {
  name: string;
  result: any;
}

export default function ChatToolResult({ name, result }: Props) {
  if (!result) return null;

  if (result.error) {
    return (
      <div className="my-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl text-xs text-red-700">
        <span className="font-semibold">Error:</span> {result.error}
      </div>
    );
  }

  if (name === "save_trip" && result.success) {
    return (
      <div className="my-3 p-4 bg-gradient-to-br from-emerald-50 to-sky-50 border border-emerald-200 rounded-2xl">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check size={14} className="text-white" strokeWidth={3} />
          </div>
          <span className="text-sm font-bold text-emerald-900">Trip Saved</span>
        </div>
        <p className="text-sm font-semibold text-brand-ocean mb-1">{result.title}</p>
        <p className="text-xs text-slate-500 mb-3">
          {result.item_count} itinerary items created
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-sky hover:text-brand-sky-dark transition-colors duration-200 cursor-pointer"
        >
          <Plane size={12} />
          View on Dashboard
          <ExternalLink size={11} />
        </Link>
      </div>
    );
  }

  if (name === "search_destinations" && result.destinations) {
    return (
      <div className="my-2 space-y-1.5">
        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">
          <Search size={10} />
          Found {result.count} destination{result.count !== 1 ? "s" : ""}
        </div>
        <div className="grid grid-cols-1 gap-1.5">
          {result.destinations.slice(0, 5).map((d: any) => (
            <div
              key={d.id}
              className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded-xl"
            >
              {d.image_url && (
                <div
                  className="w-10 h-10 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url(${d.image_url})` }}
                />
              )}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-brand-ocean truncate">
                  {d.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate">
                  {d.region} · {d.avg_daily_budget}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (name === "get_destination_details" && result.destination) {
    const d = result.destination;
    return (
      <div className="my-2 flex items-center gap-2 px-3 py-2 bg-sky-50 border border-sky-100 rounded-xl text-xs">
        <MapPin size={12} className="text-brand-sky flex-shrink-0" />
        <span className="text-brand-ocean">
          Looked up <strong>{d.name}</strong>
        </span>
      </div>
    );
  }

  if (name === "get_user_context") {
    return (
      <div className="my-2 flex items-center gap-2 px-3 py-2 bg-violet-50 border border-violet-100 rounded-xl text-xs">
        <User size={12} className="text-violet-500 flex-shrink-0" />
        <span className="text-brand-ocean">
          Checked your bucket list & trips
        </span>
      </div>
    );
  }

  return null;
}
