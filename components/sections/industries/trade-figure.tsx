"use client";

import { useEffect, useId, useRef, type CSSProperties } from "react";
import { inject } from "@/lib/hairline/styles";
import { cn } from "@/lib/utils";
import { TRADE_FIGURES, drawIn } from "@/components/sections/industries/trade-figures";
import { SERVICE_FIGURES } from "@/components/sections/industries/service-figures";

/**
 * Mounts one Hairline trade figure and draws it in once (see drawIn), then
 * leaves it answering the pointer.
 */
export type CardGradient = { angle: number; from: string; to: string };

const NS = "http://www.w3.org/2000/svg";

/**
 * The card's CSS linear-gradient, rebuilt in the svg's user space, so plates
 * filled with it line up with the card behind them and read as cut-outs.
 * CSS draws the gradient along a line through the box's centre at `angle`,
 * as long as |w sin a| + |h cos a|; an svg linearGradient in user space with
 * the same two end points paints the same bands.
 */
function trackCardGradient(card: HTMLElement, svg: SVGSVGElement, id: string, { angle, from, to }: CardGradient) {
  const lg = document.createElementNS(NS, "linearGradient");
  lg.setAttribute("id", id);
  lg.setAttribute("gradientUnits", "userSpaceOnUse");
  for (const [offset, color] of [["0", from], ["1", to]]) {
    const stop = document.createElementNS(NS, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    lg.appendChild(stop);
  }
  const defs = document.createElementNS(NS, "defs");
  defs.appendChild(lg);
  svg.prepend(defs);

  const a = (angle * Math.PI) / 180, dx = Math.sin(a), dy = -Math.cos(a);
  const sync = () => {
    const c = card.getBoundingClientRect(), r = svg.getBoundingClientRect();
    if (!r.width) return;
    const k = 400 / r.width, half = (Math.abs(c.width * dx) + Math.abs(c.height * dy)) / 2;
    const cx = c.left + c.width / 2 - r.left, cy = c.top + c.height / 2 - r.top;
    lg.setAttribute("x1", String((cx - dx * half) * k));
    lg.setAttribute("y1", String((cy - dy * half) * k));
    lg.setAttribute("x2", String((cx + dx * half) * k));
    lg.setAttribute("y2", String((cy + dy * half) * k));
  };
  sync();
  const ro = new ResizeObserver(sync);
  ro.observe(card);
  ro.observe(svg);
  return () => ro.disconnect();
}

export function TradeFigure({
  name,
  gradient,
  className,
  set = "trade",
}: {
  name: string;
  gradient: CardGradient;
  className?: string;
  /** "trade": one figure per industry (trade-figures.ts). "service": one per kind of service (service-figures.ts). */
  set?: "trade" | "service";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const gradId = "hl-card-" + useId().replace(/[^a-zA-Z0-9-]/g, "");
  const { angle, from, to } = gradient;

  useEffect(() => {
    const el = ref.current, engine = (set === "service" ? SERVICE_FIGURES : TRADE_FIGURES)[name];
    if (!el || !engine) return;
    inject(document);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 400 320");
    svg.setAttribute("aria-hidden", "true");
    el.appendChild(svg);
    const fig = engine({ stage: el, svg, read: { textContent: null } }, 0.5);
    // After the engine: it builds into the svg, and the defs only need to exist somewhere in it.
    const untrack = trackCardGradient(el.parentElement ?? el, svg, gradId, { angle, from, to });
    const stop = drawIn(el, svg);
    return () => { stop(); untrack(); fig.destroy(); svg.remove(); };
  }, [name, set, gradId, angle, from, to]);

  // Charcoal in four weights; plates take the card's own gradient so they read as cut-outs of it.
  const theme = {
    "--hairline-plate": `url(#${gradId}) ${from}`,
    "--hairline-hi": "#1d1d20",
    "--hairline-edge": "rgb(38 38 42 / 0.88)",
    "--hairline-mid": "rgb(38 38 42 / 0.66)",
    "--hairline-lo": "rgb(38 38 42 / 0.36)",
    "--hairline-stroke": "1.1",
  } as CSSProperties;

  return <div ref={ref} data-hairline={name} aria-hidden className={cn("w-full", className)} style={theme} />;
}
