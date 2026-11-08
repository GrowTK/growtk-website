"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export const EASE = [0.22, 1, 0.36, 1] as const;

export const TINT = {
  yellow: "bg-[#FFDE59]/70",
  peach: "bg-[#FFBA7B]/70",
  lilac: "bg-[#F2C4FF]/70",
  mint: "bg-[#9FE3B4]/70",
  sky: "bg-[#A6D2FF]/70",
  rose: "bg-[#FFB3C7]/70",
  lime: "bg-[#D6EE72]/70",
  neutral: "bg-[#26262a]/[0.07]",
} as const;
export type Tint = keyof typeof TINT;

/**
 * A step clock for the looping scenes. While the visual is on screen it
 * counts 0..count-1 every `ms` and loops; off screen it holds; under reduced
 * motion it sits on the last step so the full scene shows, still.
 */
export function useScene(count: number, ms = 1600) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion() ?? false;
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduce || !inView) return;
    const t = setTimeout(() => setStep((s) => (s + 1) % count), step === count - 1 ? ms * 2 : ms);
    return () => clearTimeout(t);
  }, [step, inView, reduce, count, ms]);

  return { ref, step: reduce ? count - 1 : step, reduce, live: inView && !reduce };
}

/** The white app window every visual sits in: three pastel dots and a title. */
export function VisualWindow({
  title,
  label,
  children,
  className,
  sceneRef,
  aside,
}: {
  title: string;
  label: string;
  children: ReactNode;
  className?: string;
  sceneRef?: React.Ref<HTMLDivElement>;
  aside?: ReactNode;
}) {
  return (
    <div ref={sceneRef} className={cn("relative w-full min-w-0", className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_30px_80px_-30px_rgb(38_38_42/0.35)]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FFDE59]" />
          <span className="size-2.5 rounded-full bg-[#FFBA7B]" />
          <span className="size-2.5 rounded-full bg-[#F2C4FF]" />
          <span className="ml-3 min-w-0 truncate text-xs font-semibold text-[#26262a]/70">{title}</span>
          {aside ? <span className="ml-auto shrink-0">{aside}</span> : null}
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

/** Chat bubble. `me` sits right in charcoal; the agent sits left on a tint. */
export function Bubble({ children, me = false, className }: { children: ReactNode; me?: boolean; className?: string }) {
  return (
    <div
      className={cn(
        "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[12.5px] leading-snug",
        me ? "ml-auto rounded-br-md bg-[#26262a] text-white" : "rounded-bl-md bg-[#26262a]/[0.05] text-[#26262a]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Three bouncing dots while the agent "types". */
export function Typing() {
  return (
    <div className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-[#26262a]/[0.05] px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-[#26262a]/40 motion-safe:animate-bounce"
          style={{ animationDelay: `${i * 120}ms`, animationDuration: "900ms" }}
        />
      ))}
    </div>
  );
}
