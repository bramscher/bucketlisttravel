"use client";

import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase";
import ChatDrawer from "./ChatDrawer";

export default function ChatFAB() {
  const [open, setOpen] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const supa = createClient();

    supa.auth.getUser().then(({ data: { user } }) => {
      setAuthenticated(!!user);
    });

    const { data: sub } = supa.auth.onAuthStateChange((_, session) => {
      setAuthenticated(!!session?.user);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!authenticated) return null;

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[80] group flex items-center gap-2 pl-4 pr-5 py-3.5 bg-gradient-to-br from-brand-orange to-amber-600 text-white rounded-full shadow-xl shadow-orange-500/30 hover:shadow-2xl hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          aria-label="Open AI travel concierge"
        >
          <div className="relative">
            <Sparkles size={18} strokeWidth={2} />
            <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-pulse" />
          </div>
          <span className="font-semibold text-sm hidden sm:inline">
            Plan with AI
          </span>
        </button>
      )}

      <ChatDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
}
