import { cn } from "@/lib/utils";
import type { IndustryTone } from "@/components/sections/industries/industry-tones";

/**
 * The brand's gradient washes (the same images the home "How we work" cards
 * use) plus the blob animation, as backgrounds for the company pages. Each
 * comes with a matching tone: its accent colours, for chips, dots and number
 * badges that sit on white next to it. Pages mix several, so no page is one
 * colour end to end.
 */
export type WashName = "lilac" | "peach" | "apricot" | "sunset" | "blob";

export const WASHES: Record<WashName, { src: string; poster?: string; video?: boolean; tone: IndustryTone }> = {
  lilac: { src: "/brand/industry-4.webp", tone: { angle: 150, from: "#C9BCFF", to: "#B4D3FF", glow: "#D9CCFF" } },
  peach: { src: "/brand/industry-5.webp", tone: { angle: 150, from: "#F8B4A2", to: "#F6D6B8", glow: "#FAC6B6" } },
  apricot: { src: "/brand/industry-6.webp", tone: { angle: 150, from: "#FFAE78", to: "#F8D6B4", glow: "#FFC59C" } },
  sunset: { src: "/brand/industry-7.webp", tone: { angle: 150, from: "#FF9A62", to: "#FFC995", glow: "#FFB27F" } },
  blob: { src: "/brand/blob-animation.mp4", poster: "/brand/blob-poster.jpg", video: true, tone: { angle: 150, from: "#EE9CBB", to: "#F6C79A", glow: "#F4B3C9" } },
};

export const washTone = (name: WashName) => WASHES[name].tone;

/** Fills its parent (which must be `relative isolate overflow-hidden`) with one wash. Decorative. */
export function Wash({ name, className }: { name: WashName; className?: string }) {
  const w = WASHES[name];
  const cls = cn("pointer-events-none absolute inset-0 -z-10 size-full object-cover", className);
  if (w.video) {
    return (
      <video autoPlay muted loop playsInline aria-hidden poster={w.poster} className={cls}>
        <source src={w.src} type="video/mp4" />
      </video>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={w.src} alt="" aria-hidden loading="lazy" decoding="async" className={cls} />;
}
