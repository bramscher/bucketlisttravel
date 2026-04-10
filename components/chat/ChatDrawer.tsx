"use client";

import { useState, useCallback, useRef } from "react";
import { X, Sparkles } from "lucide-react";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import type { UIMessage, ChatSSEEvent } from "@/lib/chat/types";

interface Props {
  open: boolean;
  onClose: () => void;
  destinationId?: string;
}

export default function ChatDrawer({ open, onClose, destinationId }: Props) {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingLabel, setStreamingLabel] = useState<string>();
  const conversationIdRef = useRef<string | undefined>(undefined);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const userMsg: UIMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        content,
      };
      const assistantMsg: UIMessage = {
        id: `a-${Date.now()}`,
        role: "assistant",
        content: "",
        isStreaming: true,
        toolResults: [],
      };

      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setIsStreaming(true);
      setStreamingLabel("Planning your trip...");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversation_id: conversationIdRef.current,
            message: content,
            destination_id: destinationId,
          }),
        });

        if (!res.ok || !res.body) {
          throw new Error(`Request failed: ${res.status}`);
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const jsonStr = line.slice(6);
            if (!jsonStr.trim()) continue;

            try {
              const event: ChatSSEEvent = JSON.parse(jsonStr);
              handleEvent(event, assistantMsg.id);
            } catch (e) {
              console.error("Failed to parse SSE event:", e);
            }
          }
        }
      } catch (err: any) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsg.id
              ? {
                  ...m,
                  content: `Sorry, something went wrong: ${err.message}`,
                  isStreaming: false,
                }
              : m
          )
        );
      } finally {
        setIsStreaming(false);
        setStreamingLabel(undefined);
      }
    },
    [isStreaming, destinationId]
  );

  const handleEvent = (event: ChatSSEEvent, assistantMsgId: string) => {
    switch (event.type) {
      case "conversation":
        conversationIdRef.current = event.conversation_id;
        break;

      case "text":
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? { ...m, content: m.content + event.delta }
              : m
          )
        );
        break;

      case "tool_call":
        setStreamingLabel(
          event.name === "save_trip"
            ? "Saving your trip..."
            : event.name === "search_destinations"
            ? "Searching destinations..."
            : event.name === "get_user_context"
            ? "Checking your profile..."
            : event.name === "get_destination_details"
            ? "Looking up details..."
            : "Working..."
        );
        break;

      case "tool_result":
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  toolResults: [
                    ...(m.toolResults || []),
                    { name: event.name, result: event.result },
                  ],
                }
              : m
          )
        );
        setStreamingLabel("Crafting the perfect response...");
        break;

      case "done":
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, isStreaming: false } : m
          )
        );
        break;

      case "error":
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId
              ? {
                  ...m,
                  content: m.content || `Error: ${event.error}`,
                  isStreaming: false,
                }
              : m
          )
        );
        break;
    }
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-[90] bg-brand-ocean/30 backdrop-blur-sm animate-fade-in"
        />
      )}

      {/* Drawer */}
      <div
        className={`
          fixed top-0 right-0 bottom-0 z-[100] w-full sm:w-[460px] bg-brand-bg
          shadow-2xl flex flex-col
          transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="relative flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white/80 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center shadow-soft">
              <Sparkles size={18} className="text-white" strokeWidth={1.8} />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-brand-ocean leading-tight">
                Travel Concierge
              </h3>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                AI Trip Planner
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-400 hover:text-brand-ocean hover:bg-slate-100 transition-all duration-200 cursor-pointer"
            aria-label="Close chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <ChatMessages
          messages={messages}
          isStreaming={isStreaming}
          streamingLabel={streamingLabel}
          onPromptClick={sendMessage}
        />

        {/* Input */}
        <ChatInput
          onSend={sendMessage}
          disabled={isStreaming}
          isStreaming={isStreaming}
        />
      </div>
    </>
  );
}
