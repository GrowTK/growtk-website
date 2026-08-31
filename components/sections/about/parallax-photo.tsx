"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * A little scroll-linked depth: each corner photo drifts a few pixels up or
 * down as the About section passes through view, at its own `speed`, rather
 * than sitting perfectly static. Disabled under prefers-reduced-motion.
 */
export function ParallaxPhoto({
  src,
  alt,
  className,
  speed = 1,
}: {
  src: string;
  alt: string;
  className?: string;
  /** Relative drift amount. 1 = ~24px of travel across the section. */
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const range = reduce ? 0 : 24 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [-range, range]);

  return (
    <motion.div ref={ref} style={{ y }} aria-hidden className={className}>
      <img src={src} alt={alt} loading="lazy" decoding="async" className="size-full object-cover" />
      <span aria-hidden className="absolute -top-3 -right-3 size-9 rotate-45 bg-background" />
    </motion.div>
  );
}
