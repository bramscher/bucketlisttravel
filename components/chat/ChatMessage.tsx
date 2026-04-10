"use client";

import { Sparkles } from "lucide-react";
import ChatToolResult from "./ChatToolResult";
import type { UIMessage } from "@/lib/chat/types";

interface Props {
  message: UIMessage;
}

// Simple markdown renderer: bold, line breaks, headers, lists
function renderContent(text: string) {
  const lines = text.split("\n");
  return lines.map((line, i) => {
    // Headers
    if (line.startsWith("### ")) {
      return (
        <h4 key={i} className="font-heading text-base font-bold text-brand-ocean mt-3 mb-1">
          {line.slice(4)}
        </h4>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="font-heading text-lg font-bold text-brand-ocean mt-3 mb-1">
          {line.slice(3)}
        </h3>
      );
    }
    // Bullet list
    if (line.match(/^[-*]\s/)) {
      return (
        <div key={i} className="flex gap-2 ml-1 my-0.5">
          <span className="text-brand-sky flex-shrink-0">•</span>
          <span>{renderInline(line.slice(2))}</span>
        </div>
      );
    }
    // Empty line = paragraph break
    if (line.trim() === "") return <div key={i} className="h-2" />;
    // Regular paragraph
    return (
      <p key={i} className="my-0.5 leading-relaxed">
        {renderInline(line)}
      </p>
    );
  });
}

function renderInline(text: string) {
  // Handle **bold**
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-brand-ocean">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatMessage({ message }: Props) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end animate-slide-up">
        <div className="max-w-[85%] px-4 py-3 bg-gradient-to-br from-brand-sky to-brand-sky-dark text-white rounded-3xl rounded-tr-md text-sm leading-relaxed shadow-soft">
          {message.content}
        </div>
      </div>
    );
  }

  // Assistant message
  return (
    <div className="flex gap-2.5 animate-slide-up">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-amber-600 flex items-center justify-center shadow-soft">
        <Sparkles size={14} className="text-white" strokeWidth={2} />
      </div>
      <div className="max-w-[85%] min-w-0 flex-1">
        <div className="px-4 py-3 bg-white border border-slate-100 rounded-3xl rounded-tl-md text-sm text-slate-700 shadow-soft">
          {message.content ? (
            <div className="space-y-0">{renderContent(message.content)}</div>
          ) : (
            <span className="text-slate-400 italic">Thinking...</span>
          )}
          {message.isStreaming && (
            <span className="inline-block w-1.5 h-3.5 bg-brand-sky ml-0.5 animate-pulse rounded-sm" />
          )}
        </div>
        {message.toolResults?.map((tr, i) => (
          <ChatToolResult key={i} name={tr.name} result={tr.result} />
        ))}
      </div>
    </div>
  );
}
