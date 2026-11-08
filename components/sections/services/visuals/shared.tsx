"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/** Live flag: true only while on screen and motion is allowed. */
export function useLive() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-10% 0px" });
  const reduce = useReducedMotion() ?? false;
  return { ref, live: inView && !reduce, shown: inView || reduce, reduce };
}

/** A counter that ticks every `ms` while live. */
export function useTick(live: boolean, ms: number) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setN((v) => v + 1), ms);
    return () => clearInterval(t);
  }, [live, ms]);
  return n;
}

export const EASE = [0.22, 1, 0.36, 1] as const;

export const TONE = {
  yellow: "bg-[#FFDE59]",
  peach: "bg-[#FFBA7B]",
  lilac: "bg-[#F2C4FF]",
  mint: "bg-[#9FE3B4]",
  sky: "bg-[#A6D2FF]",
  soft: "bg-[#26262a]/[0.06]",
} as const;

/** The white window every visual sits in, matching the solution product mocks. */
export function VisualWindow({
  title,
  label,
  children,
  className,
  right,
  innerRef,
  bodyClassName,
}: {
  title: string;
  label: string;
  children: ReactNode;
  className?: string;
  right?: ReactNode;
  innerRef?: React.Ref<HTMLDivElement>;
  bodyClassName?: string;
}) {
  return (
    <div ref={innerRef} className={cn("relative w-full", className)}>
      <span className="sr-only">{label}</span>
      <div aria-hidden className="overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_30px_80px_-30px_rgb(38_38_42/0.35)]">
        <div className="flex items-center gap-2 border-b border-black/[0.06] px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#FFDE59]" />
          <span className="size-2.5 rounded-full bg-[#FFBA7B]" />
          <span className="size-2.5 rounded-full bg-[#F2C4FF]" />
          <span className="ml-3 truncate text-xs font-semibold text-[#26262a]/70">{title}</span>
          {right ? <span className="ml-auto shrink-0">{right}</span> : null}
        </div>
        <div className={cn("p-4 sm:p-5", bodyClassName)}>{children}</div>
      </div>
    </div>
  );
}

export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn("relative inline-flex size-2", className)}>
      <span className="absolute inset-0 rounded-full bg-[#9FE3B4] motion-safe:animate-ping" />
      <span className="relative size-2 rounded-full bg-[#5CC985]" />
    </span>
  );
}
