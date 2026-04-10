"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase";
import type { Memory } from "@/lib/types";
import { Camera, Plus, Heart, Calendar, Sparkles, MapPin } from "lucide-react";

const moodConfig: Record<string, { label: string; color: string }> = {
  magical: { label: "Magical", color: "bg-violet-100 text-violet-700" },
  adventurous: { label: "Adventurous", color: "bg-blue-100 text-blue-700" },
  romantic: { label: "Romantic", color: "bg-pink-100 text-pink-700" },
  peaceful: { label: "Peaceful", color: "bg-emerald-100 text-emerald-700" },
  joyful: { label: "Joyful", color: "bg-amber-100 text-amber-700" },
  awestruck: { label: "Awestruck", color: "bg-orange-100 text-orange-700" },
};

export default function MemoriesPage() {
  const [user, setUser] = useState<any>(null);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        window.location.href = "/auth/login";
        return;
      }
      setUser(authUser);

      const { data } = await supabase
        .from("memories")
        .select("*, destination:destinations(name, region, image_url)")
        .eq("user_id", authUser.id)
        .order("date", { ascending: false });

      if (data) setMemories(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const toggleFavorite = async (id: string, current: boolean) => {
    await supabase.from("memories").update({ is_favorite: !current }).eq("id", id);
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_favorite: !current } : m))
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="bg-gradient-to-r from-brand-ocean via-brand-sky to-brand-sky-light py-12 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-4xl font-bold text-white mb-1">Travel Memories</h1>
            <p className="font-heading text-lg italic text-white/75">
              Moments that took your breath away
            </p>
          </div>
          <Link
            href="/memories/new"
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold rounded-xl transition-colors duration-200 cursor-pointer"
          >
            <Plus size={16} />
            New Memory
          </Link>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-5 bg-slate-200 rounded w-1/3 mb-3" />
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
                <div className="h-4 bg-slate-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : memories.length === 0 ? (
          <div className="text-center py-20">
            <Camera size={48} className="text-slate-300 mx-auto mb-4" />
            <h2 className="font-heading text-2xl font-bold text-slate-400 mb-2">
              No memories yet
            </h2>
            <p className="text-slate-400 mb-6">
              After your first adventure, come back here to capture the moments you never want to forget.
            </p>
            <Link
              href="/memories/new"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-sky text-white font-semibold rounded-xl hover:bg-brand-sky-dark transition-colors duration-200 cursor-pointer"
            >
              <Plus size={16} />
              Create Your First Memory
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {memories.map((m) => {
              const mood = m.mood ? moodConfig[m.mood] : null;
              const dest = (m as any).destination;

              return (
                <Link
                  key={m.id}
                  href={`/memories/${m.id}`}
                  className="block bg-white rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-heading text-xl font-bold text-brand-ocean">
                          {m.title}
                        </h3>
                        {mood && (
                          <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${mood.color}`}>
                            {mood.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        {m.date && (
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {new Date(m.date).toLocaleDateString("en-US", {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                        )}
                        {dest && (
                          <span className="flex items-center gap-1">
                            <MapPin size={12} />
                            {dest.name}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(m.id, m.is_favorite);
                      }}
                      className="p-2 hover:bg-pink-50 rounded-lg transition-colors duration-200 cursor-pointer"
                      aria-label={m.is_favorite ? "Remove from favorites" : "Add to favorites"}
                    >
                      <Heart
                        size={18}
                        fill={m.is_favorite ? "#EC4899" : "none"}
                        className={m.is_favorite ? "text-pink-500" : "text-slate-300"}
                      />
                    </button>
                  </div>

                  {m.story && (
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                      {m.story}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
