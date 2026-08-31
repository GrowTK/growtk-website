import { Play } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import type { Img, SectionHeading } from "@/content/types";

export type BlobItem = { image: Img; title: string; subtitle?: string };

/**
 * Bespoke: a row of circular "blob" previews, ElevenLabs voice-picker style.
 * Each one is a sharp circular photo sitting over its own blurred, oversized
 * glow of the same image, with a hover ring and a centered play button.
 * No stock block in this library does a soft blurred-glow circular preview,
 * so this is authored specifically for that pattern.
 */
export function FeatureBlob({ heading, items }: { heading?: SectionHeading; items: BlobItem[] }) {
  if (items.length === 0) return null;

  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <RevealGroup className="mt-14 flex flex-wrap justify-center gap-x-10 gap-y-12">
          {items.map((item) => (
            <RevealItem key={item.title} className="flex flex-col items-center">
              <div className="group relative size-40 sm:size-48 lg:size-52">
                {/* Blurred, oversized glow of the same image bleeding past the circle's edge. */}
                <div
                  aria-hidden
                  className="absolute inset-0 scale-125 rounded-full opacity-70 blur-2xl"
                  style={{ backgroundImage: `url(${item.image.src})`, backgroundSize: "cover", backgroundPosition: "center" }}
                />

                <div className="relative size-full overflow-hidden rounded-full ring-1 ring-black/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image.src} alt={item.image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-1 scale-[0.985] rounded-full border-4 border-white/70 opacity-0 transition duration-200 group-hover:scale-100 group-hover:opacity-100"
                  />
                </div>

                <button
                  type="button"
                  aria-label={`Preview ${item.title}`}
                  className="absolute inset-0 m-auto grid size-14 cursor-pointer place-items-center rounded-full bg-white text-foreground shadow-[0_0_1px_rgba(0,0,0,0.4),0_1px_1px_rgba(0,0,0,0.04),0_2px_4px_rgba(0,0,0,0.1)] transition duration-200 ease-out hover:bg-accent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <Play aria-hidden className="size-5 translate-x-0.5" fill="currentColor" />
                </button>
              </div>

              <p className="mt-5 font-display text-sm font-semibold text-foreground">{item.title}</p>
              {item.subtitle ? <p className="mt-1 text-xs text-muted-foreground">{item.subtitle}</p> : null}
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
