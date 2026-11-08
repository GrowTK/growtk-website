"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { autotalentDeck } from "@/content/autotalent";

const c = autotalentDeck.campaign;
const ADVANCE_MS = 2600;

/**
 * The launch posts fanned like a hand of cards. The front post is upright;
 * the rest tilt away on either side. Tap one to bring it forward. While the
 * deck autoplays, the fan deals itself one post at a time.
 */
export function CampaignFan({ autoplay }: { autoplay: boolean }) {
  const reduce = useReducedMotion();
  const posts = c.posts;
  const count = posts.length;
  const [active, setActive] = React.useState(0);

  React.useEffect(() => {
    if (!autoplay || reduce) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % count), ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [autoplay, reduce, count]);

  const step = (d: number) => setActive((i) => (i + d + count) % count);

  return (
    <div className="flex w-full flex-col items-center">
      <div className="relative h-[clamp(300px,52vh,520px)] w-full" role="group" aria-roledescription="carousel" aria-label={c.eyebrow}>
        {posts.map((post, i) => {
          // Shortest way round the ring, so the fan wraps both ways.
          let offset = i - active;
          if (offset > count / 2) offset -= count;
          if (offset < -count / 2) offset += count;
          const depth = Math.abs(offset);
          const front = offset === 0;
          return (
            <motion.button
              key={post.src}
              type="button"
              onClick={() => setActive(i)}
              aria-label={post.tag}
              aria-current={front ? "true" : undefined}
              tabIndex={depth > 2 ? -1 : 0}
              initial={false}
              animate={{
                x: `${offset * 34 - 50}%`,
                rotate: offset * 7,
                scale: 1 - depth * 0.09,
                opacity: depth > 3 ? 0 : 1 - depth * 0.12,
              }}
              transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 210, damping: 26 }}
              style={{ zIndex: 20 - depth, transformOrigin: "50% 110%" }}
              className={cn(
                "absolute top-0 left-1/2 aspect-[4/5] h-full cursor-pointer overflow-hidden rounded-2xl bg-[#131313] shadow-[0_18px_50px_rgba(0,0,0,.55)] ring-1 transition-[box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]",
                front ? "ring-[#d9f99d]/50" : "ring-white/10",
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- bulk gallery imagery stays on plain lazy img */}
              <img src={post.src} alt={post.alt} width={720} height={900} loading={depth <= 1 ? "eager" : "lazy"} decoding="async" className="size-full object-cover object-top" />
            </motion.button>
          );
        })}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <button
          type="button"
          onClick={() => step(-1)}
          aria-label={c.prev}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]"
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>
        <p className="min-w-40 text-center text-sm font-semibold text-[#d9f99d]" aria-live="polite">
          {posts[active]!.tag}
          <span className="ml-2 font-normal text-white/60 tabular-nums">
            {active + 1}/{count}
          </span>
        </p>
        <button
          type="button"
          onClick={() => step(1)}
          aria-label={c.next}
          className="flex size-9 cursor-pointer items-center justify-center rounded-full border border-white/20 text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d9f99d]"
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
