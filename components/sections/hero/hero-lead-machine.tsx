"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { inject } from "@/lib/hairline/styles";
import { cn } from "@/lib/utils";
import { drawIn } from "@/components/sections/industries/trade-figures";
import { HERO_VIEWBOX, mountLeadMachine } from "@/components/sections/hero/lead-machine";

/** The hero's portrait Hairline figure: drawn in once, then always running. */
export function HeroLeadMachine({ label, className }: { label: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    inject(document);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", `0 0 ${HERO_VIEWBOX.w} ${HERO_VIEWBOX.h}`);
    svg.setAttribute("aria-hidden", "true");
    el.appendChild(svg);
    const destroy = mountLeadMachine(el, svg);
    const stop = drawIn(el, svg);
    return () => { stop(); destroy(); svg.remove(); };
  }, []);

  const theme = {
    aspectRatio: "auto",
    "--hairline-plate": "#ffffff",
    "--hairline-hi": "#1d1d20",
    "--hairline-edge": "rgb(38 38 42 / 0.88)",
    "--hairline-mid": "rgb(38 38 42 / 0.62)",
    "--hairline-lo": "rgb(38 38 42 / 0.32)",
    "--hairline-stroke": "1.1",
  } as CSSProperties;

  return <div ref={ref} data-hairline="lead-machine" role="img" aria-label={label} className={cn("size-full", className)} style={theme} />;
}
