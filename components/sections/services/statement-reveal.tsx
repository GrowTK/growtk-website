"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";

/**
 * The problem statement: one large paragraph whose words ink in from pale to
 * charcoal as it scrolls through the viewport. Under reduced motion every word
 * is simply solid.
 */
export function StatementReveal({ eyebrow, text }: { eyebrow: string; text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const words = text.split(" ");

  return (
    <section className="bg-background px-6 py-24 sm:px-10 lg:py-36">
      <div className="mx-auto max-w-4xl text-center">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <p ref={ref} className="mt-6 font-display text-3xl font-semibold leading-[1.2] tracking-tight text-balance text-foreground sm:text-4xl lg:text-[2.75rem]">
          {reduce
            ? text
            : words.map((w, i) => (
                <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
                  {w}
                </Word>
              ))}
        </p>
      </div>
    </section>
  );
}

function Word({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.18, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block whitespace-pre">
      {children}{" "}
    </motion.span>
  );
}
