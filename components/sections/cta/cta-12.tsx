import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta as CtaLink, Img, SectionHeading } from "@/content/types";

/** Full bleed photo panel with a dark scrim, centered headline, one button. */
export function Cta12({ heading, primary, footnote, image }: {
  heading: SectionHeading; primary?: CtaLink; footnote?: string; image: Img;
}) {
  return (
    <section data-nav-theme="dark" className="relative isolate overflow-hidden py-24 lg:py-36">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 -z-20 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/55 to-black/35" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <Reveal>
          {heading.eyebrow ? <p className="eyebrow text-white/70">{heading.eyebrow}</p> : null}
          <h2 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-white sm:text-6xl lg:text-7xl">{heading.title}</h2>
          {heading.body ? <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">{heading.body}</p> : null}
          {primary ? (
            <a href={primary.href} className="group mt-12 inline-flex cursor-pointer items-center gap-3 rounded-full bg-white px-10 py-5 font-display text-base font-bold tracking-tight text-foreground transition duration-200 ease-out hover:-translate-y-1 hover:shadow-2xl focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none sm:text-lg">
              {primary.label}
              <ArrowRight aria-hidden className="size-5 transition-transform duration-200 ease-out group-hover:translate-x-1" />
            </a>
          ) : null}
          {footnote ? <p className="mt-7 text-xs text-white/70">{footnote}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}
