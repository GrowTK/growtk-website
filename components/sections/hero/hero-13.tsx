import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { Cta, Img } from "@/content/types";

type Badge = { icon?: string; label: string; sublabel?: string };

/**
 * Content left, photo right, bleeding to the full height and the right edge with
 * no padding or radius. The grid is the only thing holding the two apart. An
 * optional floating badge card overlaps the image's bottom-left corner for depth.
 * `accent`, if it appears verbatim inside `title`, renders in the gradient token.
 */
export function Hero13({ eyebrow, title, accent, body, image, ctas = [], bullets = [], badge }: {
  eyebrow?: string; title: string; accent?: string; body: string; image: Img; ctas?: Cta[]; bullets?: string[]; badge?: Badge;
}) {
  const parts = accent && title.includes(accent) ? title.split(accent) : null;

  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2">
        <Reveal className="flex items-center px-6 py-12 pb-28 sm:px-10 sm:py-16 lg:py-24 lg:pb-24 lg:pl-[max(1.5rem,calc((100vw-80rem)/2))]">
          <div className="max-w-xl">
            {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              {parts ? <>{parts[0]}<span className="text-gradient">{accent}</span>{parts[1]}</> : title}
            </h1>
            <p className="mt-5 text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">{body}</p>
            {bullets.length ? (
              <ul className="mt-6 space-y-2 sm:mt-7 sm:space-y-2.5">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm text-foreground">
                    <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {b}
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="mt-8 flex flex-wrap gap-3">
              {ctas.map((cta, i) => (
                <a key={cta.label} href={cta.href} className={i === 0
                  ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                  : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-6 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"}>
                  {cta.label}
                  {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                </a>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Full bleed: no padding, no radius, min height so it never collapses. */}
        <div className="relative">
          <img src={image.src} alt={image.alt} loading="lazy" decoding="async"
            className="h-64 w-full object-cover sm:h-96 lg:h-full lg:min-h-[42rem]" />
          {badge ? (
            <Reveal delay={0.3} className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-card/95 px-5 py-4 shadow-2xl backdrop-blur-sm">
                {badge.icon ? (
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={badge.icon} className="size-5" />
                  </span>
                ) : null}
                <div>
                  <p className="font-display text-sm font-bold tracking-tight text-foreground">{badge.label}</p>
                  {badge.sublabel ? <p className="text-xs text-muted-foreground">{badge.sublabel}</p> : null}
                </div>
              </div>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  );
}
