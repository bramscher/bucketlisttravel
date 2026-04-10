import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { buildSystemPrompt } from "@/lib/chat/system-prompt";
import { chatTools } from "@/lib/chat/tools";
import { executeTool } from "@/lib/chat/tool-handlers";
import type { ChatRequest, ChatSSEEvent } from "@/lib/chat/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-4-5"; // Upgrade to claude-sonnet-4-6 when available in API

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ChatRequest;
  const { conversation_id, message, destination_id } = body;

  if (!message?.trim()) {
    return new Response(JSON.stringify({ error: "Message required" }), {
      status: 400,
    });
  }

  const supa = createServerSupabaseClient();
  const {
    data: { user },
  } = await supa.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  // Load or create conversation
  let convId = conversation_id;
  if (!convId) {
    const { data: newConv, error: convErr } = await supa
      .from("chat_conversations")
      .insert({
        user_id: user.id,
        destination_id: destination_id || null,
        title: message.slice(0, 80),
      })
      .select()
      .single();

    if (convErr || !newConv) {
      return new Response(
        JSON.stringify({ error: convErr?.message || "Failed to create conversation" }),
        { status: 500 }
      );
    }
    convId = newConv.id;
  }

  // Load conversation history
  const { data: historyData } = await supa
    .from("chat_messages")
    .select("*")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });

  // Build context for system prompt
  const [profileRes, destinationsRes, bucketListRes, tripsRes, currentDestRes] =
    await Promise.all([
      supa.from("profiles").select("full_name, email").eq("id", user.id).single(),
      supa.from("destinations").select("*").order("name"),
      supa
        .from("bucket_list")
        .select("*, destination:destinations(*)")
        .eq("user_id", user.id),
      supa
        .from("trips")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5),
      destination_id
        ? supa.from("destinations").select("*").eq("id", destination_id).single()
        : Promise.resolve({ data: null }),
    ]);

  const systemPrompt = buildSystemPrompt({
    userName: profileRes.data?.full_name,
    bucketList: bucketListRes.data || [],
    recentTrips: tripsRes.data || [],
    allDestinations: destinationsRes.data || [],
    currentDestination: currentDestRes.data,
  });

  // Build messages array from history + new user message
  const messages: Anthropic.MessageParam[] = [];
  for (const m of historyData || []) {
    if (m.role === "user") {
      messages.push({ role: "user", content: m.content });
    } else if (m.role === "assistant") {
      // If this message had tool calls, reconstruct as content blocks
      if (m.tool_calls && Array.isArray(m.tool_calls) && m.tool_calls.length > 0) {
        const blocks: Anthropic.ContentBlockParam[] = [];
        if (m.content) blocks.push({ type: "text", text: m.content });
        for (const tc of m.tool_calls) {
          blocks.push({
            type: "tool_use",
            id: tc.id,
            name: tc.name,
            input: tc.input,
          });
        }
        messages.push({ role: "assistant", content: blocks });
        // Follow-up user message with tool results
        if (m.tool_results && Array.isArray(m.tool_results)) {
          messages.push({
            role: "user",
            content: m.tool_results.map((tr: any) => ({
              type: "tool_result" as const,
              tool_use_id: tr.tool_use_id,
              content: JSON.stringify(tr.content),
            })),
          });
        }
      } else {
        messages.push({ role: "assistant", content: m.content });
      }
    }
  }
  messages.push({ role: "user", content: message });

  // Save user message
  await supa.from("chat_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: ChatSSEEvent) => {
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
        );
      };

      try {
        // Send conversation_id so client can track it
        sendEvent({ type: "conversation", conversation_id: convId! });

        let keepLooping = true;
        let loopCount = 0;
        let accumulatedText = "";
        let accumulatedToolCalls: any[] = [];
        let accumulatedToolResults: any[] = [];

        while (keepLooping && loopCount < 5) {
          loopCount++;

          const response = await anthropic.messages.create({
            model: MODEL,
            max_tokens: 4096,
            system: systemPrompt,
            messages,
            tools: chatTools,
            stream: true,
          });

          const currentTextBlocks: string[] = [];
          const currentToolUses: Array<{
            id: string;
            name: string;
            input: string;
          }> = [];

          for await (const chunk of response) {
            if (chunk.type === "content_block_start") {
              if (chunk.content_block.type === "tool_use") {
                currentToolUses.push({
                  id: chunk.content_block.id,
                  name: chunk.content_block.name,
                  input: "",
                });
                sendEvent({
                  type: "tool_call",
                  name: chunk.content_block.name,
                  input: {},
                });
              }
            } else if (chunk.type === "content_block_delta") {
              if (chunk.delta.type === "text_delta") {
                const current = currentTextBlocks[currentTextBlocks.length - 1] || "";
                if (currentTextBlocks.length === 0) currentTextBlocks.push("");
                currentTextBlocks[currentTextBlocks.length - 1] =
                  current + chunk.delta.text;
                sendEvent({ type: "text", delta: chunk.delta.text });
              } else if (chunk.delta.type === "input_json_delta") {
                if (currentToolUses.length > 0) {
                  currentToolUses[currentToolUses.length - 1].input +=
                    chunk.delta.partial_json;
                }
              }
            } else if (chunk.type === "content_block_stop") {
              // End of a block — if it was text, start a new slot for next text
              if (
                currentTextBlocks.length > 0 &&
                currentTextBlocks[currentTextBlocks.length - 1]
              ) {
                currentTextBlocks.push("");
              }
            } else if (chunk.type === "message_delta") {
              if (chunk.delta.stop_reason === "end_turn") {
                keepLooping = false;
              } else if (chunk.delta.stop_reason === "tool_use") {
                // Will continue loop after executing tools
              }
            }
          }

          const fullText = currentTextBlocks.join("").trim();
          if (fullText) accumulatedText += (accumulatedText ? "\n" : "") + fullText;

          // Execute tools if any
          if (currentToolUses.length > 0) {
            const assistantBlocks: Anthropic.ContentBlockParam[] = [];
            if (fullText) assistantBlocks.push({ type: "text", text: fullText });

            const toolResults: Anthropic.ToolResultBlockParam[] = [];

            for (const tu of currentToolUses) {
              let parsedInput: any = {};
              try {
                parsedInput = tu.input ? JSON.parse(tu.input) : {};
              } catch {
                parsedInput = {};
              }

              assistantBlocks.push({
                type: "tool_use",
                id: tu.id,
                name: tu.name,
                input: parsedInput,
              });

              accumulatedToolCalls.push({
                id: tu.id,
                name: tu.name,
                input: parsedInput,
              });

              const result = await executeTool(supa, user.id, tu.name, parsedInput);

              accumulatedToolResults.push({
                tool_use_id: tu.id,
                content: result,
              });

              sendEvent({
                type: "tool_result",
                name: tu.name,
                result,
              });

              toolResults.push({
                type: "tool_result",
                tool_use_id: tu.id,
                content: JSON.stringify(result),
              });

              // If save_trip succeeded, link trip to conversation
              if (tu.name === "save_trip" && result?.trip_id) {
                await supa
                  .from("chat_conversations")
                  .update({ trip_id: result.trip_id, updated_at: new Date().toISOString() })
                  .eq("id", convId!);
              }
            }

            messages.push({ role: "assistant", content: assistantBlocks });
            messages.push({ role: "user", content: toolResults });
          } else {
            keepLooping = false;
          }
        }

        // Persist assistant message
        await supa.from("chat_messages").insert({
          conversation_id: convId,
          role: "assistant",
          content: accumulatedText,
          tool_calls: accumulatedToolCalls.length > 0 ? accumulatedToolCalls : null,
          tool_results:
            accumulatedToolResults.length > 0 ? accumulatedToolResults : null,
        });

        // Update conversation timestamp
        await supa
          .from("chat_conversations")
          .update({ updated_at: new Date().toISOString() })
          .eq("id", convId!);

        sendEvent({ type: "done" });
      } catch (err: any) {
        console.error("Chat API error:", err);
        sendEvent({
          type: "error",
          error: err?.message || "Something went wrong",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
