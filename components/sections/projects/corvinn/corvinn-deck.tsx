"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Code2,
  FileCheck,
  Palette,
  PhoneCall,
  Receipt,
  Repeat,
  Smartphone,
  Sparkles,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { corvinnDeck } from "@/content/corvinn";
import type { Project } from "@/content/types";
import type { DeckSlide } from "../project-slides";
import { CorvinnStoreProvider } from "./store";
import { AppFrame, type ScreenId } from "./app-frame";
import { DashboardScreen } from "./screen-dashboard";
import { JobsScreen } from "./screen-jobs";
import { DispatchScreen } from "./screen-dispatch";
import { CustomersScreen } from "./screen-customers";
import { InventoryScreen } from "./screen-inventory";
import { AutomationsScreen } from "./screen-automations";
import { HvacHairline } from "./hvac-hairline";

const MODULE_ICONS: Record<string, LucideIcon> = { Smartphone, Repeat, FileCheck, Receipt, BarChart3, Wallet, Palette, Code2, Sparkles, PhoneCall };

const SCREENS: ScreenId[] = ["dashboard", "jobs", "dispatch", "customers", "inventory", "automations"];

function Screen({ id, onNavigate }: { id: ScreenId; onNavigate: (s: ScreenId) => void }) {
  switch (id) {
    case "dashboard":
      return <DashboardScreen onNavigate={onNavigate} />;
    case "jobs":
      return <JobsScreen />;
    case "dispatch":
      return <DispatchScreen />;
    case "customers":
      return <CustomersScreen />;
    case "inventory":
      return <InventoryScreen />;
    case "automations":
      return <AutomationsScreen />;
  }
}

function OverviewSlide({ project }: { project: Project }) {
  const o = corvinnDeck.overview;
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
        <ul className="mt-8 flex max-w-xl flex-wrap gap-2" aria-label="Tech stack">
          {o.stack.map((item) => (
            <li key={item} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative flex min-h-[560px] flex-1 flex-col items-center gap-4 overflow-hidden p-8 sm:p-10">
        <Image src={project.logo.src} alt={project.logo.alt} width={200} height={56} className="mt-2 w-2/5 max-w-48 shrink-0 object-contain sm:mt-10" />
        {/* Interactive hairline blueprint of the install the product schedules. */}
        <div className="flex min-h-0 w-full flex-1 items-center justify-center">
          <HvacHairline className="aspect-square h-full max-h-[620px] w-auto max-w-full text-white/90" />
        </div>
        <p className="shrink-0 rounded-full bg-white px-3 py-1 text-center text-xs font-medium text-foreground">{o.blueprint.hint}</p>
        {/* The photo floats in the open top corner, framed in white, clear of the drawing. */}
        <div className="absolute top-6 left-6 aspect-square w-24 -rotate-3 overflow-hidden rounded-2xl ring-4 ring-white shadow-[0_18px_40px_rgba(0,0,0,.2)] sm:w-32">
          <Image src={o.image.src} alt={o.image.alt} fill sizes="10rem" quality={75} className="object-cover" />
        </div>
      </div>
    </div>
  );
}

function PlatformSlide({ project }: { project: Project }) {
  const p = corvinnDeck.platform;
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className={cn("flex flex-col justify-between gap-10 rounded-3xl p-6 text-white sm:row-span-2", project.thumbnailClassName)}>
            <FeaturedIcon aria-hidden className="size-8" strokeWidth={1.6} />
            <div>
              <h3 className="font-display text-2xl leading-tight font-bold">{featured!.title}</h3>
              {/* White on the coral brand fill is under 4.5:1, so the body copy sits on its own light chip. */}
              <p className="mt-3 rounded-2xl bg-white p-4 text-[15px] leading-relaxed text-foreground">{featured!.body}</p>
            </div>
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
  const c = corvinnDeck.closing;
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-y-auto p-6", project.thumbnailClassName)}>
      <div className="flex w-full max-w-2xl flex-col items-center gap-8 text-center">
        <Image src={project.logo.src} alt={project.logo.alt} width={200} height={56} className="w-40 object-contain" />
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

/** Every Corvinn slide after the cover. The six product slides share one live app frame (group "app"). */
export function corvinnSlides(project: Project): DeckSlide[] {
  const s = corvinnDeck.slides;
  return [
    { ...s.overview, tone: "brand", render: () => <OverviewSlide project={project} /> },
    ...SCREENS.map(
      (screen): DeckSlide => ({
        ...s[screen],
        tone: "app",
        group: "app",
        render: ({ go }) => (
          <AppFrame screen={screen} primary={project.accentHex} onNavigate={(next) => go(next)}>
            <Screen id={screen} onNavigate={(next) => go(next)} />
          </AppFrame>
        ),
      }),
    ),
    { ...s.platform, tone: "brand", surface: "light", render: () => <PlatformSlide project={project} /> },
    { ...s.closing, tone: "brand", render: () => <ClosingSlide project={project} /> },
  ];
}

export const CorvinnProvider = CorvinnStoreProvider;
export const corvinnCover = corvinnDeck.slides.cover;
