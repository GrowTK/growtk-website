"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BellRing, Bot, CheckSquare, Link2, Mail, Megaphone, ShieldCheck, Star, Workflow, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { dentavantaDeck } from "@/content/dentavanta";
import type { Project } from "@/content/types";
import type { DeckSlide } from "../project-slides";
import { DentavantaStoreProvider } from "./store";
import { AppFrame, type ScreenId } from "./app-frame";
import { ToothArch } from "./tooth-arch";
import { WebsiteScreen } from "./screen-website";
import { DashboardScreen } from "./screen-dashboard";
import { LeadsScreen } from "./screen-leads";
import { CalendarScreen } from "./screen-calendar";
import { ConversationsScreen } from "./screen-conversations";
import { PatientsScreen } from "./screen-patients";

const MODULE_ICONS: Record<string, LucideIcon> = { Bot, Workflow, Star, Megaphone, BellRing, Link2, CheckSquare, Mail, ShieldCheck };

const SCREENS: ScreenId[] = ["dashboard", "leads", "calendar", "conversations", "patients"];

function Screen({ id, onNavigate }: { id: ScreenId; onNavigate: (s: ScreenId) => void }) {
  switch (id) {
    case "dashboard":
      return <DashboardScreen onNavigate={onNavigate} />;
    case "leads":
      return <LeadsScreen onNavigate={onNavigate} />;
    case "calendar":
      return <CalendarScreen onNavigate={onNavigate} />;
    case "conversations":
      return <ConversationsScreen onNavigate={onNavigate} />;
    case "patients":
      return <PatientsScreen onNavigate={onNavigate} />;
  }
}

function OverviewSlide({ project }: { project: Project }) {
  const o = dentavantaDeck.overview;
  return (
    <div className={cn("absolute inset-0 flex flex-col overflow-y-auto lg:flex-row lg:overflow-hidden", project.thumbnailClassName)}>
      {/* Floating copy card, inset so the brand color frames it on every side. */}
      <div className="m-3 flex flex-col justify-center rounded-[28px] bg-background px-8 py-12 sm:m-4 sm:px-12 lg:my-4 lg:mr-0 lg:w-[52%] lg:shrink-0 lg:overflow-y-auto">
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
        <ul className="mt-8 flex max-w-xl flex-wrap gap-2" aria-label="Tech stack">
          {o.stack.map((item) => (
            <li key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex min-h-[620px] flex-1 flex-col items-center justify-center gap-4 overflow-hidden px-6 pt-28 pb-24 sm:px-10 lg:pt-12">
        {/* Interactive tooth chart: each pair of teeth is one growth module. */}
        <ToothArch />
        <p className="shrink-0 rounded-full bg-white px-3 py-1 text-center text-xs font-medium text-foreground">{o.arch.hint}</p>
        {/* The photo floats in the open top corner, framed in white, clear of the arch. */}
        <div className="absolute top-6 left-6 aspect-square w-24 -rotate-3 overflow-hidden rounded-2xl shadow-[0_18px_40px_rgba(0,0,0,.25)] ring-4 ring-white sm:w-28">
          <Image src={o.image.src} alt={o.image.alt} fill sizes="8rem" quality={75} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function PlatformSlide({ project }: { project: Project }) {
  const p = dentavantaDeck.platform;
  const [featured, ...rest] = p.modules;
  const FeaturedIcon = MODULE_ICONS[featured!.icon]!;
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
        {/* 4 columns: the featured card takes one column over three rows, the other 8 fill 3 x 3 with the last spanning two. */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* White on #0636a6 clears 9:1, so the copy sits right on the brand fill. */}
          <div className={cn("relative flex min-h-80 flex-col overflow-hidden rounded-3xl p-6 text-white sm:row-span-2 lg:row-span-3", project.thumbnailClassName)}>
            <FeaturedIcon aria-hidden className="size-8" strokeWidth={1.6} />
            <h3 className="mt-6 font-display text-2xl leading-tight font-bold">{featured!.title}</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-white">{featured!.body}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- decorative product mark, keeps the next/image budget for photos */}
            <img src={dentavantaDeck.logo.markWhite} alt="" aria-hidden className="pointer-events-none absolute -right-6 -bottom-8 h-40 w-auto opacity-15" />
          </div>
          {rest.map((m, i) => {
            const Icon = MODULE_ICONS[m.icon]!;
            return (
              <div key={m.title} className={cn("flex gap-3 rounded-3xl bg-muted p-5", i === rest.length - 1 && "lg:col-span-2")}>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background" style={{ color: project.accentHex }}>
                  <Icon aria-hidden className="size-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[15px] font-semibold text-foreground">{m.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{m.body}</p>
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
  const c = dentavantaDeck.closing;
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-y-auto p-6", project.thumbnailClassName)}>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <Image src={project.logo.src} alt={project.logo.alt} width={240} height={50} className="w-48 object-contain sm:w-56" />
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

/**
 * Every Dentavanta slide after the cover. The clinic website comes first so a
 * request sent there can be followed through the app; the five product
 * slides share one live app frame (group "app"), and one store spans both.
 */
export function dentavantaSlides(project: Project): DeckSlide[] {
  const s = dentavantaDeck.slides;
  return [
    { ...s.overview, tone: "brand", render: () => <OverviewSlide project={project} /> },
    { ...s.website, tone: "app", group: "site", duration: 18000, render: ({ go }) => <WebsiteScreen onSeeLead={() => go("leads")} /> },
    ...SCREENS.map(
      (screen): DeckSlide => ({
        ...s[screen],
        tone: "app",
        group: "app",
        render: ({ go }) => (
          <AppFrame screen={screen} onNavigate={(next) => go(next)}>
            <Screen id={screen} onNavigate={(next) => go(next)} />
          </AppFrame>
        ),
      }),
    ),
    { ...s.platform, tone: "brand", surface: "light", render: () => <PlatformSlide project={project} /> },
    { ...s.closing, tone: "brand", render: () => <ClosingSlide project={project} /> },
  ];
}

export const DentavantaProvider = DentavantaStoreProvider;
export const dentavantaCover = dentavantaDeck.slides.cover;
