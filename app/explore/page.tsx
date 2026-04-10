"use client";

import { useState, useEffect } from "react";
import Header from "@/components/layout/Header";
import DestinationCard from "@/components/destinations/DestinationCard";
import DestinationModal from "@/components/destinations/DestinationModal";
import FilterBar from "@/components/ui/FilterBar";
import { createClient } from "@/lib/supabase";
import type { Destination, Region, Vibe, SortOption } from "@/lib/types";
import { Heart } from "lucide-react";

export default function ExplorePage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<Region>("All");
  const [selectedVibe, setSelectedVibe] = useState<Vibe>("All");
  const [sortBy, setSortBy] = useState<SortOption>("name");
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [selectedDest, setSelectedDest] = useState<Destination | null>(null);
  const [user, setUser] = useState<any>(null);

  const supabase = createClient();

  useEffect(() => {
    async function load() {
      // Check auth
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      setUser(authUser);

      // Fetch destinations
      const { data: dests } = await supabase
        .from("destinations")
        .select("*")
        .order("name");

      if (dests) setDestinations(dests);

      // Fetch user's bucket list
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

      {/* Page Header */}
      <div className="bg-gradient-to-r from-brand-ocean via-brand-sky to-brand-sky-light py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-2">
            Explore Destinations
          </h1>
          <p className="font-heading text-lg italic text-white/75">
            {destinations.length} incredible places waiting to be discovered
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
        />

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-3/4" />
                  <div className="h-3 bg-slate-100 rounded w-1/2" />
                  <div className="h-3 bg-slate-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Heart size={48} className="text-slate-300 mx-auto mb-4" />
            <p className="font-heading text-xl text-slate-400">
              No destinations match your filters. Try a different combination!
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((d, i) => (
              <div key={d.id} className="animate-slide-up" style={{ animationDelay: `${i * 50}ms` }}>
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
