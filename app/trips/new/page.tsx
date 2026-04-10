"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase";
import type { Destination, ItineraryItem } from "@/lib/types";
import {
  Map,
  ArrowLeft,
  Check,
  Plus,
  X,
  Coffee,
  Sun,
  Moon,
  Utensils,
  Plane,
  Hotel,
  Palmtree,
} from "lucide-react";

const timeSlotIcons: Record<string, any> = {
  morning: Coffee,
  afternoon: Sun,
  evening: Moon,
};

const categoryConfig: Record<string, { icon: any; label: string; color: string }> = {
  activity: { icon: Palmtree, label: "Activity", color: "bg-blue-100 text-blue-600" },
  food: { icon: Utensils, label: "Food & Drink", color: "bg-pink-100 text-pink-600" },
  transport: { icon: Plane, label: "Transport", color: "bg-orange-100 text-orange-600" },
  accommodation: { icon: Hotel, label: "Stay", color: "bg-violet-100 text-violet-600" },
  free_time: { icon: Coffee, label: "Free Time", color: "bg-emerald-100 text-emerald-600" },
};

interface DayPlan {
  dayNumber: number;
  items: Partial<ItineraryItem>[];
}

export default function NewTripPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [days, setDays] = useState<DayPlan[]>([
    { dayNumber: 1, items: [] },
  ]);
  const [saving, setSaving] = useState(false);

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

      const { data: dests } = await supabase
        .from("destinations")
        .select("id, name, region")
        .order("name");
      if (dests) setDestinations(dests as Destination[]);
    }
    load();
  }, []);

  const addDay = () => {
    setDays((prev) => [...prev, { dayNumber: prev.length + 1, items: [] }]);
  };

  const addItem = (dayIndex: number) => {
    setDays((prev) =>
      prev.map((d, i) =>
        i === dayIndex
          ? {
              ...d,
              items: [
                ...d.items,
                {
                  title: "",
                  time_slot: "morning",
                  category: "activity",
                  description: "",
                  estimated_cost: undefined,
                },
              ],
            }
          : d
      )
    );
  };

  const updateItem = (dayIndex: number, itemIndex: number, field: string, value: any) => {
    setDays((prev) =>
      prev.map((d, di) =>
        di === dayIndex
          ? {
              ...d,
              items: d.items.map((item, ii) =>
                ii === itemIndex ? { ...item, [field]: value } : item
              ),
            }
          : d
      )
    );
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    setDays((prev) =>
      prev.map((d, di) =>
        di === dayIndex
          ? { ...d, items: d.items.filter((_, ii) => ii !== itemIndex) }
          : d
      )
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;
    setSaving(true);

    // Create trip
    const { data: trip, error } = await supabase
      .from("trips")
      .insert({
        user_id: user.id,
        title,
        description: description || null,
        destination_id: destinationId || null,
        start_date: startDate || null,
        end_date: endDate || null,
        total_budget: totalBudget ? parseFloat(totalBudget) : null,
        status: "planning",
      })
      .select()
      .single();

    if (error || !trip) {
      setSaving(false);
      return;
    }

    // Create itinerary items
    const allItems = days.flatMap((day) =>
      day.items
        .filter((item) => item.title)
        .map((item, idx) => ({
          trip_id: trip.id,
          day_number: day.dayNumber,
          time_slot: item.time_slot || null,
          title: item.title!,
          description: item.description || null,
          category: item.category || "activity",
          estimated_cost: item.estimated_cost || null,
          sort_order: idx,
        }))
    );

    if (allItems.length > 0) {
      await supabase.from("itinerary_items").insert(allItems);
    }

    router.push("/dashboard");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-brand-sky mb-6 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-orange to-orange-400 flex items-center justify-center">
            <Map size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-ocean">Plan a New Trip</h1>
            <p className="text-sm text-slate-400">Build your day-by-day adventure</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/60">
            <h3 className="font-heading text-lg font-bold text-brand-ocean mb-4">Trip Details</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="trip-title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Trip Name
                </label>
                <input
                  id="trip-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Thailand Adventure 2026"
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky"
                />
              </div>

              <div>
                <label htmlFor="trip-desc" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Description
                </label>
                <textarea
                  id="trip-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What's this trip about?"
                  rows={2}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky resize-y"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="trip-dest" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Destination
                  </label>
                  <select
                    id="trip-dest"
                    value={destinationId}
                    onChange={(e) => setDestinationId(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean focus:outline-none focus:ring-2 focus:ring-brand-sky/30 cursor-pointer"
                  >
                    <option value="">Select</option>
                    {destinations.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="start" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    Start Date
                  </label>
                  <input
                    id="start"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  />
                </div>
                <div>
                  <label htmlFor="end" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                    End Date
                  </label>
                  <input
                    id="end"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="budget" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">
                  Total Budget (USD)
                </label>
                <input
                  id="budget"
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/30"
                />
              </div>
            </div>
          </div>

          {/* Day-by-Day Itinerary */}
          <div>
            <h3 className="font-heading text-lg font-bold text-brand-ocean mb-4">
              Day-by-Day Itinerary
            </h3>

            <div className="space-y-4">
              {days.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden"
                >
                  <div className="px-6 py-4 bg-brand-bg/50 border-b border-slate-200/60">
                    <h4 className="font-heading text-lg font-bold text-brand-ocean">
                      Day {day.dayNumber}
                    </h4>
                  </div>

                  <div className="p-4 space-y-3">
                    {day.items.map((item, itemIndex) => {
                      const cat = categoryConfig[item.category || "activity"];
                      return (
                        <div
                          key={itemIndex}
                          className="flex gap-3 items-start p-3 bg-brand-bg/30 rounded-xl"
                        >
                          <div className="flex flex-col gap-2 flex-1">
                            <div className="flex gap-2">
                              <select
                                value={item.time_slot || "morning"}
                                onChange={(e) =>
                                  updateItem(dayIndex, itemIndex, "time_slot", e.target.value)
                                }
                                className="px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 cursor-pointer"
                              >
                                <option value="morning">Morning</option>
                                <option value="afternoon">Afternoon</option>
                                <option value="evening">Evening</option>
                              </select>
                              <select
                                value={item.category || "activity"}
                                onChange={(e) =>
                                  updateItem(dayIndex, itemIndex, "category", e.target.value)
                                }
                                className={`px-2.5 py-1.5 border-0 rounded-lg text-xs font-semibold cursor-pointer ${cat.color}`}
                              >
                                {Object.entries(categoryConfig).map(([key, cfg]) => (
                                  <option key={key} value={key}>
                                    {cfg.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <input
                              type="text"
                              value={item.title || ""}
                              onChange={(e) =>
                                updateItem(dayIndex, itemIndex, "title", e.target.value)
                              }
                              placeholder="What's the plan?"
                              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-brand-ocean placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                            />
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={item.description || ""}
                                onChange={(e) =>
                                  updateItem(dayIndex, itemIndex, "description", e.target.value)
                                }
                                placeholder="Notes (optional)"
                                className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                              />
                              <input
                                type="number"
                                value={item.estimated_cost || ""}
                                onChange={(e) =>
                                  updateItem(
                                    dayIndex,
                                    itemIndex,
                                    "estimated_cost",
                                    e.target.value ? parseFloat(e.target.value) : undefined
                                  )
                                }
                                placeholder="$ Cost"
                                className="w-24 px-3 py-1.5 border border-slate-200 rounded-lg text-xs text-slate-500 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/20"
                              />
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(dayIndex, itemIndex)}
                            className="p-1.5 text-slate-300 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                            aria-label="Remove item"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => addItem(dayIndex)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-slate-200 rounded-xl text-sm font-medium text-slate-400 hover:text-brand-sky hover:border-brand-sky-light transition-all duration-200 cursor-pointer"
                    >
                      <Plus size={15} />
                      Add Activity
                    </button>
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={addDay}
                className="w-full flex items-center justify-center gap-2 py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-sm font-semibold text-slate-400 hover:text-brand-sky hover:border-brand-sky-light transition-all duration-200 cursor-pointer"
              >
                <Plus size={16} />
                Add Day {days.length + 1}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !title}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-lg transition-colors duration-200 cursor-pointer"
          >
            {saving ? (
              "Creating your trip..."
            ) : (
              <>
                <Check size={18} />
                Create Trip
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
