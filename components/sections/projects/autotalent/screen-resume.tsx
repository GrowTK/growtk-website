"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Check, Download, FileText, RotateCcw, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck, type ResumeDoc, type ScreenId } from "@/content/autotalent";
import { useStore } from "./store";
import { BTN_GHOST, BTN_OUTLINE, BTN_PRIMARY, CARD, FOCUS, ResumePaper, ScoreRing } from "./ui";

const r = autotalentDeck.resume;
const labels = autotalentDeck.tailoredResume;

/** The base resume with whichever fixes have been applied. */
function buildDoc(applied: string[]): ResumeDoc {
  const has = (id: string) => applied.includes(id);
  const d = r.doc;
  return {
    name: d.name,
    headline: d.headline,
    contact: d.contact,
    summaryLabel: labels.summaryLabel,
    summary: has("summary") ? d.summary.after : d.summary.before,
    experienceLabel: labels.experienceLabel,
    experience: d.roles.map((role) => ({
      role: role.role,
      company: role.company,
      dates: role.dates,
      bullets: role.bullets.map((b) => (has("keywords") ? b.keywords : has("impact") ? b.impact : b.before)),
    })),
    skillsLabel: labels.skillsLabel,
    skills: has("keywords") ? d.skills.after : d.skills.before,
    educationLabel: labels.educationLabel,
    education: labels.education,
  };
}

export function ResumeScreen({ autoplay }: { onNavigate: (s: ScreenId) => void; autoplay: boolean }) {
  const { appliedFixes, applyFix, resetFixes, templateId, setTemplate, toast } = useStore();
  const reduce = useReducedMotion();
  const template = autotalentDeck.templates.find((t) => t.id === templateId) ?? autotalentDeck.templates[0]!;
  const score = r.base + r.fixes.filter((f) => appliedFixes.includes(f.id)).reduce((n, f) => n + f.gain, 0);
  const checks = r.checks.map((c, i) => ({
    ...c,
    value: Math.min(100, c.base + r.fixes.filter((f) => f.check === i && appliedFixes.includes(f.id)).reduce((n, f) => n + f.checkGain, 0)),
  }));
  const doc = buildDoc(appliedFixes);

  // Apply all, one fix at a time, so each rewrite is visible.
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);
  const applyAll = React.useCallback(() => {
    const left = r.fixes.filter((f) => !appliedFixes.includes(f.id));
    left.forEach((f, i) => timers.current.push(window.setTimeout(() => applyFix(f.id), reduce ? 0 : i * 900)));
  }, [appliedFixes, applyFix, reduce]);

  const started = React.useRef(false);
  React.useEffect(() => {
    if (!autoplay || started.current || appliedFixes.length > 0) return;
    const t = window.setTimeout(() => {
      started.current = true;
      applyAll();
    }, 1600);
    return () => window.clearTimeout(t);
  }, [autoplay, appliedFixes.length, applyAll]);

  return (
    <div className="flex h-full flex-col">
      {/* Editor top bar. */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-zinc-200 bg-white px-4 py-2.5 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#5b6949]/10 text-[#5b6949]">
            <FileText aria-hidden className="size-4" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-[14px] font-semibold text-zinc-900">{r.docName}</h1>
            <p className="truncate text-[11.5px] text-zinc-500">{r.title}</p>
          </div>
        </div>
        <button type="button" onClick={() => toast(r.download, r.downloadToast)} className={cn(BTN_OUTLINE, "h-9")}>
          <Download aria-hidden />
          {r.download}
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto lg:grid lg:grid-cols-[1fr_minmax(0,24rem)] lg:grid-rows-1 lg:overflow-hidden">
        {/* Preview. */}
        <div className="bg-[radial-gradient(#e5e7db_0.6px,transparent_0.6px)] [background-size:18px_18px] px-4 py-6 sm:px-8 lg:overflow-y-auto">
          <div className="mx-auto max-w-[580px]">
            <ResumePaper doc={doc} accent={template.accent} secondary={template.secondary} />
          </div>
        </div>

        {/* Score panel. */}
        <div className="space-y-4 border-zinc-200 bg-white px-4 pt-5 pb-24 sm:px-6 sm:pb-5 lg:overflow-y-auto lg:border-l">
          <section className={cn(CARD, "flex items-center gap-5 bg-gradient-to-br from-[#f4f6f0] to-white p-5")}>
            <ScoreRing value={score} size={112} label={r.scoreLabel} />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-[#4a573a]">{r.scoreTitle}</h2>
              <p className="mt-1 text-[12.5px] leading-snug text-zinc-600">{r.scoreFor}</p>
            </div>
          </section>

          <section>
            <h3 className="mb-2 text-[12px] font-semibold text-zinc-900">{r.checksLabel}</h3>
            <ul className="space-y-2.5">
              {checks.map((c) => (
                <li key={c.label}>
                  <div className="flex justify-between text-[12px]">
                    <span className="text-zinc-700">{c.label}</span>
                    <span className="font-semibold text-zinc-900 tabular-nums">{c.value}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <motion.div className="h-full rounded-full bg-[#5b6949]" initial={false} animate={{ width: `${c.value}%` }} transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-[12px] font-semibold text-zinc-900">{r.fixesLabel}</h3>
              {appliedFixes.length > 0 && (
                <button type="button" onClick={resetFixes} className={BTN_GHOST}>
                  <RotateCcw aria-hidden className="size-3.5" />
                  {r.reset}
                </button>
              )}
            </div>
            <ul className="space-y-2">
              {r.fixes.map((f) => {
                const on = appliedFixes.includes(f.id);
                return (
                  <li key={f.id} className={cn("flex items-start gap-3 rounded-xl border p-3 transition-colors", on ? "border-[#5b6949]/25 bg-[#f4f6f0]" : "border-zinc-200 bg-white")}>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13px] font-semibold text-zinc-900">
                        {f.title} <span className="ml-1 rounded-full bg-[#eef4a6] px-1.5 py-px text-[10.5px] font-bold text-[#2f3826] tabular-nums">+{f.gain}</span>
                      </p>
                      <p className="mt-0.5 text-[12px] leading-snug text-zinc-500">{f.body}</p>
                    </div>
                    <button
                      type="button"
                      disabled={on}
                      onClick={() => applyFix(f.id)}
                      className={cn(
                        "inline-flex h-8 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2.5 text-[12px] font-semibold transition-colors disabled:cursor-not-allowed",
                        FOCUS,
                        on ? "text-[#5b6949]" : "bg-[#5b6949] text-white hover:bg-[#4a573a]",
                      )}
                    >
                      {on && <Check aria-hidden className="size-3.5" />}
                      {on ? r.applied : r.apply}
                    </button>
                  </li>
                );
              })}
            </ul>
            <button type="button" onClick={applyAll} disabled={appliedFixes.length === r.fixes.length} className={cn(BTN_PRIMARY, "mt-3 w-full")}>
              <Wand2 aria-hidden />
              {r.applyAll}
            </button>
          </section>

          <section>
            <h3 className="mb-2 text-[12px] font-semibold text-zinc-900">{r.templatesLabel}</h3>
            <div className="grid grid-cols-7 gap-1.5" role="radiogroup" aria-label={r.templatesLabel}>
              {autotalentDeck.templates.map((t) => {
                const on = t.id === templateId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    title={`${t.id}, ${t.name}`}
                    aria-label={`${t.id}, ${t.name}`}
                    onClick={() => setTemplate(t.id)}
                    className={cn(
                      "flex aspect-[3/4] cursor-pointer flex-col overflow-hidden rounded-md border-2 bg-white transition-all hover:-translate-y-0.5",
                      FOCUS,
                      on ? "border-[#5b6949] shadow-md" : "border-zinc-200",
                    )}
                  >
                    <span aria-hidden className="h-1/3 w-full" style={{ background: t.accent }} />
                    <span aria-hidden className="mx-1 mt-1 h-0.5 rounded-full" style={{ background: t.secondary }} />
                    <span aria-hidden className="mx-1 mt-0.5 h-0.5 w-2/3 rounded-full bg-zinc-200" />
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-[11.5px] text-zinc-500">
              {template.id}, {template.name}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
