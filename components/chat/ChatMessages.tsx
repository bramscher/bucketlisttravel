"use client";

import { useEffect, useRef } from "react";
import { Sparkles, Compass, Heart, Plane } from "lucide-react";
import ChatMessage from "./ChatMessage";
import ChatStreamingIndicator from "./ChatStreamingIndicator";
import type { UIMessage } from "@/lib/chat/types";

interface Props {
  messages: UIMessage[];
  isStreaming: boolean;
  streamingLabel?: string;
  onPromptClick?: (prompt: string) => void;
}

const SUGGESTED_PROMPTS = [
  { icon: Compass, text: "Plan 10 days in Japan for two", color: "text-sky-500" },
  { icon: Heart, text: "Romantic getaway under $150/day", color: "text-pink-500" },
  { icon: Plane, text: "Best hidden gems in Patagonia", color: "text-emerald-500" },
  { icon: Sparkles, text: "Where should we honeymoon?", color: "text-violet-500" },
];

export default function ChatMessages({
  messages,
  isStreaming,
  streamingLabel,
  onPromptClick,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isStreaming]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center mb-4 shadow-soft-lg">
          <Sparkles size={26} className="text-white" strokeWidth={1.8} />
        </div>
        <h3 className="font-heading text-2xl font-bold text-brand-ocean mb-2">
          Your Travel Concierge
        </h3>
        <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed">
          Tell me where you want to go, or let me suggest something you'll love.
          I know 60 incredible places — and the secrets most travelers miss.
        </p>

        <div className="w-full max-w-sm space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
            Try asking
          </p>
          {SUGGESTED_PROMPTS.map((p) => (
            <button
              key={p.text}
              onClick={() => onPromptClick?.(p.text)}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white border border-slate-100 rounded-2xl text-left text-sm text-slate-700 hover:border-brand-sky-light hover:shadow-soft transition-all duration-200 cursor-pointer group"
            >
              <p.icon size={15} className={`${p.color} flex-shrink-0 group-hover:scale-110 transition-transform duration-200`} />
              <span className="flex-1">{p.text}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin px-4 py-6 space-y-5">
      {messages.map((m) => (
        <ChatMessage key={m.id} message={m} />
      ))}
      {isStreaming && messages[messages.length - 1]?.role === "user" && (
        <ChatStreamingIndicator label={streamingLabel || "Planning your trip..."} />
      )}
      <div ref={bottomRef} />
    </div>
  );
}
