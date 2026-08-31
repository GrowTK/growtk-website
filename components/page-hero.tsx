import { ArrowRight } from "lucide-react";
import type { Cta, Img, SectionHeading } from "@/content/types";

/** Full bleed photo hero for an inner page: blurred dark scrim, white text on top. */
export function PageHero({ heading, image, ctas = [], footnote }: {
  heading: SectionHeading;
  image: Img;
  ctas?: Cta[];
  footnote?: string;
}) {
  return (
    <section data-nav-theme="dark" className="relative isolate flex min-h-[calc(100vh-92px)] items-center overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={image.src} alt={image.alt} className="absolute inset-0 -z-20 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/75 via-black/55 to-black/40 backdrop-blur-md" />

      <div className="relative mx-auto w-full max-w-3xl px-6 py-20 text-center">
        {heading.eyebrow ? <p className="eyebrow text-white/70">{heading.eyebrow}</p> : null}
        <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-white sm:text-6xl">
          {heading.title}
        </h1>
        {heading.body ? (
          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/85">{heading.body}</p>
        ) : null}
        {ctas.length ? (
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta, i) => (
              <a
                key={cta.label}
                href={cta.href}
                className={
                  i === 0 || cta.variant === "primary"
                    ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                    : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                }
              >
                {cta.label}
                {(i === 0 || cta.variant === "primary") && (
                  <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                )}
              </a>
            ))}
          </div>
        ) : null}
        {footnote ? <p className="mt-5 text-xs text-white/70">{footnote}</p> : null}
      </div>
    </section>
  );
}
