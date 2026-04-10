"use client";

import { useState, useCallback, useRef } from "react";
import type { UIMessage, ChatSSEEvent } from "@/lib/chat/types";

interface UsePlanChatOptions {
  destinationId?: string;
  onTripSaved?: (tripId: string) => void;
}

export function usePlanChat(opts: UsePlanChatOptions = {}) {
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
            destination_id: opts.destinationId,
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
    [isStreaming, opts.destinationId]
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
        if (
          event.name === "save_trip" &&
          event.result?.trip_id &&
          opts.onTripSaved
        ) {
          opts.onTripSaved(event.result.trip_id);
        }
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

  const resetChat = useCallback(() => {
    setMessages([]);
    conversationIdRef.current = undefined;
  }, []);

  return {
    messages,
    isStreaming,
    streamingLabel,
    sendMessage,
    resetChat,
  };
}
