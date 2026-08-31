import { ArrowRight } from "lucide-react";
import type { Cta, Img } from "@/content/types";

/**
 * Full bleed photo with a solid caption bar directly beneath it, a museum
 * plaque rather than text laid over the image. Same "photo has its own
 * area, words have theirs" rule as Hero02, shrunk to a single line.
 */
export function Spotlight03({ image, caption, cta }: { image: Img; caption: string; cta?: Cta }) {
  return (
    <section className="bg-background">
      <div className="h-[52vh] min-h-80 w-full overflow-hidden">
        <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
      </div>
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-6">
          <p className="max-w-2xl text-lg leading-relaxed text-balance text-foreground">{caption}</p>
          {cta ? (
            <a
              href={cta.href}
              className="group inline-flex shrink-0 cursor-pointer items-center gap-1.5 text-sm font-semibold text-primary transition-colors duration-200 ease-out hover:text-primary/80 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              {cta.label}
              <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
