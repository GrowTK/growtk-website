"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Bookmark, BookmarkCheck, Check, Clock, Loader2, MapPin, Search, Sparkles, Users, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck, type DemoJob, type ScreenId } from "@/content/autotalent";
import { useStore } from "./store";
import { BTN_OUTLINE, BTN_PRIMARY, CARD, CompanyTile, FOCUS, INPUT } from "./ui";

const s = autotalentDeck.search;
const STAGE_MS = 650;

type FilterKey = "workplace" | "level" | "special";

export function SearchScreen({ onNavigate, autoplay }: { onNavigate: (s: ScreenId) => void; autoplay: boolean }) {
  const { searched, setSearched } = useStore();
  const reduce = useReducedMotion();
  const [keywords, setKeywords] = React.useState(s.keywords);
  const [location, setLocation] = React.useState(s.location);
  const [stage, setStage] = React.useState<number | null>(null);
  const [filters, setFilters] = React.useState<Record<FilterKey, string[]>>({ workplace: [], level: [], special: [] });
  const [selected, setSelected] = React.useState<string>(autotalentDeck.jobs[0]!.id);
  const timers = React.useRef<number[]>([]);
  React.useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const run = React.useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    if (reduce) {
      setStage(null);
      return setSearched(true);
    }
    setSearched(false);
    setStage(0);
    timers.current = s.stages.map((_, i) => window.setTimeout(() => setStage(i + 1), (i + 1) * STAGE_MS));
    timers.current.push(
      window.setTimeout(() => {
        setStage(null);
        setSearched(true);
      }, (s.stages.length + 1) * STAGE_MS),
    );
  }, [reduce, setSearched]);

  // Under autoplay, run the search on its own so the stages play.
  const started = React.useRef(false);
  React.useEffect(() => {
    if (!autoplay || started.current || searched) return;
    const t = window.setTimeout(() => {
      started.current = true;
      run();
    }, 900);
    return () => window.clearTimeout(t);
  }, [autoplay, searched, run]);

  const toggleFilter = (key: FilterKey, value: string) =>
    setFilters((f) => ({ ...f, [key]: f[key].includes(value) ? f[key].filter((v) => v !== value) : [...f[key], value] }));

  const results = autotalentDeck.jobs.filter(
    (j) =>
      (filters.workplace.length === 0 || filters.workplace.includes(j.workplace)) &&
      (filters.level.length === 0 || filters.level.includes(j.level)) &&
      (filters.special.length === 0 || j.applicants < 10),
  );
  const current = results.find((j) => j.id === selected) ?? results[0];

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto max-w-6xl px-4 pt-6 pb-24 sm:px-8 sm:pt-8">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#eef4a6] px-2.5 py-1 text-[11px] font-semibold text-[#2f3826]">
          <Sparkles aria-hidden className="size-3" />
          {s.badge}
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">{s.title}</h1>
        <p className="mt-1 text-sm text-zinc-500">{s.subtitle}</p>

        {/* Search card. */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            run();
          }}
          className={cn(CARD, "mt-6 p-4 shadow-sm")}
        >
          <div className="grid gap-2 sm:grid-cols-[1.4fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">{s.keywordsPlaceholder}</span>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder={s.keywordsPlaceholder} className={cn(INPUT, "pl-9")} />
            </label>
            <label className="relative block">
              <span className="sr-only">{s.locationPlaceholder}</span>
              <MapPin aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={s.locationPlaceholder} className={cn(INPUT, "pl-9")} />
            </label>
            <button type="submit" disabled={stage !== null} className={BTN_PRIMARY}>
              {stage !== null ? <Loader2 aria-hidden className="motion-safe:animate-spin" /> : <Search aria-hidden />}
              {s.button}
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
            {(Object.keys(s.filters) as FilterKey[]).map((key) => (
              <div key={key} className="flex flex-wrap items-center gap-1.5" role="group" aria-label={s.filters[key].label}>
                <span className="mr-0.5 text-[11px] font-medium text-zinc-500">{s.filters[key].label}</span>
                {s.filters[key].options.map((opt) => {
                  const on = filters[key].includes(opt);
                  return (
                    <button
                      key={opt}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleFilter(key, opt)}
                      className={cn(
                        "cursor-pointer rounded-full border px-2.5 py-1 text-[12px] font-medium transition-colors",
                        FOCUS,
                        on ? "border-[#5b6949] bg-[#5b6949] text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-[#5b6949]/40 hover:text-[#5b6949]",
                      )}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </form>

        {/* Results. */}
        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            {stage !== null ? (
              <Stages key="stages" stage={stage} />
            ) : !searched ? (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn(CARD, "flex flex-col items-center px-6 py-14 text-center")}>
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[#5b6949]/10 text-[#5b6949]">
                  <Search aria-hidden className="size-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold text-zinc-900">{s.ready.title}</h2>
                <p className="mt-1 max-w-sm text-sm text-zinc-500">{s.ready.body}</p>
                <button type="button" onClick={run} className={cn(BTN_PRIMARY, "mt-5")}>
                  <Search aria-hidden />
                  {s.button}
                </button>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <p className="mb-3 text-[13px] font-medium text-zinc-500 tabular-nums">{s.results.replace("{n}", String(results.length))}</p>
                {results.length === 0 ? (
                  <p className={cn(CARD, "px-6 py-10 text-center text-sm text-zinc-500")}>{s.noResults}</p>
                ) : (
                  <div className="grid items-start gap-4 lg:grid-cols-[1fr_minmax(0,22rem)]">
                    <ul className="space-y-3">
                      {results.map((j, i) => (
                        <JobCard key={j.id} job={j} index={i} active={current?.id === j.id} onSelect={() => setSelected(j.id)} onNavigate={onNavigate} />
                      ))}
                    </ul>
                    {current && <JobDetail job={current} onNavigate={onNavigate} />}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function Stages({ stage }: { stage: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={cn(CARD, "mx-auto max-w-md px-6 py-8")} aria-live="polite">
      <div aria-hidden className="mb-5 h-1.5 overflow-hidden rounded-full bg-zinc-100">
        <motion.div className="h-full rounded-full bg-[#5b6949]" initial={{ width: "4%" }} animate={{ width: `${Math.max(4, (stage / s.stages.length) * 100)}%` }} transition={{ duration: 0.4 }} />
      </div>
      <ol className="space-y-3">
        {s.stages.map((label, i) => {
          const done = i < stage;
          const now = i === stage;
          return (
            <li key={label} className={cn("flex items-center gap-3 text-sm transition-colors", done ? "text-zinc-900" : now ? "font-medium text-zinc-900" : "text-zinc-400")}>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full",
                  done ? "bg-[#5b6949] text-white" : now ? "bg-[#eef4a6] text-[#2f3826]" : "bg-zinc-100 text-zinc-400",
                )}
              >
                {done ? <Check aria-hidden className="size-3.5" strokeWidth={3} /> : now ? <Loader2 aria-hidden className="size-3.5 motion-safe:animate-spin" /> : <span className="size-1.5 rounded-full bg-current" />}
              </span>
              {label}
            </li>
          );
        })}
      </ol>
    </motion.div>
  );
}

function Meta({ job }: { job: DemoJob }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {[job.workplace, job.type, job.level].map((t) => (
        <li key={t} className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-600">
          {t}
        </li>
      ))}
    </ul>
  );
}

function useTailor(job: DemoJob, onNavigate: (s: ScreenId) => void) {
  const { kits, createKit, toast } = useStore();
  return () => {
    if (!kits.some((k) => k.jobId === job.id)) {
      createKit(job.id, { silent: true });
      toast(s.tailorToast.replace("{company}", job.company), job.title);
    }
    onNavigate("hub");
  };
}

function JobCard({ job, index, active, onSelect, onNavigate }: { job: DemoJob; index: number; active: boolean; onSelect: () => void; onNavigate: (s: ScreenId) => void }) {
  const { savedJobIds, toggleSave, toast } = useStore();
  const reduce = useReducedMotion();
  const saved = savedJobIds.includes(job.id);
  const tailor = useTailor(job, onNavigate);
  return (
    <motion.li
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: reduce ? 0 : index * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn(CARD, "relative p-4 transition-shadow", active ? "border-[#5b6949]/40 shadow-md ring-2 ring-[#5b6949]/10" : "hover:shadow-sm")}
    >
      <div className="flex items-start gap-3">
        <CompanyTile initials={job.initials} color={job.color} />
        <div className="min-w-0 flex-1">
          <button type="button" onClick={onSelect} className={cn("cursor-pointer rounded text-left text-[15px] font-semibold text-zinc-900 hover:text-[#5b6949]", FOCUS)}>
            {job.title}
          </button>
          <p className="text-[12.5px] text-zinc-500">
            {job.company} · {job.location}
          </p>
          <Meta job={job} />
          <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11.5px] text-zinc-500">
            <span className="inline-flex items-center gap-1">
              <Clock aria-hidden className="size-3" />
              {job.postedDaysAgo === 0 ? s.posted.today : s.posted.days.replace("{n}", String(job.postedDaysAgo))}
            </span>
            <span className="inline-flex items-center gap-1">
              <Users aria-hidden className="size-3" />
              {s.applicants.replace("{n}", String(job.applicants))}
            </span>
            <span className="inline-flex items-center gap-1">
              <Wallet aria-hidden className="size-3" />
              {job.salary}
            </span>
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            aria-pressed={saved}
            aria-label={saved ? s.saved : s.save}
            onClick={() => {
              toggleSave(job.id);
              if (!saved) toast(s.savedToast, `${job.title}, ${job.company}`);
            }}
            className={cn(
              "flex size-9 cursor-pointer items-center justify-center rounded-xl border transition-colors",
              FOCUS,
              saved ? "border-[#5b6949]/30 bg-[#5b6949]/10 text-[#5b6949]" : "border-zinc-200 text-zinc-500 hover:border-[#5b6949]/30 hover:text-[#5b6949]",
            )}
          >
            {saved ? <BookmarkCheck aria-hidden className="size-4" /> : <Bookmark aria-hidden className="size-4" />}
          </button>
          <button type="button" onClick={tailor} className={cn(BTN_PRIMARY, "h-9 px-3")}>
            <Sparkles aria-hidden />
            {s.tailor}
          </button>
        </div>
      </div>
    </motion.li>
  );
}

function JobDetail({ job, onNavigate }: { job: DemoJob; onNavigate: (s: ScreenId) => void }) {
  const { askWalkthrough } = useStore();
  const tailor = useTailor(job, onNavigate);
  return (
    <aside className={cn(CARD, "hidden p-5 shadow-sm lg:sticky lg:top-4 lg:block")}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={job.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
          <div className="flex items-center gap-3">
            <CompanyTile initials={job.initials} color={job.color} />
            <div className="min-w-0">
              <h2 className="text-[16px] leading-tight font-semibold text-zinc-900">{job.title}</h2>
              <p className="text-[12.5px] text-zinc-500">{job.company}</p>
            </div>
          </div>
          <Meta job={job} />
          <h3 className="mt-5 text-[12px] font-semibold text-zinc-900">{s.description}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{job.summary}</p>
          <h3 className="mt-4 text-[12px] font-semibold text-zinc-900">{s.skills}</h3>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {job.skills.map((k) => (
              <li key={k} className="rounded-full bg-[#eef4a6] px-2 py-0.5 text-[11px] font-medium text-[#2f3826]">
                {k}
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-[12px] font-semibold text-zinc-900">{s.aboutCompany.replace("{company}", job.company)}</h3>
          <p className="mt-1 text-[13px] leading-relaxed text-zinc-600">{job.about}</p>
          <div className="mt-5 flex gap-2">
            <button type="button" onClick={tailor} className={cn(BTN_PRIMARY, "flex-1")}>
              <Sparkles aria-hidden />
              {s.tailor}
            </button>
            <button type="button" onClick={() => askWalkthrough(s.applyNow)} className={cn(BTN_OUTLINE, "flex-1")}>
              {s.applyNow}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </aside>
  );
}
