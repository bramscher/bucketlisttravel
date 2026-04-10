"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationModal from "@/components/destinations/DestinationModal";
import FilterBar from "@/components/ui/FilterBar";
import { createClient } from "@/lib/supabase";
import type { Destination, Region, Vibe, SortOption } from "@/lib/types";
import { Heart, MapPin } from "lucide-react";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("All");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);

      const { data: dests } = await supabase
        .from("destinations")
        .select("*")
        .order("name");

      if (dests) setDestinations(dests);

      if (authUser) {
        const { data: bl } = await supabase
          .from("bucket_list")
          .select("destination_id")
          .eq("user_id", authUser.id);

        if (bl) {
          setSavedIds(new Set(bl.map((b) => b.destination_id)));
        }
      }

      setLoading(false);
    }
    load();
  }, []);

  const toggleSave = async (destId: string) => {
    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    const isSaved = savedIds.has(destId);

    if (isSaved) {
      await supabase
        .from("bucket_list")
        .delete()
        .eq("user_id", user.id)
        .eq("destination_id", destId);

      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(destId);
        return next;
      });
    } else {
      await supabase.from("bucket_list").insert({
        user_id: user.id,
        destination_id: destId,
        status: "dreaming",
      });

      setSavedIds((prev) => new Set(prev).add(destId));
    }
  };

  // Filter & sort
  let filtered = destinations.filter((d) => {
    if (selectedRegion !== "All" && d.region !== selectedRegion) return false;
    if (selectedVibe !== "All" && !d.vibes.includes(selectedVibe)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        d.name.toLowerCase().includes(q) ||
        d.country?.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.tagline?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  if (sortBy === "cost-low") filtered.sort((a, b) => a.cost_level - b.cost_level);
  else if (sortBy === "cost-high") filtered.sort((a, b) => b.cost_level - a.cost_level);
  else if (sortBy === "safety") filtered.sort((a, b) => b.safety_rating - a.safety_rating);
  else if (sortBy === "stay") filtered.sort((a, b) => b.return_potential - a.return_potential);
  else filtered.sort((a, b) => a.name.localeCompare(b.name));

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSavedIds(new Set());
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user} onSignOut={handleSignOut} />

      {/* Page Banner */}
      <div className="page-banner">
        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
            Explore Destinations
          </h1>
          <p className="font-heading text-lg italic text-white/60">
            {destinations.length} incredible places across {new Set(destinations.map(d => d.region)).size} regions
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <FilterBar
          selectedRegion={selectedRegion}
          selectedVibe={selectedVibe}
          sortBy={sortBy}
          onRegionChange={setSelectedRegion}
          onVibeChange={setSelectedVibe}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Results count */}
        <div className="flex items-center gap-2 mb-6">
          <MapPin size={14} className="text-slate-400" />
          <span className="text-sm font-medium text-slate-400">
            {loading ? "Loading..." : `${filtered.length} destination${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100">
                <div className="h-56 skeleton" />
                <div className="p-5 space-y-3">
                  <div className="h-5 skeleton w-3/4" />
                  <div className="h-3 skeleton w-1/2" />
                  <div className="h-3 skeleton w-full" />
                  <div className="h-3 skeleton w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <Heart size={48} className="text-slate-200 mx-auto mb-4" />
            <p className="font-heading text-xl text-slate-400 mb-2">
              No destinations match your filters
            </p>
            <p className="text-sm text-slate-400">
              Try a different combination or clear your search
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <div
                key={d.id}
                className="animate-slide-up opacity-0"
                style={{ animationDelay: `${Math.min(i * 40, 400)}ms`, animationFillMode: "forwards" }}
              >
                <DestinationCard
                  destination={d}
                  isSaved={savedIds.has(d.id)}
                  onToggleSave={toggleSave}
                  onClick={setSelectedDest}
                />
              </div>
            ))}
          </div>
        )}
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
