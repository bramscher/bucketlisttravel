"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Compass, Heart, Camera, Map, ArrowRight, Sparkles, MapPin, Users, Send } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleAsk = (text?: string) => {
    const q = (text || query).trim();
    if (!q) return;
    router.push(`/plan?q=${encodeURIComponent(q)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero with AI concierge */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ocean via-brand-sky-dark to-brand-sky" />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }} />

        {/* Decorative blurs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-brand-sky-light/20 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-brand-orange/10 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-xs font-semibold text-white/80 uppercase tracking-widest mb-8">
              <Sparkles size={12} className="text-amber-300" />
              AI Travel Concierge · 60 destinations
            </div>

            <h1 className="font-heading text-5xl sm:text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight leading-[0.95]">
              Where will you
              <br />
              <span className="italic text-brand-sky-light">go next?</span>
            </h1>

            <p className="font-heading text-xl md:text-2xl italic text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
              Tell me about your dream trip. I'll craft an itinerary worth remembering.
            </p>

            {/* AI Input */}
            <div className="max-w-2xl mx-auto mb-8">
              <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl focus-within:ring-4 focus-within:ring-white/20">
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Plan 10 days in Japan for two..."
                  rows={1}
                  className="w-full resize-none px-6 py-5 pr-20 bg-transparent text-lg text-brand-ocean placeholder:text-slate-400 placeholder:font-heading placeholder:italic focus:outline-none"
                />
                <button
                  onClick={() => handleAsk()}
                  disabled={!query.trim()}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 cursor-pointer"
                  aria-label="Ask concierge"
                >
                  <Send size={18} strokeWidth={2} />
                </button>
              </div>
            </div>

            {/* Quick prompts */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
              {[
                "Romantic getaway under $150/day",
                "Hidden gems in Patagonia",
                "Best honeymoon for November",
              ].map((p) => (
                <button
                  key={p}
                  onClick={() => handleAsk(p)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur rounded-full text-xs font-medium text-white/90 transition-all duration-200 cursor-pointer"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/auth/signup" className="btn-cta">
                Start Your Journey
                <ArrowRight size={20} />
              </Link>
              <Link href="/explore" className="btn-ghost text-lg">
                Browse 60 Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="section-heading mb-3">
            Your Complete Travel Companion
          </h2>
          <p className="section-subheading">
            Everything you need to dream, plan, and remember
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              icon: Sparkles,
              title: "AI Concierge",
              desc: "Talk to a travel expert that knows 60 destinations intimately and builds day-by-day itineraries on the fly.",
              gradient: "from-orange-500 to-amber-600",
            },
            {
              icon: Compass,
              title: "Discover",
              desc: "Explore curated destinations rated by cost, safety, and long-stay potential. Filter by region or vibe.",
              gradient: "from-sky-500 to-blue-600",
            },
            {
              icon: Heart,
              title: "Bucket List",
              desc: "Save dream destinations, track your journey from dreaming to visited, and share with your partner.",
              gradient: "from-pink-500 to-rose-600",
            },
            {
              icon: Camera,
              title: "Memories",
              desc: "Create beautiful travel journals with photos and stories. Relive your favorite moments forever.",
              gradient: "from-violet-500 to-purple-600",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-3xl p-7 border border-slate-100 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.gradient} flex items-center justify-center mb-5 shadow-soft group-hover:scale-105 transition-transform duration-300`}>
                <f.icon size={22} className="text-white" strokeWidth={1.8} />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-ocean mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-slate-100">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-3 gap-8 text-center">
          {[
            { icon: MapPin, value: "60+", label: "Destinations" },
            { icon: Globe, value: "12", label: "Regions" },
            { icon: Users, value: "2", label: "Built for Couples" },
          ].map((s) => (
            <div key={s.label}>
              <s.icon size={24} className="text-brand-sky mx-auto mb-3" strokeWidth={1.5} />
              <div className="font-heading text-4xl font-bold text-brand-ocean mb-1">{s.value}</div>
              <div className="text-sm font-medium text-slate-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ocean via-brand-sky-dark to-brand-sky" />
        <div className="absolute top-10 right-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative max-w-3xl mx-auto px-6 py-20 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to start exploring?
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            Join couples around the world turning travel dreams into reality.
          </p>
          <Link href="/auth/signup" className="btn-cta">
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      <footer className="py-10 text-center">
        <p className="text-sm text-slate-400">Made with love for adventurous couples everywhere</p>
      </footer>
    </div>
  );
}
