"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowRight, BarChart3, Briefcase, Check, Cpu, CreditCard, FileSignature, FileText, Languages, Mail, Rocket, Wand2, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck, type ScreenId } from "@/content/autotalent";
import type { Project } from "@/content/types";
import type { DeckSlide } from "../project-slides";
import { AutotalentStoreProvider } from "./store";
import { AppFrame } from "./app-frame";
import { PromoVideo } from "./promo-video";
import { CampaignFan } from "./campaign-fan";
import { AgentScreen } from "./screen-agent";
import { HubScreen } from "./screen-hub";
import { SearchScreen } from "./screen-search";
import { ResumeScreen } from "./screen-resume";

const MODULE_ICONS: Record<string, LucideIcon> = { FileText, FileSignature, Mail, Briefcase, Cpu, CreditCard, Wand2, BarChart3, Rocket, Languages };

const SCREENS: ScreenId[] = ["agent", "hub", "search", "resume"];

function Screen({ id, onNavigate, autoplay }: { id: ScreenId; onNavigate: (s: ScreenId) => void; autoplay: boolean }) {
  switch (id) {
    case "agent":
      return <AgentScreen onNavigate={onNavigate} autoplay={autoplay} />;
    case "hub":
      return <HubScreen onNavigate={onNavigate} autoplay={autoplay} />;
    case "search":
      return <SearchScreen onNavigate={onNavigate} autoplay={autoplay} />;
    case "resume":
      return <ResumeScreen onNavigate={onNavigate} autoplay={autoplay} />;
  }
}

function OverviewSlide({ project }: { project: Project }) {
  const o = autotalentDeck.overview;
  return (
    <div className={cn("absolute inset-0 flex flex-col overflow-y-auto lg:flex-row lg:overflow-hidden", project.thumbnailClassName)}>
      {/* Floating copy card, inset so the brand color frames it on every side. */}
      <div className="m-3 flex flex-col justify-center rounded-[28px] bg-background px-8 py-12 sm:m-4 sm:px-12 lg:my-4 lg:mr-0 lg:w-[54%] lg:shrink-0 lg:overflow-y-auto">
        <p className="eyebrow" style={{ color: project.accentHex }}>
          {o.eyebrow}
        </p>
        <h2 className="mt-4 max-w-xl font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{o.title}</h2>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">{o.body}</p>
        <dl className="mt-8 grid max-w-xl gap-x-8 gap-y-5 sm:grid-cols-2">
          {o.facts.map((f) => (
            <div key={f.label}>
              <dt className="text-xs font-medium text-muted-foreground">{f.label}</dt>
              <dd className="mt-1 text-[15px] leading-snug font-medium text-foreground">{f.value}</dd>
            </div>
          ))}
        </dl>
        <ul className="mt-8 flex max-w-xl flex-wrap gap-2" aria-label={o.stackLabel}>
          {o.stack.map((item) => (
            <li key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex min-h-[620px] flex-1 items-center justify-center overflow-hidden px-8 pt-20 pb-28 sm:px-14 lg:pt-10 lg:pb-16">
        {/* Soft lime glow behind the promo, the posts' own lighting. */}
        <div aria-hidden className="absolute top-1/2 left-1/2 size-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(217,249,157,.22),transparent_62%)]" />
        <PromoVideo />
      </div>
    </div>
  );
}

function CampaignSlide({ autoplay }: { autoplay: boolean }) {
  const c = autotalentDeck.campaign;
  return (
    <div className="absolute inset-0 overflow-x-hidden overflow-y-auto bg-[#0a0a0a] text-white">
      <div aria-hidden className="pointer-events-none absolute -top-40 right-0 size-[40rem] rounded-full bg-[radial-gradient(circle,rgba(163,230,53,.14),transparent_65%)]" />
      <div className="relative mx-auto flex min-h-full max-w-7xl flex-col items-center gap-10 px-8 pt-20 pb-28 sm:px-14 lg:flex-row lg:gap-6 lg:py-14">
        <div className="relative z-10 max-w-md shrink-0 lg:w-[36%]">
          <p className="eyebrow text-[#d9f99d]">{c.eyebrow}</p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl">{c.title}</h2>
          <p className="mt-5 text-base leading-relaxed text-white/80 sm:text-lg">{c.body}</p>
          <ul className="mt-7 space-y-2.5">
            {c.points.map((p) => (
              <li key={p} className="flex items-center gap-2.5 text-[15px] text-white/90">
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#a3e635] text-[#0a0a0a]">
                  <Check aria-hidden className="size-3" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-7 text-sm text-white/60">{c.hint}</p>
        </div>
        {/* The fan stays in its own column: clipped at the sides and faded in, so it never runs under the copy. */}
        <div className="w-full min-w-0 flex-1 overflow-x-clip lg:[mask-image:linear-gradient(to_right,transparent,#000_10%,#000_92%,transparent)]">
          <CampaignFan autoplay={autoplay} />
        </div>
      </div>
    </div>
  );
}

/** The featured bento card: the same line in all three app languages, Arabic flipped right to left. */
function LanguageCard({ className }: { className?: string }) {
  const f = autotalentDeck.platform.featured;
  const Icon = MODULE_ICONS[f.icon]!;
  const reduce = useReducedMotion();
  const [lang, setLang] = React.useState(0);
  const sample = f.sample[lang]!;
  return (
    <div className={cn("relative flex min-h-80 flex-col overflow-hidden rounded-3xl p-6 text-white sm:row-span-2", className)}>
      <Icon aria-hidden className="size-8" strokeWidth={1.6} />
      <h3 className="mt-6 font-display text-2xl leading-tight font-bold">{f.title}</h3>
      <p className="mt-3 text-[15px] leading-relaxed text-white/90">{f.body}</p>
      <div className="mt-auto pt-6">
        <div className="flex gap-1 rounded-full bg-white/10 p-1" role="tablist" aria-label={f.title}>
          {f.sample.map((s, i) => (
            <button
              key={s.code}
              type="button"
              role="tab"
              aria-selected={lang === i}
              onClick={() => setLang(i)}
              className={cn(
                "flex-1 cursor-pointer rounded-full py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eef4a6]",
                lang === i ? "bg-[#eef4a6] text-[#1f251a]" : "text-white hover:bg-white/10",
              )}
            >
              {s.code}
            </button>
          ))}
        </div>
        <div className="mt-3 min-h-28 rounded-2xl bg-white p-4 text-foreground">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={sample.code}
              dir={sample.dir}
              initial={{ opacity: 0, x: reduce ? 0 : sample.dir === "rtl" ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className="text-xs font-medium text-muted-foreground">{sample.label}</p>
              <p className="mt-1 text-[15px] leading-snug font-semibold">{sample.line}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function PlatformSlide({ project }: { project: Project }) {
  const p = autotalentDeck.platform;
  return (
    <div className="absolute inset-0 overflow-y-auto bg-background">
      <div className="mx-auto flex min-h-full max-w-6xl flex-col justify-center gap-10 px-8 py-16 sm:px-14">
        <div className="max-w-2xl">
          <p className="eyebrow" style={{ color: project.accentHex }}>
            {p.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl">{p.title}</h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">{p.body}</p>
        </div>
        {/* 4 columns on laptops: the featured card takes 2 cells, 8 modules 1 each, the last 2, so 12 cells fill 3 full rows (and 6 rows of 2 on tablets). */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <LanguageCard className={project.thumbnailClassName} />
          {p.modules.map((m, i) => {
            const Icon = MODULE_ICONS[m.icon]!;
            return (
              <div key={m.title} className={cn("flex gap-3 rounded-3xl bg-muted p-5", i === p.modules.length - 1 && "sm:col-span-2")}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background" style={{ color: project.accentHex }}>
                  <Icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/75">{m.body}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ClosingSlide({ project }: { project: Project }) {
  const c = autotalentDeck.closing;
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-y-auto p-6", project.thumbnailClassName)}>
      <div className="flex w-full max-w-2xl flex-col items-center gap-6 text-center">
        <Image src={project.logo.src} alt={project.logo.alt} width={160} height={156} sizes="9rem" quality={80} className="size-28 object-contain sm:size-36" />
        <div className="w-full rounded-3xl bg-background px-8 py-12 sm:px-14">
          <p className="eyebrow" style={{ color: project.accentHex }}>
            {c.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{c.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={c.primary.href}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {c.primary.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href={c.secondary.href}
              className="inline-flex cursor-pointer items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {c.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Every AutoTalent slide after the cover. The four product slides share one live app frame (group "app"). */
export function autotalentSlides(project: Project): DeckSlide[] {
  const s = autotalentDeck.slides;
  return [
    { ...s.overview, tone: "brand", render: () => <OverviewSlide project={project} /> },
    ...SCREENS.map(
      (screen): DeckSlide => ({
        ...s[screen],
        tone: "app",
        group: "app",
        render: ({ go, autoplay }) => (
          <AppFrame screen={screen} onNavigate={(next) => go(next)}>
            <Screen id={screen} onNavigate={(next) => go(next)} autoplay={autoplay} />
          </AppFrame>
        ),
      }),
    ),
    { ...s.campaign, tone: "brand", render: ({ autoplay }) => <CampaignSlide autoplay={autoplay} /> },
    { ...s.platform, tone: "brand", surface: "light", render: () => <PlatformSlide project={project} /> },
    { ...s.closing, tone: "brand", render: () => <ClosingSlide project={project} /> },
  ];
}

export const AutotalentProvider = AutotalentStoreProvider;
export const autotalentCover = autotalentDeck.slides.cover;
