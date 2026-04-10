import Link from "next/link";
import { Globe, Compass, Heart, Camera, Map, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-ocean via-brand-sky to-brand-sky-light" />
        <div className="absolute top-[-80px] right-[-80px] w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute bottom-[-60px] left-[-60px] w-48 h-48 rounded-full bg-white/5" />

        <div className="relative max-w-5xl mx-auto px-6 py-24 md:py-36 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Globe size={40} className="text-white/90" strokeWidth={1.5} />
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            Bucket List Travel
          </h1>
          <p className="font-heading text-xl md:text-2xl italic text-white/80 max-w-xl mx-auto mb-10">
            Plan unforgettable adventures together. Explore the world, build your bucket list, and preserve every memory.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/signup"
              className="flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold rounded-2xl text-lg transition-all duration-200 shadow-lg shadow-orange-500/25 cursor-pointer"
            >
              Start Your Journey
              <ArrowRight size={20} />
            </Link>
            <Link
              href="/explore"
              className="flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl text-lg backdrop-blur transition-all duration-200 cursor-pointer"
            >
              Explore Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-brand-ocean text-center mb-4">
          Your Complete Travel Companion
        </h2>
        <p className="font-heading text-lg italic text-slate-500 text-center mb-14 max-w-lg mx-auto">
          Built for couples who want to see the world together
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Compass,
              title: "Discover",
              desc: "Explore curated destinations rated by cost, safety, and long-stay potential. Filter by region or vibe.",
              color: "bg-sky-100 text-brand-sky",
            },
            {
              icon: Heart,
              title: "Bucket List",
              desc: "Save dream destinations, track your status from dreaming to visited, and share your list with your partner.",
              color: "bg-pink-100 text-pink-500",
            },
            {
              icon: Map,
              title: "Plan Trips",
              desc: "Build day-by-day itineraries with budgets, bookings, and logistics. Everything in one place.",
              color: "bg-orange-100 text-orange-500",
            },
            {
              icon: Camera,
              title: "Memories",
              desc: "Create beautiful travel journals with photos and stories. Relive your favorite moments forever.",
              color: "bg-violet-100 text-violet-500",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="bg-white rounded-2xl p-6 border border-slate-200/60 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon size={22} />
              </div>
              <h3 className="font-heading text-xl font-bold text-brand-ocean mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-brand-ocean to-brand-sky py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-heading text-3xl font-bold text-white mb-3">
            Ready to start exploring?
          </h2>
          <p className="text-white/70 mb-8">
            Join couples around the world who are turning travel dreams into reality.
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-brand-orange-dark text-white font-semibold rounded-2xl text-lg transition-all duration-200 cursor-pointer"
          >
            Create Free Account
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-slate-400">
        <p>Made with love for adventurous couples everywhere</p>
      </footer>
    </div>
  );
}
