"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bookmark, Briefcase, Check, FileSignature, FileText, Loader2, Mail, Plus, Rocket, Search, X, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck, type KitItemId, type ScreenId } from "@/content/autotalent";
import { KIT_ITEMS, useStore, type Kit } from "./store";
import { BTN_PRIMARY, CARD, CompanyTile, FOCUS, SectionHead } from "./ui";

const h = autotalentDeck.hub;
const ITEM_ICONS: Record<KitItemId, LucideIcon> = { resume: FileText, coverLetter: FileSignature, followUp: Mail, interview: Briefcase };

function greeting() {
  const hour = new Date().getHours();
  return hour < 12 ? h.greeting.morning : hour < 18 ? h.greeting.afternoon : h.greeting.evening;
}

function job(id: string) {
  return autotalentDeck.jobs.find((j) => j.id === id)!;
}

export function HubScreen({ onNavigate, autoplay }: { onNavigate: (s: ScreenId) => void; autoplay: boolean }) {
  const { kits, createKit } = useStore();
  const [picking, setPicking] = React.useState(false);
  // The greeting depends on the visitor's clock, so it waits for the browser.
  const [hello, setHello] = React.useState(h.greeting.morning);
  React.useEffect(() => setHello(greeting()), []);

  // Under autoplay with no kit yet, make one so the viewer sees it being written.
  const started = React.useRef(false);
  React.useEffect(() => {
    if (!autoplay || started.current || kits.length > 0) return;
    const t = window.setTimeout(() => {
      started.current = true;
      createKit(autotalentDeck.savedJobIds[0]!);
    }, 1400);
    return () => window.clearTimeout(t);
  }, [autoplay, kits.length, createKit]);

  return (
    <div className="relative h-full overflow-y-auto">
      {/* The app's dotted page texture. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7db_0.6px,transparent_0.6px)] [background-size:24px_24px] opacity-60" />
      <div className="relative mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-8 sm:pt-8">
        <div className="mb-7">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
            {hello}, {autotalentDeck.user.first}
          </h1>
          <p className="mt-1 text-sm text-zinc-500">{h.subtitle}</p>
        </div>

        <Checklist hasKit={kits.length > 0} onPick={() => setPicking(true)} onNavigate={onNavigate} />

        <SectionHead title={h.kits.title} count={kits.length} />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <button
            type="button"
            onClick={() => setPicking(true)}
            className={cn(
              "group flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#5b6949]/25 bg-[#5b6949]/[0.03] p-6 text-center transition-colors hover:border-[#5b6949]/50 hover:bg-[#5b6949]/[0.06]",
              FOCUS,
            )}
          >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-[#5b6949] text-white shadow-md shadow-[#5b6949]/25 transition-transform duration-300 group-hover:scale-105">
              <Plus aria-hidden className="size-6" />
            </span>
            <span className="mt-4 text-[15px] font-semibold text-zinc-900">{h.kits.newKit}</span>
            <span className="mt-1 max-w-[16rem] text-[12.5px] text-zinc-500">{h.kits.kitDescription}</span>
          </button>
          <AnimatePresence initial={false}>
            {kits.map((kit) => (
              <KitCard key={kit.id} kit={kit} onNavigate={onNavigate} />
            ))}
          </AnimatePresence>
          {kits.length === 0 && <p className="self-center px-2 text-sm text-zinc-500 sm:col-span-1 xl:col-span-2">{h.kits.empty}</p>}
        </div>
      </div>
      <JobPicker open={picking} onClose={() => setPicking(false)} />
    </div>
  );
}

/* ----------------------------------------------------------- checklist */

function Checklist({ hasKit, onPick, onNavigate }: { hasKit: boolean; onPick: () => void; onNavigate: (s: ScreenId) => void }) {
  const c = h.checklist;
  const done = hasKit ? 3 : 2;
  return (
    <section className="mb-8 overflow-hidden rounded-2xl border border-[#5b6949]/25 bg-white shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-zinc-100 bg-[#5b6949]/5 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#5b6949] text-white">
            <Rocket aria-hidden className="size-5" />
          </span>
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">{c.title}</h2>
            <p className="text-sm text-zinc-600">{c.subtitle}</p>
          </div>
        </div>
        <span className="shrink-0 rounded-full border border-[#5b6949]/20 bg-white px-3 py-1 text-xs font-semibold text-[#5b6949] tabular-nums">{c.progress.replace("{done}", String(done))}</span>
      </div>
      <div aria-hidden className="h-1 bg-zinc-100">
        <motion.div className="h-full bg-[#5b6949]" initial={false} animate={{ width: `${(done / 3) * 100}%` }} transition={{ duration: 0.5 }} />
      </div>
      <ol className="divide-y divide-zinc-100">
        {c.steps.map((step, i) => {
          const complete = i < done;
          return (
            <li key={step.title} className="flex gap-4 px-5 py-4 sm:px-6">
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  complete ? "bg-[#5b6949] text-white" : "border-2 border-[#5b6949]/30 text-[#5b6949]",
                )}
              >
                {complete ? <Check aria-hidden className="size-4" strokeWidth={3} /> : i + 1}
                {complete && <span className="sr-only">{c.completed}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className={cn("text-[14.5px] font-semibold", complete ? "text-zinc-500" : "text-zinc-900")}>{step.title}</p>
                <p className="mt-0.5 text-[13px] text-zinc-500">{step.body}</p>
                <div className="mt-2">
                  {complete ? (
                    <button
                      type="button"
                      onClick={() => onNavigate(i === 0 ? "agent" : "resume")}
                      className={cn("cursor-pointer rounded text-sm font-medium text-[#5b6949] hover:underline", FOCUS)}
                    >
                      {step.done}
                    </button>
                  ) : (
                    <div className="flex flex-wrap items-center gap-3">
                      <button type="button" onClick={onPick} className={cn(BTN_PRIMARY, "h-9")}>
                        {"cta" in step ? step.cta : step.done}
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate("search")}
                        className={cn("inline-flex cursor-pointer items-center gap-1 rounded text-sm font-medium text-[#5b6949] hover:underline", FOCUS)}
                      >
                        <Search aria-hidden className="size-3.5" />
                        {autotalentDeck.nav.searchJobs}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------------- kit card */

function KitCard({ kit, onNavigate }: { kit: Kit; onNavigate: (s: ScreenId) => void }) {
  const { runAgent, askWalkthrough } = useStore();
  const reduce = useReducedMotion();
  const j = job(kit.jobId);
  const readyCount = KIT_ITEMS.filter((i) => kit.items[i] === "ready").length;

  const open = (item: KitItemId) => {
    if (item === "resume") return onNavigate("resume");
    if (item === "interview") return askWalkthrough(h.kits.items.interview);
    runAgent(item === "coverLetter" ? "cover" : "followup");
    onNavigate("agent");
  };

  return (
    <motion.article
      layout={!reduce}
      initial={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(CARD, "flex flex-col overflow-hidden shadow-sm")}
    >
      <div className="flex items-start gap-3 p-4">
        <CompanyTile initials={j.initials} color={j.color} />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[15px] font-semibold text-zinc-900">{j.title}</h3>
          <p className="truncate text-[12.5px] text-zinc-500">
            {j.company} · {j.location}
          </p>
        </div>
        <span className="shrink-0 rounded-full bg-[#eef4a6] px-2 py-0.5 text-[11px] font-bold text-[#2f3826] tabular-nums">{readyCount}/4</span>
      </div>
      <ul className="grid grid-cols-2 gap-2 px-4 pb-4">
        {KIT_ITEMS.map((item) => {
          const Icon = ITEM_ICONS[item];
          const status = kit.items[item];
          return (
            <li key={item}>
              <button
                type="button"
                disabled={status !== "ready"}
                onClick={() => open(item)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded-xl border px-2.5 py-2 text-left transition-colors disabled:cursor-not-allowed",
                  FOCUS,
                  status === "ready" ? "border-[#5b6949]/20 bg-[#f4f6f0] hover:border-[#5b6949]/40" : "border-zinc-200 bg-zinc-50",
                )}
              >
                <span className={cn("flex size-7 shrink-0 items-center justify-center rounded-lg", status === "ready" ? "bg-[#5b6949] text-white" : "bg-white text-zinc-400")}>
                  {status === "writing" ? <Loader2 aria-hidden className="size-3.5 motion-safe:animate-spin" /> : <Icon aria-hidden className="size-3.5" />}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-zinc-800">{h.kits.items[item]}</span>
                  <span className={cn("block text-[10.5px]", status === "ready" ? "font-medium text-[#5b6949]" : "text-zinc-500")}>{h.kits.status[status]}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto border-t border-zinc-100 px-4 py-2 text-[11px] text-zinc-500">
        {h.kits.created} {h.kits.justNow}
      </p>
    </motion.article>
  );
}

/* ----------------------------------------------------------- job picker */

function JobPicker({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { savedJobIds, kits, createKit } = useStore();
  const reduce = useReducedMotion();
  const p = h.picker;
  const closeRef = React.useRef<HTMLButtonElement>(null);
  const saved = autotalentDeck.jobs.filter((j) => savedJobIds.includes(j.id));

  React.useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="absolute inset-0 z-40 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-zinc-900/25 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="autotalent-picker-title"
            initial={{ opacity: 0, y: reduce ? 0 : 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md rounded-2xl bg-white p-5 shadow-[0_24px_64px_rgba(24,24,27,.2)]"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="autotalent-picker-title" className="text-lg font-semibold text-zinc-900">
                  {p.title}
                </h3>
                <p className="mt-0.5 text-[13px] text-zinc-500">{p.body}</p>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label={p.close}
                className={cn("flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900", FOCUS)}
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>
            <ul className="mt-4 space-y-2">
              {saved.length === 0 && <li className="rounded-xl bg-zinc-50 px-4 py-6 text-center text-sm text-zinc-500">{p.empty}</li>}
              {saved.map((j) => {
                const made = kits.some((k) => k.jobId === j.id);
                return (
                  <li key={j.id}>
                    <button
                      type="button"
                      disabled={made}
                      onClick={() => {
                        createKit(j.id);
                        onClose();
                      }}
                      className={cn(
                        "flex w-full cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 p-3 text-left transition-colors hover:border-[#5b6949]/40 hover:bg-[#5b6949]/5 disabled:cursor-not-allowed disabled:opacity-60",
                        FOCUS,
                      )}
                    >
                      <CompanyTile initials={j.initials} color={j.color} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-semibold text-zinc-900">{j.title}</span>
                        <span className="block truncate text-[12px] text-zinc-500">
                          {j.company} · {j.workplace}
                        </span>
                      </span>
                      <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10.5px] font-semibold", made ? "bg-zinc-100 text-zinc-500" : "bg-[#5b6949]/10 text-[#5b6949]")}>
                        {made ? <Check aria-hidden className="size-3" /> : <Bookmark aria-hidden className="size-3" />}
                        {made ? p.hasKit : p.saved}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
