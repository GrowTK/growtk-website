"use client";

import * as React from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUp, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/brand.config";
import { handFont } from "@/lib/hand-font";
import { NoiseTexture } from "@/components/blocks/magicui/noise-texture";
import { groowt } from "@/content/groowt";
import { Groowt } from "@/components/mascot/groowt";
import { groowtStore, useGroowt } from "@/components/mascot/groowt-store";

/**
 * Chat with Groowt. Opens from any Groowt (corner bird, the big one on
 * /groowt) through the shared store. Printed-paper look to match him: a
 * cream sheet with grain, an ink border, and an off-register yellow block
 * behind it. His replies arrive as sticky notes; yours as ink. He thinks
 * (head tilt, eyes up) while waiting and works his beak while a reply
 * streams in, in the header and in the corner at once.
 *
 * Streams from /api/groowt. The conversation survives page navigation for
 * the session (sessionStorage), and is never sent anywhere but that route.
 */

const INK = "#2a2a2e";
const STORAGE_KEY = "groowt-chat-v1";
const MAX_CHARS = 600;
const CHIP_TINTS = ["#FFDE59", "#F2C4FF", "#FFBA7B", "#A8E6B8"];

type Msg = { id: number; role: "user" | "assistant"; content: string; error?: boolean };

let nextId = 1;
const msg = (role: Msg["role"], content: string, error?: boolean): Msg => ({ id: nextId++, role, content, error });

/** Only plain site paths: "/", "/services", "/industries/hvac", "/services#widgets". */
const SITE_PATH = /^\/[a-z0-9\-/]*(#[a-z0-9\-]+)?$/i;
const GO_TOKEN = /\{\{go:([^}\s]+)\}\}/;

/** Set by the panel so links inside messages can ask Groowt to fly there. */
let travel: (href: string) => void = () => {};

/** What to show while a reply streams: never the {{go:}} instruction, even half-typed. */
const visible = (text: string) => text.replace(/\{\{go:[^}]*\}\}/g, "").replace(/\{\{[^}]*$/, "").trimEnd();

/* ---------- a very small markdown: links to site paths, **bold**, "- " bullets ---------- */

function Inline({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      // Only site paths become links; anything else stays as text.
      // Only site paths become links, and clicking one has Groowt fly you there.
      const href = m[2];
      parts.push(
        SITE_PATH.test(href) ? (
          <a
            key={m.index}
            href={href}
            onClick={(e) => {
              e.preventDefault();
              travel(href);
            }}
            className="cursor-pointer font-semibold underline decoration-[#FF9F43] decoration-2 underline-offset-[3px] transition-colors hover:decoration-[#2a2a2e]"
          >
            {m[1]}
          </a>
        ) : (
          m[1]
        ),
      );
    } else if (m[3]) {
      parts.push(
        <strong key={m.index} className="font-semibold">
          {m[3]}
        </strong>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

function Markdown({ text }: { text: string }) {
  const blocks: React.ReactNode[] = [];
  let bullets: string[] = [];
  const flush = (key: number) => {
    if (!bullets.length) return;
    blocks.push(
      <ul key={`ul-${key}`} className="my-1 flex flex-col gap-1 pl-1">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-[0.55em] size-1.5 shrink-0 rounded-full bg-[#FF9F43]" />
            <span>
              <Inline text={b} />
            </span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };
  text.split("\n").forEach((line, i) => {
    const t = line.trim();
    if (/^[-*•]\s+/.test(t)) {
      bullets.push(t.replace(/^[-*•]\s+/, ""));
      return;
    }
    flush(i);
    if (t)
      blocks.push(
        <p key={i}>
          <Inline text={t} />
        </p>,
      );
  });
  flush(-1);
  return <div className="flex flex-col gap-2">{blocks}</div>;
}

/* ---------- pieces ---------- */

/** Three ink dots, bouncing, slightly wobbly: Groowt is thinking. */
function ThinkingDots() {
  const reduce = useReducedMotion();
  return (
    <span className="flex items-end gap-1.5 py-1" aria-label={groowt.chat.thinking}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="block size-2 rounded-full"
          style={{ background: INK, borderRadius: i === 1 ? "48% 52% 50% 50%" : "52% 48% 46% 54%" }}
          animate={reduce ? undefined : { y: [0, -5, 0] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.14, ease: "easeInOut" }}
        />
      ))}
    </span>
  );
}

function Bubble({ m, index, streaming }: { m: Msg; index: number; streaming: boolean }) {
  const reduce = useReducedMotion();
  const mine = m.role === "user";
  // Notes sit a touch crooked, alternating, like they were stuck on by hand.
  const tilt = mine ? 0 : index % 2 ? 0.6 : -0.5;
  return (
    <motion.li
      layout="position"
      initial={reduce ? false : { opacity: 0, y: 10, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
      className={cn("flex", mine ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "relative max-w-[86%] px-4 py-3 text-[14px] leading-relaxed",
          mine
            ? "rounded-[18px] rounded-br-[6px] bg-[#2a2a2e] text-white shadow-[3px_3px_0_0_#F2C4FF]"
            : cn("rounded-[18px] rounded-tl-[6px] border text-[#2a2a2e] shadow-[3px_3px_0_0_#FFE7A3]", m.error ? "border-[#c62b28]/40 bg-[#FFE4E4]" : "border-[#2a2a2e]/15 bg-[#FFFCEB]"),
        )}
        style={{ transform: `rotate(${tilt}deg)` }}
      >
        {!mine && <NoiseTexture frequency={0.9} octaves={3} slope={0.7} noiseOpacity={0.5} className="rounded-[inherit] opacity-30 mix-blend-multiply" />}
        <div className="relative">
          {mine ? <p className="whitespace-pre-wrap">{m.content}</p> : visible(m.content) ? <Markdown text={visible(m.content)} /> : <ThinkingDots />}
          {streaming && m.content && (
            <motion.span
              aria-hidden
              className="ml-0.5 inline-block h-[1.05em] w-[2px] translate-y-[3px] bg-[#2a2a2e]"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          )}
        </div>
      </div>
    </motion.li>
  );
}

/* ---------- the panel ---------- */

export function GroowtChat() {
  const { open, mood } = useGroowt();
  const reduce = useReducedMotion();
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [statusIndex, setStatusIndex] = React.useState(0);
  const listRef = React.useRef<HTMLOListElement>(null);
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const loaded = React.useRef(false);
  const copy = groowt.chat;
  const router = useRouter();
  const pathname = usePathname();

  // Fly the visitor to a page. Same page: just say so. On /groowt there's no corner
  // bird to fly (the big one is the page), so go straight there.
  travel = (href: string) => {
    if (!SITE_PATH.test(href)) return;
    if (href === pathname) {
      setMessages((prev) => [...prev, msg("assistant", groowt.travel.here)]);
      return;
    }
    setMessages((prev) => [...prev, msg("assistant", groowt.travel.going)]);
    if (pathname === "/groowt") {
      groowtStore.close();
      router.push(href);
    } else {
      groowtStore.travelTo(href);
    }
  };

  // Restore this session's conversation.
  React.useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]") as Msg[];
      if (Array.isArray(saved) && saved.length) {
        nextId = Math.max(...saved.map((m) => m.id)) + 1;
        setMessages(saved);
      }
    } catch {
      // storage blocked or corrupt: start fresh
    }
    loaded.current = true;
  }, []);

  React.useEffect(() => {
    if (!loaded.current || busy) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.filter((m) => !m.error)));
    } catch {
      // ignore
    }
  }, [messages, busy]);

  // Focus the box on open; Esc closes.
  React.useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 250);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && groowtStore.close();
    window.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Rotate the little status line while open.
  React.useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setStatusIndex((i) => (i + 1) % copy.statuses.length), 4000);
    return () => window.clearInterval(id);
  }, [open, copy.statuses.length]);

  // Keep the newest message in view.
  React.useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: reduce ? "auto" : "smooth" });
  }, [messages, open, reduce]);

  // Auto-grow the textarea up to four lines.
  React.useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  async function send(text: string) {
    const content = text.trim().slice(0, MAX_CHARS);
    if (!content || busy) return;
    const history = [...messages.filter((m) => !m.error), msg("user", content)];
    const reply = msg("assistant", "");
    setMessages([...history, reply]);
    setInput("");
    setBusy(true);
    groowtStore.setMood("thinking");

    const controller = new AbortController();
    abortRef.current = controller;
    const fail = (text: string) => setMessages((prev) => prev.map((m) => (m.id === reply.id ? { ...m, content: text, error: true } : m)));

    try {
      const res = await fetch("/api/groowt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        fail(res.status === 429 ? copy.tooFast : copy.offline.replaceAll("{email}", brand.contact.email));
        return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      let first = true;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        if (first && acc) {
          first = false;
          groowtStore.setMood("talking");
        }
        const snapshot = acc;
        setMessages((prev) => prev.map((m) => (m.id === reply.id ? { ...m, content: snapshot } : m)));
      }
      if (!acc.trim()) fail(copy.offline.replaceAll("{email}", brand.contact.email));
      // He was asked to take them somewhere: strip the instruction and fly.
      const go = acc.match(GO_TOKEN)?.[1];
      if (go) {
        const clean = visible(acc);
        setMessages((prev) => prev.map((m) => (m.id === reply.id ? { ...m, content: clean } : m)));
        if (SITE_PATH.test(go)) window.setTimeout(() => travel(go), 700);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") fail(copy.offline.replaceAll("{email}", brand.contact.email));
    } finally {
      setBusy(false);
      abortRef.current = null;
      groowtStore.setMood("idle");
    }
  }

  function reset() {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    groowtStore.setMood("idle");
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    inputRef.current?.focus();
  }

  const empty = messages.length === 0;
  const status = mood === "thinking" ? copy.thinking : mood === "talking" ? copy.talking : copy.statuses[statusIndex]!;
  const streamingId = busy ? messages[messages.length - 1]?.id : undefined;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="groowt-chat"
          role="dialog"
          aria-modal="false"
          aria-label={`Chat with ${groowt.name}`}
          initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.6, y: 40, rotate: 4 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 30, rotate: 3 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className={cn(
            handFont.variable,
            "fixed inset-x-2 top-16 bottom-2 z-[60] origin-bottom-right sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-[8.25rem] sm:h-[min(620px,calc(100dvh-10rem))] sm:w-[400px]",
          )}
        >
          {/* Off-register block behind the sheet: the same misprint as Groowt himself. */}
          <div aria-hidden className="absolute inset-0 translate-x-2 translate-y-2 overflow-hidden rounded-[28px] bg-[#FFDE59]">
            <NoiseTexture frequency={0.8} octaves={3} slope={0.7} noiseOpacity={0.6} className="opacity-40 mix-blend-multiply" />
          </div>

          <div className="relative flex h-full flex-col overflow-hidden rounded-[28px] border border-[#2a2a2e]/15 bg-white shadow-[0_24px_60px_rgba(0,0,0,.18)]">

            {/* Header */}
            <div className="relative flex items-center gap-3 px-4 pt-3.5">
              <div className="-mb-1 shrink-0">
                <Groowt variant="avatar" size={58} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[30px] leading-none font-bold text-[#2a2a2e]" style={{ fontFamily: "var(--font-hand), cursive" }}>
                  {copy.title}
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-[12px] text-[#2a2a2e]/70" aria-live="polite">
                  <span className={cn("size-2 rounded-full", mood === "idle" ? "bg-emerald-500" : "bg-[#FF9F43]")} />
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.span key={status} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.2 }}>
                      {status}
                    </motion.span>
                  </AnimatePresence>
                </p>
              </div>
              <button
                type="button"
                onClick={reset}
                disabled={empty && !busy}
                aria-label={copy.reset}
                title={copy.reset}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-[#2a2a2e]/25 text-[#2a2a2e] transition hover:-rotate-45 hover:bg-[#2a2a2e]/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:rotate-0"
              >
                <RotateCcw className="size-4" />
              </button>
              <button
                type="button"
                onClick={() => groowtStore.close()}
                aria-label={copy.close}
                className="flex size-9 cursor-pointer items-center justify-center rounded-full bg-[#2a2a2e] text-white transition hover:rotate-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="h-2" />

            {/* Conversation */}
            <ol ref={listRef} aria-live="polite" className="relative flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 pt-3 pb-4">
              <Bubble m={{ id: 0, role: "assistant", content: copy.intro }} index={0} streaming={false} />
              {messages.map((m, i) => (
                <Bubble key={m.id} m={m} index={i + 1} streaming={m.id === streamingId} />
              ))}
              {empty && (
                <motion.li
                  initial={reduce ? false : "hidden"}
                  animate="shown"
                  variants={{ shown: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
                  className="mt-1 flex flex-wrap gap-2"
                >
                  {copy.suggestions.map((s, i) => (
                    <motion.button
                      key={s}
                      type="button"
                      variants={{ hidden: { opacity: 0, y: 8 }, shown: { opacity: 1, y: 0 } }}
                      whileHover={reduce ? undefined : { y: -2, rotate: i % 2 ? 1.5 : -1.5 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => send(s)}
                      className="cursor-pointer rounded-md border border-[#2a2a2e]/20 px-3.5 py-2 text-left text-[13px] leading-snug font-medium text-[#2a2a2e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40"
                      style={{ background: `color-mix(in srgb, ${CHIP_TINTS[i % CHIP_TINTS.length]} 26%, #ffffff)` }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.li>
              )}
            </ol>

            {/* Composer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="relative px-3 pb-2.5"
            >
              <div className="flex items-end gap-2 rounded-[22px] border border-[#2a2a2e]/20 bg-white p-1.5 pl-4 shadow-[0_2px_10px_rgba(0,0,0,.05)] transition focus-within:border-[#2a2a2e]/50 focus-within:shadow-[3px_3px_0_0_#FFDE59]">
                <textarea
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={MAX_CHARS}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send(input);
                    }
                  }}
                  placeholder={copy.placeholder}
                  aria-label={copy.placeholder}
                  className="max-h-28 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[14px] leading-snug text-[#2a2a2e] outline-none placeholder:text-[#2a2a2e]/45"
                />
                <motion.button
                  type="submit"
                  disabled={!input.trim() || busy}
                  aria-label={copy.send}
                  whileTap={{ scale: 0.9 }}
                  className="flex size-10 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#2a2a2e] text-white transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:translate-y-0"
                >
                  <ArrowUp className="size-4.5" strokeWidth={2.4} />
                </motion.button>
              </div>
              <p className="mt-2 px-2 text-center text-[10.5px] leading-snug text-[#2a2a2e]/55">
                {input.length > MAX_CHARS - 100 ? `${MAX_CHARS - input.length} characters left. ` : ""}
                {copy.disclaimer}
              </p>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
