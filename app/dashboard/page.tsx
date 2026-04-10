"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import DestinationModal from "@/components/destinations/DestinationModal";
import { createClient } from "@/lib/supabase";
import type { Destination, BucketListItem, Trip, Memory } from "@/lib/types";
import { Heart, Map, Camera, Compass, ArrowRight, Sparkles, Plane, Globe, Send } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string; bg: string }> = {
  dreaming: { label: "Dreaming", color: "text-violet-700", bg: "bg-violet-50 border-violet-100" },
  planning: { label: "Planning", color: "text-blue-700", bg: "bg-blue-50 border-blue-100" },
  booked: { label: "Booked!", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-100" },
  visited: { label: "Visited", color: "text-amber-700", bg: "bg-amber-50 border-amber-100" },
};

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [bucketList, setBucketList] = useState<BucketListItem[]>([]);
  const [destinations, setDestinations] = useState<Record<string, Destination>>({});
  const [trips, setTrips] = useState<Trip[]>([]);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
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

      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      setProfile(prof);

      const { data: bl } = await supabase
        .from("bucket_list")
        .select("*, destination:destinations(*)")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false });

      if (bl) {
        setBucketList(bl);
        const destMap: Record<string, Destination> = {};
        bl.forEach((item: any) => {
          if (item.destination) destMap[item.destination.id] = item.destination;
        });
        setDestinations(destMap);
      }

      const { data: tr } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (tr) setTrips(tr);

      const { data: mem } = await supabase
        .from("memories")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (mem) setMemories(mem);

      setLoading(false);
    }
    load();
  }, []);

  const savedIds = new Set(bucketList.map((b) => b.destination_id));

  const toggleSave = async (destId: string) => {
    if (!user) return;
    const isSaved = savedIds.has(destId);

    if (isSaved) {
      await supabase
        .from("bucket_list")
        .delete()
        .eq("user_id", user.id)
        .eq("destination_id", destId);
      setBucketList((prev) => prev.filter((b) => b.destination_id !== destId));
    }
  };

  const updateStatus = async (itemId: string, newStatus: string) => {
    await supabase
      .from("bucket_list")
      .update({ status: newStatus })
      .eq("id", itemId);

    setBucketList((prev) =>
      prev.map((b) => (b.id === itemId ? { ...b, status: newStatus as any } : b))
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg">
        <Header user={null} />
        <div className="page-banner">
          <div className="relative max-w-7xl mx-auto">
            <div className="h-8 skeleton w-64 mb-2 !bg-white/10" />
            <div className="h-5 skeleton w-48 !bg-white/10" />
          </div>
        </div>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-slate-100">
                <div className="h-10 w-10 skeleton rounded-xl mb-3" />
                <div className="h-7 skeleton w-12 mb-2" />
                <div className="h-3 skeleton w-20" />
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  const dreamingCount = bucketList.filter((b) => b.status === "dreaming").length;
  const planningCount = bucketList.filter((b) => b.status === "planning").length;
  const visitedCount = bucketList.filter((b) => b.status === "visited").length;
  const firstName = profile?.full_name?.split(" ")[0];

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user ? { email: user.email, full_name: profile?.full_name } : null} onSignOut={handleSignOut} />

      {/* Welcome Banner */}
      <div className="page-banner">
        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <Plane size={20} className="text-white/50" />
            <span className="text-sm font-medium text-white/50 uppercase tracking-widest">Dashboard</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="font-heading text-lg italic text-white/50">
            Your next adventure is waiting
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* AI Concierge Hero Card */}
        <Link
          href="/plan"
          className="block mb-8 group relative overflow-hidden rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-orange via-amber-500 to-amber-600" />
          <div className="absolute inset-0 opacity-[0.08]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }} />
          <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6 p-7 md:p-8">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shadow-lg">
              <Sparkles size={26} className="text-white" strokeWidth={1.8} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-1">
                AI Travel Concierge
              </div>
              <h2 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1 leading-tight">
                {firstName ? `${firstName}, where will you go next?` : "Where will you go next?"}
              </h2>
              <p className="text-sm text-white/80 italic font-heading">
                Tell me about your dream trip. I'll build the itinerary.
              </p>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl font-semibold text-sm text-brand-orange shadow-lg group-hover:scale-105 transition-transform duration-300">
              Start Planning
              <ArrowRight size={16} />
            </div>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Dreaming Of", value: dreamingCount, icon: Sparkles, gradient: "from-violet-500 to-purple-600" },
            { label: "Planning", value: planningCount, icon: Map, gradient: "from-blue-500 to-sky-600" },
            { label: "Visited", value: visitedCount, icon: Globe, gradient: "from-pink-500 to-rose-600" },
            { label: "Memories", value: memories.length, icon: Camera, gradient: "from-amber-500 to-orange-600" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 shadow-soft`}>
                <s.icon size={18} className="text-white" strokeWidth={1.8} />
              </div>
              <div className="font-heading text-3xl font-bold text-brand-ocean">{s.value}</div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bucket List */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="section-heading text-2xl">
              Your Bucket List
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-sky hover:text-brand-sky-dark transition-colors duration-200 cursor-pointer"
            >
              <Compass size={15} strokeWidth={1.8} />
              Explore more
              <ArrowRight size={14} />
            </Link>
          </div>

          {bucketList.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-card">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4">
                <Heart size={28} className="text-slate-300" />
              </div>
              <p className="font-heading text-xl text-slate-400 mb-1">
                Your bucket list is empty
              </p>
              <p className="text-sm text-slate-400 mb-6">
                Start exploring and save your dream destinations
              </p>
              <Link href="/explore" className="btn-primary">
                <Compass size={16} />
                Explore Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {bucketList.map((item) => {
                const dest = destinations[item.destination_id];
                if (!dest) return null;
                const st = statusLabels[item.status];

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-4 border border-slate-100 shadow-card flex items-center gap-4 hover:shadow-card-hover transition-all duration-300 group"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-14 h-14 rounded-xl bg-cover bg-center flex-shrink-0 cursor-pointer group-hover:scale-105 transition-transform duration-300"
                      style={{ backgroundImage: `url(${dest.image_url})` }}
                      onClick={() => setSelectedDest(dest)}
                    />

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => setSelectedDest(dest)}
                        className="font-heading text-lg font-bold text-brand-ocean hover:text-brand-sky transition-colors duration-200 cursor-pointer truncate block text-left"
                      >
                        {dest.name}
                      </button>
                      <p className="text-xs text-slate-400 font-medium">{dest.region} · {dest.avg_daily_budget}</p>
                    </div>

                    {/* Status selector */}
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-sky/20 ${st.bg} ${st.color}`}
                    >
                      <option value="dreaming">Dreaming</option>
                      <option value="planning">Planning</option>
                      <option value="booked">Booked!</option>
                      <option value="visited">Visited</option>
                    </select>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-4">
          <Link
            href="/trips/new"
            className="bg-white rounded-3xl p-7 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mb-4 shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Map size={20} className="text-white" strokeWidth={1.8} />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ocean mb-1">Plan a Trip</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Build a day-by-day itinerary with budgets, bookings, and must-see spots.
            </p>
          </Link>
          <Link
            href="/memories/new"
            className="bg-white rounded-3xl p-7 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-4 shadow-soft group-hover:scale-105 transition-transform duration-300">
              <Camera size={20} className="text-white" strokeWidth={1.8} />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ocean mb-1">Add a Memory</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Capture the moments that took your breath away with stories, photos, and feelings.
            </p>
          </Link>
        </div>
      </main>

      {selectedDest && (
        <DestinationModal
          destination={selectedDest}
          isSaved={savedIds.has(selectedDest.id)}
          onToggleSave={toggleSave}
          onClose={() => setSelectedDest(null)}
        />
      )}
    </div>
  );
}
