"use client";

import * as React from "react";
import { Pause, Play } from "lucide-react";
import type { SectionHeading } from "@/content/types";
import { Reveal } from "@/components/magic/reveal";

const POINTS = 10;

/** Catmull-Rom through a closed ring of points, converted to a smooth cubic bezier path. */
function blobPath(points: [number, number][]) {
  const n = points.length;
  let d = "";
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    if (i === 0) d += `M ${p1[0]} ${p1[1]} `;
    d += `C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]} `;
  }
  return d + "Z";
}

/**
 * Bespoke: one voice-style blob, ElevenLabs' voice-picker effect. A looping
 * video (converted from the source gif) is clipped into a circle whose
 * outline itself keeps organically morphing via an animated clip-path, not
 * just a static circle. Pass `audioSrc` once a real recording exists and the
 * button plays it alongside the loop; until then it's a harmless no-op.
 */
export function VoiceBlob({
  videoSrc,
  poster,
  title,
  subtitle,
  audioSrc,
}: {
  videoSrc: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  audioSrc?: string;
}) {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const clipRef = React.useRef<HTMLDivElement>(null);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const sizeRef = React.useRef({ w: 320, h: 320 });
  const rafRef = React.useRef<number | null>(null);
  const tRef = React.useRef(0);

  const [isPlaying, setIsPlaying] = React.useState(false);

  // Track the box's real rendered size so path coordinates line up with clip-path's own box.
  React.useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) sizeRef.current = { w: width, h: height };
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The blob outline keeps morphing continuously, independent of play state.
  React.useEffect(() => {
    const tick = () => {
      tRef.current += 0.045;
      const t = tRef.current;

      const { w, h } = sizeRef.current;
      const cx = w / 2;
      const cy = h / 2;
      const baseR = Math.min(w, h) * 0.4;
      const wobble = Math.min(w, h) * 0.09;

      const pts: [number, number][] = [];
      for (let i = 0; i < POINTS; i++) {
        const angle = (i / POINTS) * Math.PI * 2;
        const n =
          0.6 * Math.sin(angle * 3 + t * 1.6) +
          0.4 * Math.sin(angle * 5 - t * 1.1) +
          0.3 * Math.sin(angle * 2 + t * 2.4 + i);
        const r = baseR + n * wobble;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      const path = blobPath(pts);

      if (clipRef.current) clipRef.current.style.clipPath = `path('${path}')`;

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const toggle = () => {
    if (!audioSrc) {
      setIsPlaying((p) => !p);
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying((p) => !p);
  };

  return (
    <Reveal className="flex flex-col items-center">
      {audioSrc ? <audio ref={audioRef} src={audioSrc} onEnded={() => setIsPlaying(false)} className="hidden" /> : null}

      <div ref={boxRef} className="relative size-80 sm:size-96 lg:size-112">
        <div ref={clipRef} className="absolute inset-0 size-full">
          <video
            src={videoSrc}
            poster={poster}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 size-full object-cover blur-[3px]"
          />
        </div>

        <button
          type="button"
          onClick={toggle}
          aria-label={isPlaying ? `Pause ${title ?? "preview"}` : `Play ${title ?? "preview"}`}
          className="absolute inset-0 m-auto grid size-16 cursor-pointer place-items-center rounded-full border border-black/10 bg-white text-foreground transition duration-200 ease-out hover:bg-accent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isPlaying ? (
            <Pause aria-hidden className="size-6" fill="currentColor" />
          ) : (
            <Play aria-hidden className="size-6 translate-x-0.5" fill="currentColor" />
          )}
        </button>
      </div>

      {title ? <p className="mt-6 font-display text-base font-semibold text-foreground">{title}</p> : null}
      {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
    </Reveal>
  );
}

/** Heading plus a single centered VoiceBlob. */
export function FeatureVoiceBlob({
  heading,
  ...blob
}: {
  heading?: SectionHeading;
  videoSrc: string;
  poster?: string;
  title?: string;
  subtitle?: string;
  audioSrc?: string;
}) {
  return (
    <section className="bg-background py-10 lg:py-14">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-14 flex justify-center">
          <VoiceBlob {...blob} />
        </div>
      </div>
    </section>
  );
}
