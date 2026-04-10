"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/layout/Header";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationModal from "@/components/destinations/DestinationModal";
import { createClient } from "@/lib/supabase";
import type { Destination, BucketListItem, Trip, Memory } from "@/lib/types";
import { Heart, Map, Camera, Compass, ArrowRight, Sparkles } from "lucide-react";

const statusLabels: Record<string, { label: string; color: string }> = {
  dreaming: { label: "Dreaming", color: "bg-violet-100 text-violet-700" },
  planning: { label: "Planning", color: "bg-blue-100 text-blue-700" },
  booked: { label: "Booked!", color: "bg-emerald-100 text-emerald-700" },
  visited: { label: "Visited", color: "bg-amber-100 text-amber-700" },
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

      // Load profile
      const { data: prof } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authUser.id)
        .single();
      setProfile(prof);

      // Load bucket list with destinations
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

      // Load trips
      const { data: tr } = await supabase
        .from("trips")
        .select("*")
        .eq("user_id", authUser.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (tr) setTrips(tr);

      // Load memories
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
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="animate-pulse text-brand-sky font-heading text-2xl">Loading your adventures...</div>
      </div>
    );
  }

  const dreamingCount = bucketList.filter((b) => b.status === "dreaming").length;
  const planningCount = bucketList.filter((b) => b.status === "planning").length;
  const visitedCount = bucketList.filter((b) => b.status === "visited").length;

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user ? { email: user.email, full_name: profile?.full_name } : null} onSignOut={handleSignOut} />

      {/* Welcome */}
      <div className="bg-gradient-to-r from-brand-ocean via-brand-sky to-brand-sky-light py-10 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-1">
            Welcome back{profile?.full_name ? `, ${profile.full_name.split(" ")[0]}` : ""}
          </h1>
          <p className="font-heading text-lg italic text-white/75">
            Your next adventure is waiting
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Dreaming Of", value: dreamingCount, icon: Sparkles, color: "text-violet-500 bg-violet-50" },
            { label: "Planning", value: planningCount, icon: Map, color: "text-blue-500 bg-blue-50" },
            { label: "Visited", value: visitedCount, icon: Heart, color: "text-pink-500 bg-pink-50" },
            { label: "Memories", value: memories.length, icon: Camera, color: "text-amber-500 bg-amber-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 border border-slate-200/60">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <s.icon size={20} />
              </div>
              <div className="text-2xl font-bold text-brand-ocean">{s.value}</div>
              <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Bucket List */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-heading text-2xl font-bold text-brand-ocean">
              Your Bucket List
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1.5 text-sm font-semibold text-brand-sky hover:text-brand-sky-dark transition-colors duration-200 cursor-pointer"
            >
              <Compass size={15} />
              Add more
              <ArrowRight size={14} />
            </Link>
          </div>

          {bucketList.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-200/60">
              <Heart size={40} className="text-slate-300 mx-auto mb-3" />
              <p className="font-heading text-lg text-slate-400 mb-4">
                Your bucket list is empty — time to start dreaming!
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-sky text-white font-semibold rounded-xl hover:bg-brand-sky-dark transition-colors duration-200 cursor-pointer"
              >
                <Compass size={16} />
                Explore Destinations
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bucketList.map((item) => {
                const dest = destinations[item.destination_id];
                if (!dest) return null;
                const st = statusLabels[item.status];

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 border border-slate-200/60 flex items-center gap-4 hover:shadow-md transition-shadow duration-200"
                  >
                    {/* Thumbnail */}
                    <div
                      className="w-16 h-16 rounded-xl bg-cover bg-center flex-shrink-0 cursor-pointer"
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
                      <p className="text-xs text-slate-400">{dest.region} · {dest.avg_daily_budget}</p>
                    </div>

                    {/* Status selector */}
                    <select
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${st.color}`}
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
            className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <Map size={22} />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ocean mb-1">Plan a Trip</h3>
            <p className="text-sm text-slate-500">
              Build a day-by-day itinerary with budgets, bookings, and must-see spots.
            </p>
          </Link>
          <Link
            href="/memories/new"
            className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-500 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-200">
              <Camera size={22} />
            </div>
            <h3 className="font-heading text-xl font-bold text-brand-ocean mb-1">Add a Memory</h3>
            <p className="text-sm text-slate-500">
              Capture the moments that took your breath away — stories, photos, and feelings.
            </p>
          </Link>
        </div>
      </main>

      {/* Modal */}
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
