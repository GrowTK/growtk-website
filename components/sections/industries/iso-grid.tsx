"use client";

import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * A hairline isometric grid (2:1 diamonds, the same angle as the Hairline
 * figures) that fades out from the middle. Decorative backing for a figure.
 */
export function IsoGrid({ className, cell = 36 }: { className?: string; cell?: number }) {
  const id = useId().replace(/[^a-zA-Z0-9-]/g, "");
  const h = cell / 2;
  return (
    <svg aria-hidden className={cn("pointer-events-none absolute inset-0 size-full text-[#26262a]", className)}>
      <defs>
        <pattern id={`p${id}`} width={cell} height={h} patternUnits="userSpaceOnUse">
          <path d={`M0 ${h / 2} L${cell / 2} 0 L${cell} ${h / 2} L${cell / 2} ${h} Z`} fill="none" stroke="currentColor" strokeWidth="0.6" opacity="0.22" />
        </pattern>
        <radialGradient id={`g${id}`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id={`m${id}`}>
          <rect width="100%" height="100%" fill={`url(#g${id})`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#p${id})`} mask={`url(#m${id})`} />
    </svg>
  );
}
