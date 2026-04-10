"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Loader2 } from "lucide-react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  isStreaming?: boolean;
}

const placeholders = [
  "Plan my dream trip to Japan...",
  "What should we do in Bali for 5 days?",
  "Somewhere romantic under $100/day...",
  "Best hidden gems in Patagonia?",
  "Build me a 10-day Italy itinerary...",
  "Where should we honeymoon in November?",
];

export default function ChatInput({ onSend, disabled, isStreaming }: Props) {
  const [value, setValue] = useState("");
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    setPlaceholder(placeholders[Math.floor(Math.random() * placeholders.length)]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-slate-100 bg-white/80 backdrop-blur-xl p-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            rows={1}
            disabled={disabled}
            className="w-full resize-none px-4 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-brand-ocean placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-sky/30 focus:border-brand-sky transition-all duration-200 scrollbar-thin"
          />
        </div>
        <button
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="w-11 h-11 flex items-center justify-center rounded-2xl bg-gradient-to-br from-brand-sky to-brand-sky-dark text-white shadow-soft hover:shadow-soft-md disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
          aria-label="Send message"
        >
          {isStreaming ? (
            <Loader2 size={18} className="animate-spin" />
          ) : (
            <Send size={16} strokeWidth={2} />
          )}
        </button>
      </div>
      <p className="text-[10px] text-slate-400 mt-2 text-center">
        Powered by Claude — your AI travel concierge
      </p>
    </div>
  );
}
