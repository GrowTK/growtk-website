import { Reveal } from "@/components/magic/reveal";
import type { Img } from "@/content/types";

/**
 * Diagonal two tone break: a solid colour panel cut at an angle into a
 * photo, instead of a straight 50/50 split. A geometric, more graphic
 * alternative to the plain split panel CTAs when the page needs a jolt of
 * shape rather than another rectangle.
 */
export function Spotlight04({ eyebrow, title, image }: { eyebrow?: string; title: string; image: Img }) {
  return (
    <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
      <div className="mx-auto grid min-h-[26rem] max-w-7xl lg:grid-cols-2">
        <Reveal className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:py-0">
          {eyebrow ? <p className="eyebrow text-primary-foreground/70">{eyebrow}</p> : null}
          <h2 className="mt-3 max-w-md font-display text-3xl font-bold leading-[1.05] tracking-tight text-balance sm:text-4xl">
            {title}
          </h2>
        </Reveal>
        <div className="relative min-h-64 lg:min-h-0 lg:[clip-path:polygon(8%_0,100%_0,100%_100%,0_100%)]">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
        </div>
      </div>
    </section>
  );
}
