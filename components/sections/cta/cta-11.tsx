import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Cta as CtaLink, Img, SectionHeading } from "@/content/types";

/**
 * Cta03's split panel, but the whole section sits on a full bleed photo
 * backdrop instead of the plain page background: the card floats on top of
 * it with a real shadow for depth, and the backdrop peeks through the
 * padding around the card. No scrim over the backdrop, since there is no
 * text sitting on it, only the opaque card.
 *
 * `blurBackdrop`: turn this on when the source photo is busy or high
 * contrast enough to fight with the card instead of receding behind it.
 * The slight scale-up hides the blurred edge halo; leave both off by
 * default so every existing usage renders unchanged.
 */
export function Cta11({ heading, primary, secondary, image, backdrop, points = [], footnote, blurBackdrop = false }: {
  heading: SectionHeading; primary?: CtaLink; secondary?: CtaLink; image?: Img; backdrop: Img; points?: string[]; footnote?: string; blurBackdrop?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden py-24 lg:py-32">
      <img
        src={backdrop.src}
        alt=""
        aria-hidden
        loading="lazy"
        decoding="async"
        className={cn("absolute inset-0 -z-10 size-full object-cover", blurBackdrop && "scale-110 blur-md")}
      />
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl shadow-2xl lg:grid-cols-2">
            <div className="order-2 bg-card p-10 sm:p-14 lg:order-1">
              {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-balance text-foreground sm:text-4xl">{heading.title}</h2>
              {heading.body ? <p className="mt-4 text-base leading-relaxed text-muted-foreground">{heading.body}</p> : null}
              {points.length ? (
                <ul className="mt-7 space-y-3">
                  {points.map((p) => (
                    <li key={p} className="flex items-start gap-3 text-sm leading-relaxed text-foreground">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              ) : null}
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {primary ? (
                  <a href={primary.href} className="group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none">
                    {primary.label}
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1" />
                  </a>
                ) : null}
                {secondary ? (
                  <a href={secondary.href} className="inline-flex cursor-pointer items-center text-sm font-semibold text-foreground underline-offset-4 transition duration-200 ease-out hover:text-primary hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none">
                    {secondary.label}
                  </a>
                ) : null}
              </div>
              {footnote ? <p className="mt-6 text-xs text-muted-foreground">{footnote}</p> : null}
            </div>
            {image ? (
              <div className="order-1 min-h-64 bg-muted lg:order-2">
                <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="size-full object-cover" />
              </div>
            ) : null}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
