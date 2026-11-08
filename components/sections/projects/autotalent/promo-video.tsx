"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";
import { autotalentDeck } from "@/content/autotalent";

const v = autotalentDeck.overview.video;

/** Where each floating chip sits around the video, and its tilt. Literal classes so Tailwind keeps them. */
const CHIP_SPOTS = [
  "-top-4 -left-3 -rotate-6 sm:-left-8",
  "top-[22%] -right-3 rotate-3 sm:-right-10",
  "bottom-[18%] -left-3 rotate-2 sm:-left-12",
  "-bottom-4 right-6 -rotate-3",
];

/**
 * The 10 second launch promo, looping muted in a dark frame, with the four
 * documents of an application kit floating around it. Under reduced motion it
 * holds on the end card until someone presses play.
 */
export function PromoVideo() {
  const reduce = useReducedMotion();
  const ref = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Browsers only autoplay muted video, and React does not always reflect `muted` as an attribute.
    el.muted = true;
    if (reduce) {
      el.pause();
      return;
    }
    el.play().catch(() => setPlaying(false));
  }, [reduce]);

  const toggle = () => {
    const el = ref.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  return (
    <figure className="relative w-full max-w-[min(26rem,80vw)]">
      <div className="relative aspect-square overflow-hidden rounded-[28px] bg-[#0a0a0a] shadow-[0_24px_60px_rgba(15,20,10,.45)] ring-1 ring-white/15">
        <video
          ref={ref}
          src={v.src}
          poster={v.poster}
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={v.label}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          className="size-full object-cover"
        />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? v.pause : v.play}
          className="absolute bottom-3 left-3 flex size-10 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-md transition hover:bg-black/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]"
        >
          {playing ? <Pause aria-hidden className="size-4" fill="currentColor" strokeWidth={0} /> : <Play aria-hidden className="size-4" fill="currentColor" strokeWidth={0} />}
        </button>
      </div>
      {autotalentDeck.overview.chips.map((chip, i) => (
        <motion.span
          key={chip}
          aria-hidden
          initial={{ opacity: 0, scale: reduce ? 1 : 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: reduce ? 0 : 0.35 + i * 0.08, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-10 rounded-full bg-[#eef4a6] px-3 py-1.5 text-[12px] font-semibold whitespace-nowrap text-[#1f251a] shadow-[0_8px_20px_rgba(15,20,10,.3)] ${CHIP_SPOTS[i]}`}
        >
          {chip}
        </motion.span>
      ))}
      <figcaption className="mt-8 text-center">
        <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-foreground">{v.caption}</span>
      </figcaption>
    </figure>
  );
}
