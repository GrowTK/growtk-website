import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { brand } from "@/brand.config";
import { groowt } from "@/content/groowt";

export const runtime = "nodejs";

/**
 * Chat with Groowt, the mascot. Streams plain-text tokens from OpenAI with
 * Groowt's persona (content/groowt.ts) as the system prompt, grounded in
 * content/knowledge.md for every fact about Growtk. Uses OPENAI_API_KEY and
 * optionally OPENAI_MODEL from the env.
 *
 * Cheap guards, since this is a public endpoint that spends tokens: a short
 * history, a cap on message length, and a per-visitor rate limit.
 */

const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_MESSAGES = 12;
const MAX_CHARS = 600;
const MAX_REPLY_TOKENS = 350;

// Per-IP sliding window. In-memory, so it resets on deploy and is per
// instance, which is enough to stop a casual loop running up the bill.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

let knowledgeCache: string | null = null;
async function loadKnowledge() {
  if (knowledgeCache) return knowledgeCache;
  try {
    knowledgeCache = await readFile(join(process.cwd(), "content", "knowledge.md"), "utf8");
  } catch {
    knowledgeCache = "(No knowledge base found.)";
  }
  return knowledgeCache;
}

type Msg = { role: "user" | "assistant"; content: string };

function clean(input: unknown): Msg[] {
  if (!Array.isArray(input)) return [];
  return input
    .filter((m): m is Msg => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_CHARS) }))
    .filter((m) => m.content.trim().length > 0)
    .slice(-MAX_MESSAGES);
}

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ error: "offline" }, { status: 503 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
  if (limited(ip)) return Response.json({ error: "rate" }, { status: 429 });

  let messages: Msg[] = [];
  try {
    messages = clean((await req.json())?.messages);
  } catch {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }
  if (!messages.length || messages[messages.length - 1]!.role !== "user") {
    return Response.json({ error: "bad-request" }, { status: 400 });
  }

  const email = brand.contact.email;
  const system = [groowt.persona.replaceAll("{email}", email), "", "=== KNOWLEDGE BASE ===", await loadKnowledge()].join("\n");

  const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      stream: true,
      temperature: 0.7,
      max_tokens: MAX_REPLY_TOKENS,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  }).catch(() => null);

  if (!upstream?.ok || !upstream.body) {
    return Response.json({ error: "offline" }, { status: 502 });
  }

  // Re-stream OpenAI's SSE as plain text tokens.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  const body = upstream.body;
  const stream = new ReadableStream({
    async start(controller) {
      const reader = body.getReader();
      let buffer = "";
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const data = trimmed.slice(5).trim();
            if (data === "[DONE]") {
              controller.close();
              return;
            }
            try {
              const token = JSON.parse(data).choices?.[0]?.delta?.content;
              if (token) controller.enqueue(encoder.encode(token));
            } catch {
              // keep-alive or partial frame
            }
          }
        }
      } catch (err) {
        controller.error(err);
        return;
      }
      controller.close();
    },
  });

  return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" } });
}
