// ─── Chat Types ───

export type ChatRole = "user" | "assistant" | "system";

export interface ChatConversation {
  id: string;
  user_id: string;
  title: string | null;
  destination_id: string | null;
  trip_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  conversation_id: string;
  role: ChatRole;
  content: string;
  tool_calls: ToolCall[] | null;
  tool_results: ToolResult[] | null;
  metadata: Record<string, any>;
  created_at: string;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, any>;
}

export interface ToolResult {
  tool_use_id: string;
  content: any;
  is_error?: boolean;
}

// Request from client to /api/chat
export interface ChatRequest {
  conversation_id?: string;
  message: string;
  destination_id?: string;
}

// SSE event types streamed back to the client
export type ChatSSEEvent =
  | { type: "conversation"; conversation_id: string }
  | { type: "text"; delta: string }
  | { type: "tool_call"; name: string; input: Record<string, any> }
  | { type: "tool_result"; name: string; result: any }
  | { type: "done"; message_id?: string }
  | { type: "error"; error: string };

// In-memory message shape for UI state
export interface UIMessage {
  id: string;
  role: ChatRole;
  content: string;
  toolCalls?: { name: string; input: any }[];
  toolResults?: { name: string; result: any }[];
  isStreaming?: boolean;
}
