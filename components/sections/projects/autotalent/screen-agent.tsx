"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  BriefcaseBusiness,
  Check,
  Download,
  Eye,
  FileSignature,
  FileText,
  Gauge,
  Languages,
  LayoutTemplate,
  Loader2,
  Mail,
  MessageSquare,
  Plus,
  RefreshCw,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck, type AgentChipId, type ScreenId } from "@/content/autotalent";
import { useStore, type Artifact, type ChatMessage } from "./store";
import { BTN_PRIMARY, FOCUS, Marked, ResumePaper, ScoreRing, plainText, useStreamed } from "./ui";

const a = autotalentDeck.agent;
const CHIP_ICONS: Record<string, LucideIcon> = { FileText, FileSignature, Gauge, Mail, Languages };

/** Card colors per artifact type, like the tinted cards in the real chat panel. */
const ARTIFACT_TONE: Record<AgentChipId, { header: string; badge: string; line: string }> = {
  tailor: { header: "bg-[#f4f6f0]", badge: "bg-[#5b6949] text-white", line: "bg-[#5b6949]/30" },
  cover: { header: "bg-[#eef4a6]/60", badge: "bg-[#2f3826] text-white", line: "bg-[#2f3826]/25" },
  score: { header: "bg-amber-50", badge: "bg-amber-700 text-white", line: "bg-amber-700/25" },
  followup: { header: "bg-sky-50", badge: "bg-sky-800 text-white", line: "bg-sky-800/25" },
  translate: { header: "bg-violet-50", badge: "bg-violet-800 text-white", line: "bg-violet-800/25" },
};

function scriptFor(chip: AgentChipId) {
  return a.scripts.find((s) => s.id === chip)!;
}

export function AgentScreen({ autoplay }: { onNavigate: (s: ScreenId) => void; autoplay: boolean }) {
  const { messages, artifacts, activeArtifactId, runAgent } = useStore();
  const [tab, setTab] = React.useState<"chat" | "document">("chat");
  const active = artifacts.find((x) => x.id === activeArtifactId) ?? null;

  // Under autoplay, show the agent at work without waiting for a click.
  const started = React.useRef(false);
  React.useEffect(() => {
    if (!autoplay || started.current || messages.length > 0) return;
    const t = window.setTimeout(() => {
      started.current = true;
      runAgent("tailor");
    }, 1100);
    return () => window.clearTimeout(t);
  }, [autoplay, messages.length, runAgent]);

  return (
    <div className="flex h-full flex-col">
      {/* Phones: the app's own Chat / Document switch. */}
      <div className="flex shrink-0 gap-1 border-b border-zinc-200 bg-white p-1.5 md:hidden" role="tablist">
        {(["chat", "document"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-lg py-1.5 text-[13px] font-medium",
              FOCUS,
              tab === t ? "bg-[#5b6949]/10 text-[#5b6949]" : "text-zinc-500",
            )}
          >
            {t === "chat" ? <MessageSquare aria-hidden className="size-4" /> : <FileText aria-hidden className="size-4" />}
            {t === "chat" ? a.chat : a.document}
          </button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <div className={cn("min-w-0 flex-1 md:flex md:max-w-[44%] md:flex-none md:basis-[44%] md:border-r md:border-zinc-200", tab === "chat" ? "flex" : "hidden")}>
          <ChatPanel onOpenDocument={() => setTab("document")} />
        </div>
        <div className={cn("min-w-0 flex-1 md:flex", tab === "document" ? "flex" : "hidden")}>
          <ArtifactPanel artifact={active} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------- chat */

function Chips({ compact }: { compact?: boolean }) {
  const { runAgent, agentBusy } = useStore();
  return (
    <div className={cn("flex flex-wrap gap-2", compact ? "justify-start" : "justify-center")}>
      {a.scripts.map((s) => {
        const Icon = CHIP_ICONS[s.icon]!;
        return (
          <button
            key={s.id}
            type="button"
            disabled={agentBusy}
            onClick={() => runAgent(s.id)}
            className={cn(
              "flex cursor-pointer items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-[13px] text-zinc-600 transition-all hover:border-[#5b6949]/30 hover:bg-[#5b6949]/5 hover:text-[#5b6949] disabled:cursor-not-allowed disabled:opacity-50",
              FOCUS,
            )}
          >
            <Icon aria-hidden className="size-3.5 text-[#5b6949]" />
            {s.label}
          </button>
        );
      })}
    </div>
  );
}

function Composer() {
  const { sendFreeText, agentBusy, askWalkthrough } = useStore();
  const [text, setText] = React.useState("");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    sendFreeText(text);
    setText("");
  };
  return (
    <form onSubmit={submit} className="flex flex-col rounded-2xl border border-zinc-200 bg-white px-4 pt-3 pb-2.5 shadow-sm transition-all focus-within:border-[#5b6949]/40 focus-within:shadow-md">
      <div className="flex items-end gap-2">
        <button
          type="button"
          onClick={() => askWalkthrough(a.attachFeature)}
          aria-label={a.attach}
          className={cn("mb-0.5 flex size-6 shrink-0 cursor-pointer items-center justify-center rounded-md text-[#5b6949]/60 transition-colors hover:text-[#5b6949]", FOCUS)}
        >
          <Plus aria-hidden className="size-5" />
        </button>
        <label className="sr-only" htmlFor="autotalent-agent-input">
          {a.placeholder}
        </label>
        <input
          id="autotalent-agent-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={a.placeholder}
          autoComplete="off"
          className="min-w-0 flex-1 bg-transparent py-0.5 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
        />
        <button
          type="submit"
          aria-label={a.send}
          disabled={agentBusy || !text.trim()}
          className={cn(
            "flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#5b6949] text-white transition-colors hover:bg-[#4a573a] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400",
            FOCUS,
          )}
        >
          <ArrowUp aria-hidden className="size-4" />
        </button>
      </div>
    </form>
  );
}

function ChatPanel({ onOpenDocument }: { onOpenDocument: () => void }) {
  const { messages, clearChat, agentBusy } = useStore();
  const scroller = React.useRef<HTMLDivElement>(null);

  // Stick to the bottom while the agent writes.
  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.scrollTo({ top: el.scrollHeight }));
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => ro.disconnect();
  }, [messages.length]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center overflow-y-auto bg-white px-5 pt-8 pb-24 sm:pb-8">
        <div className="mb-5 inline-flex rounded-2xl bg-[#5b6949]/10 p-3">
          <BriefcaseBusiness aria-hidden className="size-7 text-[#5b6949]" />
        </div>
        <h2 className="mb-1 text-2xl font-semibold text-zinc-800">{a.empty.title}</h2>
        <p className="mb-7 max-w-sm text-center text-sm text-zinc-500">{a.empty.subtitle}</p>
        <div className="w-full max-w-xl">
          <Composer />
          <div className="mt-4">
            <Chips />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden className="size-2 shrink-0 rounded-full bg-[#5b6949]" />
          <span className="text-xs font-medium text-zinc-700">{a.title}</span>
          <span className="hidden truncate text-[11px] text-zinc-500 lg:inline">{a.status}</span>
        </div>
        <button
          type="button"
          onClick={clearChat}
          disabled={agentBusy}
          className={cn("flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-[11px] text-zinc-500 transition-colors hover:text-[#5b6949] disabled:cursor-not-allowed disabled:opacity-50", FOCUS)}
        >
          <RefreshCw aria-hidden className="size-3" />
          {a.clear}
        </button>
      </div>
      <div ref={scroller} className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3 px-4 py-4">
          {messages.map((m) => (m.role === "user" ? <UserBubble key={m.id} text={m.text} /> : <AgentMessage key={m.id} message={m} onOpenDocument={onOpenDocument} />))}
        </div>
      </div>
      <div className="shrink-0 space-y-2.5 border-t border-zinc-100 px-4 pt-3 pb-20 sm:pb-4">
        <Chips compact />
        <Composer />
      </div>
    </div>
  );
}

function UserBubble({ text }: { text: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={{ opacity: 0, y: reduce ? 0 : 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex justify-end">
      <p className="max-w-[85%] rounded-2xl rounded-br-md bg-[#5b6949] px-3.5 py-2.5 text-[13px] leading-relaxed text-white">{text}</p>
    </motion.div>
  );
}

function AgentMessage({ message, onOpenDocument }: { message: Extract<ChatMessage, { role: "agent" }>; onOpenDocument: () => void }) {
  const { artifacts, activeArtifactId, setActiveArtifact } = useStore();
  const script = message.chip ? scriptFor(message.chip) : null;
  const plain = plainText(message.text);
  const shown = useStreamed(plain.length, message.replyAt);
  const streaming = message.replyAt !== null && shown < plain.length;
  const artifact = artifacts.find((x) => x.id === message.artifactId);

  return (
    <div className="flex flex-col items-start gap-2">
      {script && (
        <div className="flex flex-wrap gap-1.5">
          {script.tools.map((tool, i) =>
            i <= message.toolsDone ? (
              <span key={tool} className="inline-flex items-center gap-1.5 rounded-full border border-[#5b6949]/15 bg-[#5b6949]/5 px-2.5 py-1 text-[11px] text-[#5b6949]">
                {i < message.toolsDone ? <Check aria-hidden className="size-3" /> : <Loader2 aria-hidden className="size-3 motion-safe:animate-spin" />}
                {tool}
              </span>
            ) : null,
          )}
        </div>
      )}
      {message.replyAt === null && !script && (
        <span className="inline-flex items-center gap-1.5 text-[12px] text-zinc-500">
          <Loader2 aria-hidden className="size-3 motion-safe:animate-spin" />
          {a.working}
        </span>
      )}
      {message.replyAt !== null && (
        <p className="max-w-[92%] rounded-2xl rounded-bl-md bg-zinc-100 px-3.5 py-2.5 text-[13px] leading-relaxed text-zinc-800">
          {plain.slice(0, shown)}
          {streaming && <span aria-hidden className="ml-0.5 inline-block h-3.5 w-1.5 translate-y-0.5 rounded-sm bg-[#5b6949]" />}
        </p>
      )}
      {artifact && !streaming && message.chip && (
        <ArtifactCard artifact={artifact} active={artifact.id === activeArtifactId} onOpen={() => (setActiveArtifact(artifact.id), onOpenDocument())} />
      )}
    </div>
  );
}

function ArtifactCard({ artifact, active, onOpen }: { artifact: Artifact; active: boolean; onOpen: () => void }) {
  const reduce = useReducedMotion();
  const s = scriptFor(artifact.chip);
  const tone = ARTIFACT_TONE[artifact.chip];
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group w-64 cursor-pointer overflow-hidden rounded-2xl border text-left transition-shadow hover:shadow-md",
        FOCUS,
        active ? "border-[#5b6949]/40 ring-2 ring-[#5b6949]/15" : "border-zinc-200",
      )}
    >
      <div className={cn("px-4 pt-4 pb-3", tone.header)}>
        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold", tone.badge)}>{s.artifact.type}</span>
        <div aria-hidden className="mt-3 space-y-1.5">
          <div className={cn("h-1.5 w-4/5 rounded-full", tone.line)} />
          <div className={cn("h-1 w-3/5 rounded-full opacity-60", tone.line)} />
          <div className={cn("h-1 w-2/3 rounded-full opacity-40", tone.line)} />
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-zinc-100 bg-white px-4 py-2.5">
        <div className="min-w-0 pr-2">
          <p className="truncate text-[13px] font-semibold text-zinc-800">{s.artifact.title}</p>
          <p className="mt-0.5 text-[10.5px] text-zinc-500">{a.clickToOpen}</p>
        </div>
        <Eye aria-hidden className="size-4 shrink-0 text-zinc-400 transition-colors group-hover:text-[#5b6949]" />
      </div>
    </motion.button>
  );
}

/* ------------------------------------------------------------- artifact */

function ArtifactPanel({ artifact }: { artifact: Artifact | null }) {
  const { artifacts, setActiveArtifact, templateId, setTemplate, toast } = useStore();
  const [picker, setPicker] = React.useState(false);
  const pickerRef = React.useRef<HTMLDivElement>(null);
  const template = autotalentDeck.templates.find((t) => t.id === templateId) ?? autotalentDeck.templates[0]!;
  const reduce = useReducedMotion();

  // Download unlocks once the document has finished writing in.
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    if (!artifact) return;
    const left = reduce ? 0 : Math.max(0, artifact.createdAt + 1300 - Date.now());
    setReady(left === 0);
    if (left === 0) return;
    const t = window.setTimeout(() => setReady(true), left);
    return () => window.clearTimeout(t);
  }, [artifact, reduce]);

  React.useEffect(() => {
    if (!picker) return;
    const onDown = (e: PointerEvent) => !pickerRef.current?.contains(e.target as Node) && setPicker(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPicker(false);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [picker]);

  if (!artifact) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-50/60 p-8 text-center">
        <div className="relative mb-5">
          {/* Three stacked paper sheets, the documents to come. */}
          <div aria-hidden className="absolute inset-0 translate-x-3 -translate-y-2 rotate-6 rounded-xl border border-zinc-200 bg-white" />
          <div aria-hidden className="absolute inset-0 -translate-x-3 -rotate-6 rounded-xl border border-zinc-200 bg-white" />
          <div className="relative flex h-28 w-22 flex-col gap-1.5 rounded-xl border border-zinc-200 bg-white p-3">
            <FileText aria-hidden className="size-5 text-[#5b6949]" />
            <span aria-hidden className="h-1 w-full rounded-full bg-zinc-200" />
            <span aria-hidden className="h-1 w-4/5 rounded-full bg-zinc-200" />
            <span aria-hidden className="h-1 w-3/5 rounded-full bg-[#eef4a6]" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-zinc-800">{a.artifact.emptyTitle}</h3>
        <p className="mt-1 max-w-xs text-sm text-zinc-500">{a.artifact.emptyBody}</p>
      </div>
    );
  }

  const s = scriptFor(artifact.chip);
  const isResume = artifact.chip === "tailor" || artifact.chip === "translate";

  return (
    <div className="flex h-full w-full flex-col bg-white">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-zinc-200 bg-zinc-50 px-3 py-1.5">
        <div className="flex min-w-0 items-center gap-1.5">
          <FileText aria-hidden className="size-3.5 shrink-0 text-[#5b6949]" />
          <span className="truncate text-xs font-medium text-zinc-700">{s.artifact.title}</span>
          <span className="shrink-0 rounded-full bg-zinc-100 px-1.5 py-0.5 text-[10px] text-zinc-500">{a.artifact.version}</span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          {isResume && (
            <div className="relative" ref={pickerRef}>
              <button
                type="button"
                onClick={() => setPicker((p) => !p)}
                aria-label={a.artifact.templates}
                aria-expanded={picker}
                className={cn("flex size-7 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800", FOCUS, picker && "bg-zinc-100")}
              >
                <LayoutTemplate aria-hidden className="size-3.5" />
              </button>
              <AnimatePresence>
                {picker && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full right-0 z-20 mt-1 w-52 rounded-xl border border-zinc-200 bg-white p-2 shadow-lg"
                  >
                    <p className="mb-1.5 px-2 text-[10px] font-semibold text-zinc-500">{a.artifact.templates}</p>
                    {autotalentDeck.templates.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => (setTemplate(t.id), setPicker(false))}
                        className={cn(
                          "flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-zinc-50",
                          FOCUS,
                          t.id === templateId && "bg-[#5b6949]/5",
                        )}
                      >
                        <span aria-hidden className="flex shrink-0 gap-0.5">
                          <span className="h-4 w-3 rounded-sm" style={{ background: t.accent }} />
                          <span className="h-4 w-1.5 rounded-sm" style={{ background: t.secondary }} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-medium text-zinc-700">{t.id}</span>
                          <span className="block truncate text-[10px] text-zinc-500">{t.name}</span>
                        </span>
                        {t.id === templateId && <Check aria-hidden className="size-3.5 text-[#5b6949]" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          <button
            type="button"
            disabled={!ready}
            onClick={() => toast(a.artifact.downloadedTitle, a.artifact.downloadedBody)}
            className={cn(BTN_PRIMARY, "h-7 rounded-lg px-2.5 text-[12px] [&_svg]:size-3.5")}
          >
            {ready ? <Download aria-hidden /> : <Loader2 aria-hidden className="motion-safe:animate-spin" />}
            {a.artifact.download}
          </button>
        </div>
      </div>

      {artifacts.length > 1 && (
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-zinc-100 px-3 py-1.5">
          {artifacts.map((x) => (
            <button
              key={x.id}
              type="button"
              onClick={() => setActiveArtifact(x.id)}
              className={cn(
                "shrink-0 cursor-pointer rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                FOCUS,
                x.id === artifact.id ? "bg-[#5b6949] text-white" : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
              )}
            >
              {scriptFor(x.chip).artifact.type}
            </button>
          ))}
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto bg-[radial-gradient(#e5e7db_0.6px,transparent_0.6px)] [background-size:18px_18px] px-4 py-6 sm:px-8">
        <div key={artifact.id} className="mx-auto max-w-[560px]">
          {artifact.chip === "tailor" && <ResumePaper doc={autotalentDeck.tailoredResume} accent={template.accent} secondary={template.secondary} reveal />}
          {artifact.chip === "translate" && <ResumePaper doc={a.docs.arabic} accent={template.accent} secondary={template.secondary} dir="rtl" reveal />}
          {artifact.chip === "cover" && <LetterDoc />}
          {artifact.chip === "followup" && <EmailDoc />}
          {artifact.chip === "score" && <ScoreDoc />}
        </div>
      </div>
    </div>
  );
}

function useReveal() {
  const reduce = useReducedMotion();
  return (i: number) =>
    reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.12 + i * 0.2, duration: 0.35, ease: [0.22, 1, 0.36, 1] as const } };
}

function LetterDoc() {
  const d = a.docs.letter;
  const r = useReveal();
  return (
    <article className="rounded-lg bg-white px-8 py-8 text-[12.5px] leading-relaxed text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(31,37,26,.10)] ring-1 ring-zinc-200">
      <motion.p {...r(0)} className="font-semibold text-zinc-900">
        {autotalentDeck.user.name}
      </motion.p>
      <motion.p {...r(0)} className="text-[11px] text-zinc-500">
        {autotalentDeck.user.email}
      </motion.p>
      <motion.p {...r(1)} className="mt-6 text-zinc-500">
        {d.to}
      </motion.p>
      <motion.p {...r(1)} className="mt-4 text-zinc-900">
        {d.greeting}
      </motion.p>
      {d.paragraphs.map((p, i) => (
        <motion.p key={i} {...r(i + 2)} className="mt-3">
          <Marked text={p} />
        </motion.p>
      ))}
      <motion.p {...r(5)} className="mt-5">
        {d.signoff}
        <br />
        <span className="font-semibold text-zinc-900">{autotalentDeck.user.name}</span>
      </motion.p>
    </article>
  );
}

function EmailDoc() {
  const d = a.docs.email;
  const r = useReveal();
  return (
    <article className="overflow-hidden rounded-xl bg-white text-[12.5px] text-zinc-700 shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(31,37,26,.10)] ring-1 ring-zinc-200">
      <motion.dl {...r(0)} className="divide-y divide-zinc-100 border-b border-zinc-100">
        <div className="flex gap-3 px-5 py-2.5">
          <dt className="w-14 shrink-0 text-zinc-500">{d.toLabel}</dt>
          <dd className="truncate text-zinc-900">{d.to}</dd>
        </div>
        <div className="flex gap-3 px-5 py-2.5">
          <dt className="w-14 shrink-0 text-zinc-500">{d.subjectLabel}</dt>
          <dd className="font-medium text-zinc-900">{d.subject}</dd>
        </div>
      </motion.dl>
      <div className="space-y-3 px-5 py-5 leading-relaxed">
        {d.paragraphs.map((p, i) => (
          <motion.p key={i} {...r(i + 1)} className="whitespace-pre-line">
            <Marked text={p} />
          </motion.p>
        ))}
      </div>
    </article>
  );
}

function ScoreDoc() {
  const d = a.docs.score;
  const r = useReveal();
  const reduce = useReducedMotion();
  const [after, setAfter] = React.useState(reduce ? d.after : d.before);
  React.useEffect(() => {
    if (reduce) return;
    const t = window.setTimeout(() => setAfter(d.after), 900);
    return () => window.clearTimeout(t);
  }, [reduce, d.after]);
  return (
    <article className="rounded-xl bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,.06),0_12px_32px_rgba(31,37,26,.10)] ring-1 ring-zinc-200">
      <motion.div {...r(0)} className="flex items-center justify-around gap-4">
        <div className="flex flex-col items-center gap-2">
          <ScoreRing value={d.before} size={104} label={d.ringLabel} />
          <span className="text-[12px] font-medium text-zinc-500">{d.beforeLabel}</span>
        </div>
        <span aria-hidden className="h-px w-10 bg-zinc-300" />
        <div className="flex flex-col items-center gap-2">
          <ScoreRing value={after} size={104} label={d.ringLabel} />
          <span className="text-[12px] font-medium text-zinc-900">{d.afterLabel}</span>
        </div>
      </motion.div>
      <motion.ul {...r(1)} className="mt-6 space-y-2.5">
        {d.checks.map((c) => (
          <li key={c.label}>
            <div className="flex justify-between text-[12px]">
              <span className="text-zinc-700">{c.label}</span>
              <span className="font-semibold text-zinc-900 tabular-nums">{c.value}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
              <motion.div
                className="h-full rounded-full bg-[#5b6949]"
                initial={{ width: reduce ? `${c.value}%` : 0 }}
                animate={{ width: `${c.value}%` }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
            </div>
          </li>
        ))}
      </motion.ul>
      <motion.div {...r(2)} className="mt-6 rounded-xl border border-[#5b6949]/20 bg-[#5b6949]/5 p-4">
        <p className="text-[12px] font-semibold text-zinc-900">{d.fixesLabel}</p>
        <ol className="mt-2 space-y-1.5 text-[12px] text-zinc-700">
          {d.fixes.map((f, i) => (
            <li key={f} className="flex gap-2">
              <span className="flex size-4.5 shrink-0 items-center justify-center rounded-full bg-[#5b6949] text-[10px] font-bold text-white">{i + 1}</span>
              {f}
            </li>
          ))}
        </ol>
      </motion.div>
    </article>
  );
}
