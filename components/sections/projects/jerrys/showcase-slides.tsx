"use client";

import * as React from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { jerrysAnybody } from "@/lib/project-fonts";
import { jerrysDeck } from "@/content/jerrys";
import type { Project } from "@/content/types";

/** Jerry's own palette, from jerrys-website/src/app/globals.css. */
const J = { red: "#e1251b", deep: "#b8160f", cream: "#fff8ec", butter: "#fbe9c9", ink: "#22140f", soft: "#6b5048" };

/** The display face at the website's compressed width. */
const DISPLAY: React.CSSProperties = { fontFamily: "var(--font-jerrys-display), sans-serif", fontWeight: 900, fontStretch: "60%", letterSpacing: "-0.01em" };

const KEYFRAMES = `
@keyframes jerrys-scroll { 0%, 8% { transform: translateY(0) } 92%, 100% { transform: translateY(var(--jerrys-dist)) } }
@keyframes jerrys-marquee { from { transform: translateY(0) } to { transform: translateY(-50%) } }
.jerrys-shot:hover .jerrys-scroll, .jerrys-shot:focus-within .jerrys-scroll { animation-play-state: paused }
@media (prefers-reduced-motion: reduce) { .jerrys-scroll, .jerrys-marquee { animation: none !important } }
`;

/**
 * A full-page screenshot that pans top to bottom and back inside its frame.
 * The pan distance is measured, so it works at any frame size. Hover pauses it.
 */
function ScrollingShot({ src, alt, width, height, seconds, className }: { src: string; alt: string; width: number; height: number; seconds: number; className?: string }) {
  const frame = React.useRef<HTMLDivElement>(null);
  const [dist, setDist] = React.useState(0);
  React.useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const measure = () => setDist(Math.max(0, el.clientWidth * (height / width) - el.clientHeight));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width, height]);
  return (
    <div ref={frame} className={cn("jerrys-shot relative overflow-hidden", className)}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a 5000px tall pan, outside next/image's per-page budget */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        draggable={false}
        className="jerrys-scroll block h-auto w-full select-none"
        style={{ "--jerrys-dist": `-${dist}px`, animation: dist ? `jerrys-scroll ${seconds}s ease-in-out infinite alternate` : undefined } as React.CSSProperties}
      />
    </div>
  );
}

export function WebsiteSlide({ project }: { project: Project }) {
  const w = jerrysDeck.website;
  return (
    <div className={cn(jerrysAnybody.variable, "absolute inset-0 flex flex-col overflow-y-auto lg:flex-row lg:overflow-hidden")} style={{ background: J.red }}>
      <style>{KEYFRAMES}</style>
      {/* Copy card, inset on the brand red like the overview. */}
      <div className="m-3 flex flex-col justify-center rounded-[28px] px-8 py-10 sm:m-4 sm:px-12 lg:my-4 lg:mr-0 lg:w-[42%] lg:shrink-0 lg:overflow-y-auto" style={{ background: J.cream, color: J.ink }}>
        <p className="eyebrow" style={{ color: project.accentHex }}>
          {w.eyebrow}
        </p>
        <h2 className="mt-4 max-w-md text-5xl leading-[0.92] text-balance sm:text-6xl" style={DISPLAY}>
          {w.title}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: J.soft }}>
          {w.body}
        </p>
        <ul className="mt-6 grid max-w-md gap-2.5">
          {w.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-[15px] leading-snug font-medium">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full text-white" style={{ background: J.red }}>
                <Check aria-hidden className="size-3" strokeWidth={3} />
              </span>
              {f}
            </li>
          ))}
        </ul>
        <a
          href={w.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex w-fit cursor-pointer items-center gap-2 rounded-full px-5 py-3 text-sm font-bold text-white transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ background: J.ink }}
        >
          {w.visit}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>

      {/* The real site: desktop in a browser window, the phone overlapping its corner. */}
      <div className="relative flex min-h-[620px] flex-1 items-center justify-center px-5 py-10 sm:px-10 lg:min-h-0">
        <div className="relative w-full max-w-3xl">
          <div className="overflow-hidden rounded-2xl bg-white shadow-[0_40px_80px_-30px_rgba(60,0,0,.55)] ring-1 ring-black/10">
            <div className="flex items-center gap-3 border-b border-zinc-200 bg-zinc-50 px-4 py-2.5">
              <span className="flex gap-1.5" aria-hidden>
                <span className="size-2.5 rounded-full bg-[#FF5F57]" />
                <span className="size-2.5 rounded-full bg-[#FEBC2E]" />
                <span className="size-2.5 rounded-full bg-[#28C840]" />
              </span>
              <span className="flex-1 truncate rounded-md bg-white px-3 py-1 text-center text-xs font-medium text-zinc-500 ring-1 ring-zinc-200">{w.urlLabel}</span>
            </div>
            <ScrollingShot {...w.desktop} seconds={38} className="aspect-[16/10]" />
          </div>
          <div className="absolute -right-2 -bottom-10 w-[26%] min-w-28 rounded-[28px] bg-zinc-900 p-1.5 shadow-[0_30px_60px_-20px_rgba(0,0,0,.6)] sm:-right-6">
            <ScrollingShot {...w.mobile} seconds={30} className="aspect-[9/19] rounded-[22px]" />
          </div>
        </div>
      </div>
    </div>
  );
}

type Post = { src: string; alt: string };

/** One column of the post gallery, doubled so the loop is seamless. */
function PostColumn({ posts, reverse, seconds }: { posts: Post[]; reverse?: boolean; seconds: number }) {
  return (
    <div className="relative h-full min-w-0 flex-1 overflow-hidden">
      <ul
        className="jerrys-marquee flex flex-col gap-4 pb-4"
        style={{ animation: `jerrys-marquee ${seconds}s linear infinite${reverse ? " reverse" : ""}` }}
      >
        {[...posts, ...posts].map((p, i) => (
          <li key={i} aria-hidden={i >= posts.length} className="overflow-hidden rounded-2xl shadow-[0_18px_40px_-18px_rgba(60,0,0,.45)] ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element -- bulk gallery, plain lazy img by site rule */}
            <img src={p.src} alt={i >= posts.length ? "" : p.alt} width={720} height={720} loading="lazy" decoding="async" className="block aspect-square w-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrandSlide({ project }: { project: Project }) {
  const b = jerrysDeck.brand;
  const left = b.posts.filter((_, i) => i % 2 === 0);
  const right = b.posts.filter((_, i) => i % 2 === 1);
  return (
    <div className={cn(jerrysAnybody.variable, "absolute inset-0 flex flex-col overflow-y-auto lg:flex-row lg:overflow-hidden")} style={{ background: J.cream, color: J.ink }}>
      <style>{KEYFRAMES}</style>
      <div className="flex flex-col justify-center px-8 py-12 sm:px-14 lg:w-[46%] lg:shrink-0">
        <p className="eyebrow" style={{ color: project.accentHex }}>
          {b.eyebrow}
        </p>
        <h2 className="mt-4 max-w-lg text-5xl leading-[0.92] text-balance sm:text-6xl" style={DISPLAY}>
          {b.title}
        </h2>
        <p className="mt-5 max-w-md text-base leading-relaxed" style={{ color: J.soft }}>
          {b.body}
        </p>
        <ul className="mt-6 flex max-w-md flex-wrap gap-2">
          {b.points.map((pt) => (
            <li key={pt} className="rounded-full px-3 py-1.5 text-xs font-bold" style={{ background: J.butter }}>
              {pt}
            </li>
          ))}
        </ul>
        <div className="mt-8 max-w-md overflow-hidden rounded-2xl ring-1 ring-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- decorative strip, kept off the next/image budget */}
          <img src={b.hero.src} alt={b.hero.alt} width={1600} height={900} loading="lazy" decoding="async" className="block aspect-[16/7] w-full object-cover" />
        </div>
        <p className="mt-3 text-sm font-bold" style={{ color: J.red }}>
          {b.handle}
        </p>
      </div>
      {/* Two columns of real posts drifting in opposite directions. */}
      <div className="relative flex h-[640px] gap-4 overflow-hidden px-6 lg:h-auto lg:flex-1 lg:py-0 lg:pr-24">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20" style={{ background: `linear-gradient(${J.cream}, transparent)` }} />
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20" style={{ background: `linear-gradient(transparent, ${J.cream})` }} />
        <PostColumn posts={left} seconds={34} />
        <PostColumn posts={right} seconds={40} reverse />
      </div>
    </div>
  );
}
