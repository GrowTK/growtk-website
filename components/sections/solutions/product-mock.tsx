"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { AlertTriangle, BellRing, Mail, MessageCircle, MessageSquare, Phone, Search, Sparkles } from "lucide-react";
import { productMocks, type MockKind } from "@/content/solution-mocks";
import { cn } from "@/lib/utils";

/**
 * Coded product mocks for the four solutions. Each is a small, live looking
 * window built from brand tokens: the knowledge base types a search, the
 * helpdesk queue takes new tickets, the scorecard fills, the survey chart
 * grows. They only animate while on screen and sit still under reduced motion.
 * Decorative: the window is aria-hidden with one sr-only label.
 */
export function ProductMock({ kind, className, compact = false }: { kind: MockKind; className?: string; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion() ?? false;
  const live = inView && !reduce;
  const data = productMocks[kind];

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      <span className="sr-only">{data.label}</span>
      <div aria-hidden className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_30px_80px_-30px_rgb(38_38_42/0.35)]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FFDE59]" />
          <span className="size-2.5 rounded-full bg-[#FFBA7B]" />
          <span className="size-2.5 rounded-full bg-[#F2C4FF]" />
          <span className="ml-3 text-xs font-semibold text-[#26262a]/70">{data.title}</span>
        </div>
        <div className={cn("p-4 sm:p-5", compact && "p-3.5 sm:p-4")}>
          {kind === "kb" ? <KbMock live={live} compact={compact} /> : null}
          {kind === "helpdesk" ? <HelpdeskMock live={live} compact={compact} /> : null}
          {kind === "qa" ? <QaMock live={live} inView={inView || reduce} compact={compact} /> : null}
          {kind === "survey" ? <SurveyMock live={live} inView={inView || reduce} compact={compact} /> : null}
        </div>
      </div>
    </div>
  );
}

const TONE_BG = { yellow: "bg-[#FFDE59]/70", lilac: "bg-[#F2C4FF]/70", peach: "bg-[#FFBA7B]/70", neutral: "bg-[#26262a]/[0.07]" } as const;

/* ------------------------------ Knowledge base ----------------------------- */

function KbMock({ live, compact }: { live: boolean; compact: boolean }) {
  const d = productMocks.kb;
  const [q, setQ] = useState(0);
  const [chars, setChars] = useState(d.queries[0]!.length);

  useEffect(() => {
    if (!live) return;
    const query = d.queries[q]!;
    if (chars < query.length) {
      const t = setTimeout(() => setChars((c) => c + 1), 55);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => {
      setQ((i) => (i + 1) % d.queries.length);
      setChars(0);
    }, 2600);
    return () => clearTimeout(t);
  }, [live, q, chars, d.queries]);

  const typed = d.queries[q]!.slice(0, chars);
  const done = chars >= d.queries[q]!.length;
  // Rotate the article list so the best match for this query leads.
  const order = d.articles.map((_, i) => d.articles[(i + q) % d.articles.length]!).slice(0, compact ? 3 : 4);

  return (
    <div>
      <div className="flex items-center gap-2.5 rounded-xl border border-black/10 bg-[#FCFCFA] px-3.5 py-3">
        <Search className="size-4 text-[#26262a]/50" />
        <span className="text-sm text-[#26262a]">
          {typed || <span className="text-[#26262a]/40">{d.placeholder}</span>}
          <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-[#26262a] motion-safe:animate-pulse" />
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        <AnimatePresence mode="popLayout" initial={false}>
          {order.map((a, i) => {
            const match = done ? [98, 74, 51, 32][i]! : 0;
            return (
              <motion.li
                key={a.title}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className={cn("rounded-xl border px-3.5 py-2.5", i === 0 && done ? "border-[#FFDE59] bg-[#FFDE59]/15" : "border-black/[0.06]")}
              >
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[10px] font-semibold tracking-wide text-[#26262a]/55">{a.category}</span>
                  <span className="text-[10px] tabular-nums text-[#26262a]/55">
                    {match}% {d.matchLabel}
                  </span>
                </div>
                <p className="mt-1 text-[13px] font-semibold leading-snug text-[#26262a]">{a.title}</p>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-black/[0.05]">
                  <motion.div className="h-full rounded-full bg-[#26262a]" animate={{ width: `${match}%` }} transition={{ duration: 0.6, ease: "easeOut" }} />
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#26262a]/60">
        <Sparkles className="size-3.5" /> {d.footer}
      </p>
    </div>
  );
}

/* --------------------------------- Helpdesk -------------------------------- */

const CHANNEL_ICON = { phone: Phone, chat: MessageCircle, mail: Mail, social: MessageSquare } as const;

function HelpdeskMock({ live, compact }: { live: boolean; compact: boolean }) {
  const d = productMocks.helpdesk;
  const rows = compact ? 4 : 5;
  const [head, setHead] = useState(0);

  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setHead((h) => (h + 1) % d.tickets.length), 2400);
    return () => clearInterval(t);
  }, [live, d.tickets.length]);

  const list = Array.from({ length: rows }, (_, i) => {
    const idx = (head - i + d.tickets.length * 2) % d.tickets.length;
    return { ...d.tickets[idx]!, key: `${idx}-${Math.floor((head - i + d.tickets.length * 2) / d.tickets.length)}` };
  });

  return (
    <div>
      <div className={cn("grid gap-3 px-1 pb-2 text-[10px] font-semibold tracking-wide text-[#26262a]/50", compact ? "grid-cols-[1fr_auto]" : "grid-cols-[1fr_auto_auto]")}>
        <span>{d.columns[0]}</span>
        <span className="w-[5.5rem]">{d.columns[1]}</span>
        {!compact ? <span className="w-9 text-right">{d.columns[2]}</span> : null}
      </div>
      <ul className="space-y-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {list.map((t, i) => {
            const Icon = CHANNEL_ICON[t.channel as keyof typeof CHANNEL_ICON] ?? MessageCircle;
            return (
              <motion.li
                key={t.key}
                layout
                initial={{ opacity: 0, x: -14, backgroundColor: "rgba(255,222,89,0.35)" }}
                animate={{ opacity: 1, x: 0, backgroundColor: "rgba(255,255,255,0)" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className={cn("grid items-center gap-2.5 rounded-xl border border-black/[0.06] px-2.5 py-2.5", compact ? "grid-cols-[1fr_auto]" : "grid-cols-[1fr_auto_auto] sm:px-3")}
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg", i === 0 ? "bg-[#26262a] text-white" : "bg-[#26262a]/[0.06] text-[#26262a]")}>
                    <Icon className="size-3.5" />
                  </span>
                  <span className="truncate text-[13px] font-medium text-[#26262a]">{t.subject}</span>
                </span>
                <span className={cn("w-[5.5rem] truncate rounded-full px-2 py-1 text-center text-[10px] font-semibold text-[#26262a]", TONE_BG[d.statusTone[t.status] ?? "neutral"])}>
                  {t.status}
                </span>
                {!compact ? <span className="w-9 text-right text-[11px] tabular-nums text-[#26262a]/60">{t.due}</span> : null}
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#26262a]/60">
        <Sparkles className="size-3.5" /> {d.footer}
      </p>
    </div>
  );
}

/* ---------------------------------- Quality -------------------------------- */

function QaMock({ live, inView, compact }: { live: boolean; inView: boolean; compact: boolean }) {
  const d = productMocks.qa;
  const avg = Math.round(d.criteria.reduce((s, c) => s + c.score, 0) / d.criteria.length);
  const [pulse, setPulse] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setPulse((p) => p + 1), 4200);
    return () => clearInterval(t);
  }, [live]);
  const criteria = compact ? d.criteria.slice(0, 4) : d.criteria;
  const C = 2 * Math.PI * 30;

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative size-[4.5rem] shrink-0">
          <svg viewBox="0 0 72 72" className="size-full -rotate-90">
            <circle cx="36" cy="36" r="30" fill="none" stroke="rgb(38 38 42 / 0.08)" strokeWidth="7" />
            <motion.circle
              key={pulse}
              cx="36"
              cy="36"
              r="30"
              fill="none"
              stroke="#FFBA7B"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={C}
              initial={{ strokeDashoffset: C }}
              animate={{ strokeDashoffset: inView ? C * (1 - avg / 100) : C }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <span className="absolute inset-0 grid place-items-center text-lg font-bold tabular-nums text-[#26262a]">{avg}</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold tracking-wide text-[#26262a]/50">{d.scoreLabel}</p>
          <p className="text-sm font-semibold text-[#26262a]">{d.conversation}</p>
        </div>
      </div>
      <ul className="mt-4 space-y-2.5">
        {criteria.map((c, i) => (
          <li key={c.name}>
            <div className="flex justify-between text-[12px] text-[#26262a]">
              <span>{c.name}</span>
              <span className="tabular-nums text-[#26262a]/60">{c.score}</span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/[0.05]">
              <motion.div
                key={`${pulse}-${c.name}`}
                className={cn("h-full rounded-full", c.score >= 90 ? "bg-[#26262a]" : "bg-[#FFBA7B]")}
                initial={{ width: 0 }}
                animate={{ width: inView ? `${c.score}%` : 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.08, ease: "easeOut" }}
              />
            </div>
          </li>
        ))}
      </ul>
      {!compact ? (
        <div className="mt-4 rounded-xl bg-[#FFBA7B]/20 p-3">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-[#26262a]">
            <AlertTriangle className="size-3.5" /> {d.flagTitle}
          </p>
          <ul className="mt-1.5 space-y-1">
            {d.flags.map((f) => (
              <li key={f} className="text-[12px] text-[#26262a]/75">
                {f}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

/* ---------------------------------- Survey --------------------------------- */

function SurveyMock({ live, inView, compact }: { live: boolean; inView: boolean; compact: boolean }) {
  const d = productMocks.survey;
  const max = Math.max(...d.bars);
  const [head, setHead] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setHead((h) => (h + 1) % d.responses.length), 2800);
    return () => clearInterval(t);
  }, [live, d.responses.length]);
  const shown = Array.from({ length: compact ? 2 : 3 }, (_, i) => d.responses[(head + i) % d.responses.length]!);

  return (
    <div>
      <p className="text-[12px] font-semibold text-[#26262a]">{d.chartLabel}</p>
      <div className="mt-3 flex h-24 items-end gap-1.5">
        {d.bars.map((v, i) => (
          <div key={i} className="flex h-full flex-1 flex-col items-center gap-1">
            <div className="relative w-full flex-1">
              <motion.div
                className={cn("absolute inset-x-0 bottom-0 rounded-t-md", i >= 9 ? "bg-[#FFDE59]" : i >= 7 ? "bg-[#F2C4FF]" : "bg-[#FFBA7B]/80")}
                initial={{ height: 0 }}
                animate={{ height: inView ? `${(v / max) * 100}%` : 0 }}
                transition={{ duration: 0.7, delay: i * 0.04, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="text-[9px] tabular-nums text-[#26262a]/50">{i}</span>
          </div>
        ))}
      </div>
      <ul className="mt-4 space-y-1.5">
        <AnimatePresence initial={false} mode="popLayout">
          {shown.map((r) => (
            <motion.li
              key={r.text}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-3 rounded-xl border border-black/[0.06] px-3 py-2"
            >
              <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-[12px] font-bold tabular-nums text-[#26262a]", TONE_BG[r.tone])}>{r.score}</span>
              <span className="min-w-0 flex-1 truncate text-[12px] text-[#26262a]">{r.text}</span>
              {r.alert ? <span className="shrink-0 rounded-full bg-[#26262a] px-2 py-0.5 text-[9px] font-semibold text-white">{r.alert}</span> : null}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      <p className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-[#26262a]/60">
        <BellRing className="size-3.5" /> {d.footer}
      </p>
    </div>
  );
}
