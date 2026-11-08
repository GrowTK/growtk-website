"use client";

import * as React from "react";
import { ViewTransition } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, LayoutList, Pause, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";
import { corvinnCover, corvinnSlides, CorvinnProvider } from "./corvinn/corvinn-deck";
import { yettiCover, yettiSlides, YettiProvider } from "./yetti/yetti-deck";
import { jerrysCover, jerrysSlides, JerrysProvider } from "./jerrys/jerrys-deck";
import { umrCover, umrSlides, UmrProvider } from "./umr/umr-deck";
import { autotalentCover, autotalentSlides, AutotalentProvider } from "./autotalent/autotalent-deck";
import { dentavantaCover, dentavantaSlides, DentavantaProvider } from "./dentavanta/dentavanta-deck";
import { ContentsDrawer } from "./contents-drawer";

export type DeckApi = {
  go: (id: string) => void;
  /** Move by a number of slides (clamped), for keys pressed inside an embedded deck. */
  step: (delta: number) => void;
  /** Whether autoplay is running, and a way to stop it once the viewer starts exploring. */
  autoplay: boolean;
  pause: () => void;
};

/**
 * One slide in a project deck. `tone` drives the nav styling: "brand" slides
 * get the frosted glass buttons over the card, "app" slides are live product
 * replicas, so their nav moves to the chrome row and stays out of the UI.
 * Slides that share a `group` share one mounted wrapper, so a product's app
 * shell (sidebar, state) persists while its screens change.
 */
export type DeckSlide = {
  id: string;
  title: string;
  hint?: string;
  /** One line for the slide's row in the contents drawer. */
  summary?: string;
  /** Screenshot used as the slide's thumbnail in the contents drawer. */
  thumb?: string;
  tone: "brand" | "app";
  /** "light" when the slide's own background is white, so the glass nav buttons switch to dark. */
  surface?: "light";
  group?: string;
  /** Autoplay time on this slide in ms. 0 stops autoplay here. Defaults by tone, see AUTOPLAY_MS. */
  duration?: number;
  render: (api: DeckApi) => React.ReactNode;
};

/** Project-specific decks. A project without one gets the cover plus a plain overview. */
const DECKS: Record<
  string,
  { slides: (project: Project) => DeckSlide[]; Provider: React.ComponentType<{ children: React.ReactNode }>; cover?: { summary?: string; thumb?: string } }
> = {
  corvinn: { slides: corvinnSlides, Provider: CorvinnProvider, cover: corvinnCover },
  yetti: { slides: yettiSlides, Provider: YettiProvider, cover: yettiCover },
  jerrys: { slides: jerrysSlides, Provider: JerrysProvider, cover: jerrysCover },
  umr: { slides: umrSlides, Provider: UmrProvider, cover: umrCover },
  autotalent: { slides: autotalentSlides, Provider: AutotalentProvider, cover: autotalentCover },
  dentavanta: { slides: dentavantaSlides, Provider: DentavantaProvider, cover: dentavantaCover },
};

/** Default autoplay time per slide when a slide sets no `duration`. App slides get longer, there is more to watch. */
const AUTOPLAY_MS = { cover: 6000, brand: 10000, app: 15000 };

function PassThrough({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function defaultSlides(project: Project): DeckSlide[] {
  return [
    {
      id: "overview",
      title: "Overview",
      tone: "brand",
      render: () => (
        <div className="absolute inset-0 flex flex-col sm:flex-row">
          <div className="flex flex-1 flex-col justify-center bg-background px-8 py-12 sm:px-14">
            <p className="eyebrow" style={{ color: project.accentHex }}>
              Overview
            </p>
            <h2 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{project.name}</h2>
            <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{project.description}</p>
          </div>
          <div className={cn("flex flex-1 items-center justify-center sm:-ml-px", project.thumbnailClassName)}>
            <Image
              src={project.logo.src}
              alt={project.logo.alt}
              width={200}
              height={56}
              className={cn("object-contain", project.logoShape === "square" ? "h-2/5 max-h-56 w-auto" : "w-2/5 max-w-55")}
            />
          </div>
        </div>
      ),
    },
  ];
}

/** Traffic-light window controls. The red dot is also the back button. */
function WindowControls() {
  return (
    <Link href="/#work" aria-label="Back to all work" className="group flex cursor-pointer items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4">
      <span className="size-3 rounded-full bg-[#FF5F57] transition group-hover:brightness-110" />
      <span className="size-3 rounded-full bg-[#FEBC2E]" />
      <span className="size-3 rounded-full bg-[#28C840]" />
    </Link>
  );
}

/** Round, frosted glass icon button for the slide nav and the mobile menu trigger. */
function GlassButton({ children, onClick, disabled, label, dark }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; label: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        "flex size-11 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md transition duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-0",
        dark ? "border-white/15 bg-black/70 text-white hover:bg-black/80" : "border-white/30 bg-white/20 text-white hover:bg-white/30",
      )}
    >
      {children}
    </button>
  );
}

/** Small chrome-row arrow for the desktop deck nav. */
function ChromeArrow({ onClick, disabled, label, children }: { onClick: () => void; disabled: boolean; label: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex size-8 cursor-pointer items-center justify-center rounded-full text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Play or pause autoplay. `glass` is the round mobile variant that sits beside the menu button. */
function AutoplayButton({ on, onToggle, accent, glass, dark }: { on: boolean; onToggle: () => void; accent: string; glass?: boolean; dark?: boolean }) {
  const Icon = on ? Pause : Play;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={on ? "Pause autoplay" : "Play autoplay"}
      aria-pressed={on}
      className={cn(
        "flex cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-none focus-visible:ring-2",
        glass
          ? cn("size-10 border backdrop-blur-md focus-visible:ring-white", dark ? "border-black/10 bg-black/70 text-white" : "border-white/30 bg-white/20 text-white")
          : "size-8 hover:bg-accent focus-visible:ring-ring",
      )}
      style={!glass && on ? { color: accent } : undefined}
    >
      <Icon aria-hidden className={glass ? "size-4" : "size-3.5"} fill="currentColor" strokeWidth={0} />
    </button>
  );
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null;
  return !!el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) || !!el.closest("[role=menu],[role=dialog]"));
}

export function ProjectSlides({ project }: { project: Project }) {
  const deck = DECKS[project.slug];
  const Provider = deck?.Provider ?? PassThrough;

  const slides = React.useMemo<DeckSlide[]>(
    () => [
      {
        id: "cover",
        title: project.name,
        summary: deck?.cover?.summary,
        thumb: deck?.cover?.thumb,
        tone: "brand",
        render: () => (
          <div className="absolute inset-0 flex items-center justify-center">
            <Image
              src={project.logo.src}
              alt={project.logo.alt}
              width={420}
              height={118}
              priority
              className={cn("object-contain", project.logoShape === "square" ? "h-2/5 max-h-80 w-auto" : "w-1/3 max-w-md")}
            />
          </div>
        ),
      },
      ...(deck ? deck.slides(project) : defaultSlides(project)),
    ],
    [deck, project],
  );

  const [index, setIndex] = React.useState(0);
  const [direction, setDirection] = React.useState(0);
  const [contentsOpen, setContentsOpen] = React.useState(false);
  const closeContents = React.useCallback(() => setContentsOpen(false), []);
  const reduce = useReducedMotion();
  const slide = slides[index]!;
  const last = slides.length - 1;

  const goTo = React.useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(last, next));
      setIndex((current) => {
        if (clamped !== current) setDirection(clamped > current ? 1 : -1);
        return clamped;
      });
    },
    [last],
  );
  const goId = React.useCallback((id: string) => goTo(slides.findIndex((s) => s.id === id)), [goTo, slides]);

  // Autoplay: each slide runs for its duration, shown as a progress bar along the top of the window.
  // Clicking or dragging inside a slide means the viewer is exploring, so it pauses.
  const [autoplay, setAutoplay] = React.useState(true);
  const pause = React.useCallback(() => setAutoplay(false), []);
  const step = React.useCallback((delta: number) => setIndex((current) => {
    const next = Math.max(0, Math.min(last, current + delta));
    if (next !== current) setDirection(next > current ? 1 : -1);
    return next;
  }), [last]);
  const duration = index === last ? 0 : (slide.duration ?? (index === 0 ? AUTOPLAY_MS.cover : AUTOPLAY_MS[slide.tone]));
  const fillRef = React.useRef<HTMLSpanElement>(null);
  const elapsed = React.useRef(0);
  React.useEffect(() => {
    elapsed.current = 0;
  }, [index]);
  React.useEffect(() => {
    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      // Capped so a background tab or a long frame never skips a slide.
      if (autoplay && duration && !contentsOpen && !document.hidden) elapsed.current += Math.min(100, now - prev);
      prev = now;
      if (fillRef.current) fillRef.current.style.width = duration ? `${Math.min(100, (elapsed.current / duration) * 100)}%` : "0%";
      if (autoplay && duration && elapsed.current >= duration) {
        elapsed.current = 0;
        goTo(index + 1);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoplay, duration, contentsOpen, goTo, index]);
  const api = React.useMemo<DeckApi>(() => ({ go: goId, step, autoplay, pause }), [goId, step, autoplay, pause]);

  // Deep links: /work/corvinn#dispatch opens straight on that slide.
  React.useEffect(() => {
    const fromHash = () => {
      const at = slides.findIndex((s) => s.id === window.location.hash.slice(1));
      if (at > 0) setIndex(at);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [slides]);
  React.useEffect(() => {
    const hash = index === 0 ? "" : `#${slide.id}`;
    if (window.location.hash !== hash) window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}${hash}`);
  }, [index, slide.id]);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") goTo(index + 1);
      if (e.key === "ArrowLeft" || e.key === "PageUp") goTo(index - 1);
      if (e.key === "Home") goTo(0);
      if (e.key === "End") goTo(last);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, goTo, last]);

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir > 0 ? 48 : -48 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const } },
    exit: (dir: number) => ({ opacity: 0, x: reduce ? 0 : dir > 0 ? -48 : 48, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } }),
  };

  const isApp = slide.tone === "app";

  return (
    <Provider>
      <div className="flex h-dvh flex-col bg-background p-0 sm:px-3 sm:pt-4 sm:pb-3">
        {/* Autoplay progress along the very top, in the project's colour. Grey while paused, hidden on the last slide. */}
        <div
          aria-hidden
          className={cn("fixed inset-x-0 top-0 z-[60] h-1 transition-opacity duration-300", !duration && "opacity-0")}
          style={{ backgroundColor: `${project.accentHex}1f` }}
        >
          <span
            ref={fillRef}
            className="block h-full w-0 transition-colors duration-300"
            style={autoplay ? { backgroundColor: project.accentHex, boxShadow: `0 0 10px ${project.accentHex}8c` } : { backgroundColor: "var(--muted-foreground)" }}
          />
        </div>

        {/* Desktop chrome row, lives in the white gap above the card. */}
        <div className="hidden shrink-0 items-center gap-6 px-3 pb-3 sm:flex">
          <div className="flex flex-1 items-center">
            <WindowControls />
          </div>
          <div className="min-w-0 text-center">
            <p className="truncate font-display text-sm font-medium tracking-wide text-foreground">
              {project.name}
              {index > 0 && <span className="text-muted-foreground"> / {slide.title}</span>}
            </p>
            {slide.hint && <p className="truncate text-xs text-muted-foreground">{slide.hint}</p>}
          </div>
          <div className="flex flex-1 items-center justify-end gap-4">
            <div className="flex items-center gap-1">
              <ChromeArrow label="Previous slide" onClick={() => goTo(index - 1)} disabled={index === 0}>
                <ArrowLeft aria-hidden className="size-4" />
              </ChromeArrow>
              <AutoplayButton on={autoplay} onToggle={() => setAutoplay((on) => !on)} accent={project.accentHex} />
              {/* Contents: opens the slide drawer. Counter plus a progress track. */}
              <button
                type="button"
                onClick={() => setContentsOpen(true)}
                aria-label={`Slide ${index + 1} of ${slides.length}. Open contents`}
                aria-haspopup="dialog"
                aria-expanded={contentsOpen}
                className="group mx-1 flex h-9 cursor-pointer items-center gap-2.5 rounded-full border border-border bg-card pr-3.5 pl-2 shadow-sm transition hover:border-foreground/20 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span className="flex size-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: project.accentHex }}>
                  <LayoutList aria-hidden className="size-3.5" />
                </span>
                <span className="flex flex-col items-start gap-1">
                  <span className="text-xs leading-none font-semibold text-foreground tabular-nums" aria-live="polite">
                    {String(index + 1).padStart(2, "0")}
                    <span className="font-normal text-muted-foreground"> / {String(slides.length).padStart(2, "0")}</span>
                  </span>
                  <span aria-hidden className="h-0.5 w-14 overflow-hidden rounded-full bg-muted">
                    <span
                      className="block h-full rounded-full transition-[width] duration-300 ease-out"
                      style={{ width: `${((index + 1) / slides.length) * 100}%`, backgroundColor: project.accentHex }}
                    />
                  </span>
                </span>
                <span className="text-xs font-medium text-muted-foreground transition group-hover:text-foreground">Contents</span>
              </button>
              <ChromeArrow label="Next slide" onClick={() => goTo(index + 1)} disabled={index === last}>
                <ArrowRight aria-hidden className="size-4" />
              </ChromeArrow>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo-black.png" alt="Growtk" className="h-5 w-auto" />
          </div>
        </div>

        {/* Mobile chrome: just a menu trigger, no gap, no margin. */}
        <button
          type="button"
          onClick={() => setContentsOpen(true)}
          aria-label="Open contents"
          className={cn(
            "absolute top-3 left-3 z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border backdrop-blur-md sm:hidden",
            isApp ? "border-black/10 bg-black/70 text-white" : "border-white/30 bg-white/20 text-white",
          )}
        >
          <LayoutList aria-hidden className="size-5" />
        </button>
        <div className="absolute top-3 left-15 z-40 sm:hidden">
          <AutoplayButton glass dark={isApp} on={autoplay} onToggle={() => setAutoplay((on) => !on)} accent={project.accentHex} />
        </div>

        <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
          <div
            onPointerDownCapture={(e) => {
              if (e.isTrusted && !(e.target as HTMLElement).closest("[data-deck-nav]")) pause();
            }}
            className={cn("relative flex flex-1 overflow-hidden rounded-none sm:rounded-3xl", slide.surface === "light" ? "bg-background" : project.thumbnailClassName)}
          >
            <AnimatePresence custom={direction} mode="wait" initial={false}>
              <motion.div
                key={slide.group ?? slide.id}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                {slide.render(api)}
              </motion.div>
            </AnimatePresence>

            {/* Brand slides: glass prev/next over the card, bottom right. */}
            {!isApp && (
              <div data-deck-nav className="absolute right-6 bottom-6 z-20 flex items-center gap-3 sm:right-8 sm:bottom-8">
                <GlassButton dark={slide.surface === "light"} label="Previous slide" onClick={() => goTo(index - 1)} disabled={index === 0}>
                  <ArrowLeft aria-hidden className="size-5" />
                </GlassButton>
                <GlassButton dark={slide.surface === "light"} label="Next slide" onClick={() => goTo(index + 1)} disabled={index === last}>
                  <ArrowRight aria-hidden className="size-5" />
                </GlassButton>
              </div>
            )}
            {/* App slides on phones: a dark pill that stays legible over the UI. */}
            {isApp && (
              <div data-deck-nav className="absolute bottom-4 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-2 sm:hidden">
                <GlassButton dark label="Previous slide" onClick={() => goTo(index - 1)} disabled={index === 0}>
                  <ArrowLeft aria-hidden className="size-5" />
                </GlassButton>
                <GlassButton dark label="Next slide" onClick={() => goTo(index + 1)} disabled={index === last}>
                  <ArrowRight aria-hidden className="size-5" />
                </GlassButton>
              </div>
            )}
          </div>
        </ViewTransition>

        <ContentsDrawer open={contentsOpen} onClose={closeContents} items={slides} index={index} onSelect={goTo} project={project} />
      </div>
    </Provider>
  );
}
