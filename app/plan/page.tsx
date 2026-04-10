"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";
import ChatMessage from "@/components/chat/ChatMessage";
import ChatStreamingIndicator from "@/components/chat/ChatStreamingIndicator";
import { createClient } from "@/lib/supabase";
import { usePlanChat } from "@/lib/chat/use-plan-chat";
import { Sparkles, Send, Compass, Heart, Plane, MapPin, RotateCcw, Loader2 } from "lucide-react";

const HERO_PROMPTS = [
  { icon: Compass, text: "Plan 10 days in Japan for two", gradient: "from-sky-500 to-blue-600" },
  { icon: Heart, text: "Romantic getaway under $150 a day", gradient: "from-pink-500 to-rose-600" },
  { icon: Plane, text: "Hidden gems in Patagonia for adventurers", gradient: "from-emerald-500 to-teal-600" },
  { icon: MapPin, text: "Where should we honeymoon in November?", gradient: "from-violet-500 to-purple-600" },
];

const PLACEHOLDERS = [
  "Where will you go next?",
  "Tell me about your dream trip...",
  "What are you in the mood for?",
  "Describe the adventure you're craving...",
];

function PlanPageInner() {
  const searchParams = useSearchParams();
  const initialPrompt = searchParams.get("q") || "";

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState("");
  const [placeholder, setPlaceholder] = useState(PLACEHOLDERS[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, isStreaming, streamingLabel, sendMessage, resetChat } =
    usePlanChat();

  const supabase = createClient();

  useEffect(() => {
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
  }, []);

  useEffect(() => {
    async function load() {
      const {
        data: { user: u },
      } = await supabase.auth.getUser();
      setUser(u);

      if (u) {
        const { data: p } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", u.id)
          .single();
        setProfile(p);
      }
    }
    load();
  }, []);

  // Auto-send initial prompt from query param
  useEffect(() => {
    if (initialPrompt && user && messages.length === 0 && !isStreaming) {
      sendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, initialPrompt]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  // Auto-grow textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  const firstName = profile?.full_name?.split(" ")[0];
  const isEmpty = messages.length === 0;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      <Header
        user={user ? { email: user.email, full_name: profile?.full_name } : null}
        onSignOut={handleSignOut}
      />

      {/* Empty state hero */}
      {isEmpty ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-1/4 w-96 h-96 rounded-full bg-brand-sky-light/20 blur-3xl" />
            <div className="absolute bottom-20 right-1/4 w-96 h-96 rounded-full bg-brand-orange/10 blur-3xl" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, #0C4A6E 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }} />
          </div>

          <div className="relative max-w-3xl w-full text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-500 uppercase tracking-widest mb-8 shadow-soft">
              <Sparkles size={12} className="text-brand-orange" />
              AI Travel Concierge
            </div>

            {/* Headline */}
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-brand-ocean mb-5 tracking-tight leading-[0.95]">
              {firstName ? `Hi ${firstName},` : "Hello,"}
              <br />
              <span className="italic text-brand-sky">where will you go next?</span>
            </h1>

            <p className="font-heading text-lg md:text-xl italic text-slate-500 max-w-xl mx-auto mb-10">
              Tell me what you're dreaming of. I'll build you an itinerary worth remembering.
            </p>

            {/* Hero input */}
            <div className="relative max-w-2xl mx-auto mb-10">
              <div className="relative bg-white rounded-3xl shadow-soft-xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl focus-within:shadow-2xl focus-within:border-brand-sky/30">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={placeholder}
                  rows={1}
                  disabled={isStreaming}
                  className="w-full resize-none px-6 py-5 pr-20 bg-transparent text-lg text-brand-ocean placeholder:text-slate-400 placeholder:font-heading placeholder:italic focus:outline-none scrollbar-thin"
                />
                <button
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  className="absolute right-3 bottom-3 w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 text-white shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 cursor-pointer"
                  aria-label="Send"
                >
                  {isStreaming ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Send size={18} strokeWidth={2} />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 font-medium">
                Press <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-mono">Shift+Enter</kbd> for new line
              </p>
            </div>

            {/* Suggested prompts */}
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">
                Or try one of these
              </p>
              <div className="grid sm:grid-cols-2 gap-3 max-w-2xl mx-auto">
                {HERO_PROMPTS.map((p) => (
                  <button
                    key={p.text}
                    onClick={() => sendMessage(p.text)}
                    disabled={isStreaming}
                    className="flex items-center gap-3 px-4 py-3.5 bg-white border border-slate-100 rounded-2xl text-left text-sm font-medium text-slate-700 hover:border-brand-sky-light hover:shadow-soft-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center flex-shrink-0 shadow-soft group-hover:scale-110 transition-transform duration-200`}>
                      <p.icon size={16} className="text-white" strokeWidth={1.8} />
                    </div>
                    <span className="flex-1">{p.text}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Conversation view */
        <div className="flex-1 flex flex-col">
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
              {/* Header bar inside conversation */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center shadow-soft">
                    <Sparkles size={18} className="text-white" strokeWidth={1.8} />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-brand-ocean leading-tight">
                      Travel Concierge
                    </h2>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Planning your adventure
                    </p>
                  </div>
                </div>
                <button
                  onClick={resetChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-brand-ocean hover:bg-white transition-all duration-200 cursor-pointer"
                  aria-label="New conversation"
                >
                  <RotateCcw size={12} />
                  New Chat
                </button>
              </div>

              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}

              {isStreaming && messages[messages.length - 1]?.role === "user" && (
                <ChatStreamingIndicator label={streamingLabel || "Thinking..."} />
              )}

              <div ref={bottomRef} />
            </div>
          </div>

          {/* Sticky input at bottom */}
          <div className="sticky bottom-0 border-t border-slate-100 bg-white/80 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
              <div className="relative bg-white rounded-2xl border border-slate-200 shadow-soft focus-within:border-brand-sky focus-within:shadow-soft-md transition-all duration-200">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a follow-up..."
                  rows={1}
                  disabled={isStreaming}
                  className="w-full resize-none px-4 py-3.5 pr-14 bg-transparent text-sm text-brand-ocean placeholder:text-slate-400 focus:outline-none scrollbar-thin"
                />
                <button
                  onClick={handleSend}
                  disabled={isStreaming || !input.trim()}
                  className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-brand-sky to-brand-sky-dark text-white shadow-soft hover:shadow-soft-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
                  aria-label="Send"
                >
                  {isStreaming ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Send size={14} strokeWidth={2} />
                  )}
                </button>
              </div>
              <p className="text-[10px] text-slate-400 mt-2 text-center font-medium">
                Powered by Claude — your AI travel concierge
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PlanPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-bg" />}>
      <PlanPageInner />
    </Suspense>
  );
}
