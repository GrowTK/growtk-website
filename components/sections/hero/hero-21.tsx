import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Cta, Img } from "@/content/types";

/**
 * Full bleed autoplaying video with zero text on top of it, ever: the design
 * law bans text over a photo behind a scrim, and a video is no different.
 * The copy lives on a solid card that overlaps the video's bottom edge
 * instead, so the footage stays completely uninterrupted (same idea as
 * Hero02's "photo, then a card below it", just with motion in the photo's
 * place).
 */
export function Hero21({ eyebrow, title, body, videoSrc, poster, ctas = [], announcement }: {
  eyebrow?: string; title: string; body: string; videoSrc: string; poster?: Img; ctas?: Cta[]; announcement?: string;
}) {
  return (
    <section className="relative isolate bg-background">
      {announcement ? (
        <div className="border-b border-border bg-muted/40 py-3">
          <p className="mx-auto max-w-7xl px-6 text-center font-mono text-xs tracking-[0.18em] text-muted-foreground uppercase">
            {announcement}
          </p>
        </div>
      ) : null}

      <div className="relative isolate h-screen min-h-[520px] overflow-hidden bg-foreground">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={poster?.src}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>

      <div className="relative z-10 mx-auto -mt-24 max-w-3xl px-6 sm:-mt-28">
        <Reveal>
          <div className="overflow-hidden rounded-md bg-card text-center shadow-2xl">
            <div aria-hidden className="h-1.5 bg-primary" />
            <div className="p-6 sm:p-8">
              {eyebrow ? <p className="eyebrow text-primary">{eyebrow}</p> : null}
              <h1 className="mt-3 font-display text-2xl font-bold leading-[1.05] tracking-tight text-balance text-foreground sm:text-4xl">
                {title}
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">{body}</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {ctas.map((cta, i) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={
                      i === 0
                        ? "group inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    }
                  >
                    {cta.label}
                    {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /> : null}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
