"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";
import { createClient } from "@/lib/supabase";
import type { Destination } from "@/lib/types";
import { MOODS } from "@/lib/types";
import { Camera, Upload, ArrowLeft, Check, Image as ImageIcon } from "lucide-react";

const moodEmoji: Record<string, string> = {
  magical: "Magical",
  adventurous: "Adventurous",
  romantic: "Romantic",
  peaceful: "Peaceful",
  joyful: "Joyful",
  awestruck: "Awestruck",
};

export default function NewMemoryPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [date, setDate] = useState("");
  const [mood, setMood] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !title) return;
    setSaving(true);

    // Create memory
    const { data: memory, error } = await supabase
      .from("memories")
      .insert({
        user_id: user.id,
        title,
        story: story || null,
        date: date || null,
        mood: mood || null,
        destination_id: destinationId || null,
      })
      .select()
      .single();

    if (error || !memory) {
      setSaving(false);
      return;
    }

    // Upload photos
    for (let i = 0; i < photos.length; i++) {
      const file = photos[i];
      const ext = file.name.split(".").pop();
      const path = `${user.id}/${memory.id}/${i}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("travel-photos")
        .upload(path, file);

      if (!uploadError) {
        await supabase.from("memory_photos").insert({
          memory_id: memory.id,
          storage_path: path,
          sort_order: i,
        });
      }
    }

    router.push("/memories");
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      <Header user={user} onSignOut={handleSignOut} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-brand-sky mb-6 cursor-pointer transition-colors duration-200"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-sky to-brand-sky-light flex items-center justify-center">
            <Camera size={22} className="text-white" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-ocean">New Memory</h1>
            <p className="text-sm text-slate-400">Capture a moment you never want to forget</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Memory Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sunrise at Mount Batur"
              required
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-brand-ocean font-heading text-lg placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky"
            />
          </div>

          {/* Date & Destination */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky"
              />
            </div>
            <div>
              <label htmlFor="destination" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Destination
              </label>
              <select
                id="destination"
                value={destinationId}
                onChange={(e) => setDestinationId(e.target.value)}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm text-brand-ocean focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky cursor-pointer"
              >
                <option value="">Select destination</option>
                {destinations.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Mood */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              How did it feel?
            </label>
            <div className="flex flex-wrap gap-2">
              {MOODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMood(mood === m ? "" : m)}
                  className={`
                    px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer
                    ${mood === m
                      ? "bg-brand-sky text-white border-brand-sky"
                      : "bg-white text-slate-500 border-slate-200 hover:border-brand-sky-light"
                    }
                  `}
                >
                  {moodEmoji[m]}
                </button>
              ))}
            </div>
          </div>

          {/* Story */}
          <div>
            <label htmlFor="story" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Your Story
            </label>
            <textarea
              id="story"
              value={story}
              onChange={(e) => setStory(e.target.value)}
              placeholder="Describe the moment — what you saw, felt, tasted, heard..."
              rows={6}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm text-brand-ocean placeholder:text-slate-300 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky resize-y"
            />
          </div>

          {/* Photos */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Photos
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-sky-light transition-colors duration-200">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files) {
                    setPhotos(Array.from(e.target.files));
                  }
                }}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                {photos.length > 0 ? (
                  <div className="flex items-center justify-center gap-2 text-brand-sky">
                    <ImageIcon size={20} />
                    <span className="font-medium text-sm">
                      {photos.length} photo{photos.length > 1 ? "s" : ""} selected
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-400">
                      Click to upload photos from this memory
                    </p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || !title}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-orange hover:bg-brand-orange-dark disabled:opacity-50 text-white font-semibold rounded-xl text-lg transition-colors duration-200 cursor-pointer"
          >
            {saving ? (
              "Saving your memory..."
            ) : (
              <>
                <Check size={18} />
                Save Memory
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
