import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { IsoGrid } from "@/components/sections/industries/iso-grid";
import { ToneBackdrop } from "@/components/sections/industries/tone-backdrop";
import { toneGradient, type IndustryTone } from "@/components/sections/industries/industry-tones";
import type { Cta, SectionHeading } from "@/content/types";

/**
 * Bespoke inner-page hero in the home hero's shape: the trade's tone with
 * glow and grain as the backdrop, a white panel on it, copy on the left and a
 * Hairline figure over an isometric hairline grid on the right.
 */
export function IndustryHero({ heading, ctas = [], tone, figure, backdrop }: {
  heading: SectionHeading;
  ctas?: Cta[];
  tone: IndustryTone;
  figure: ReactNode;
  /** Replaces the tone gradient behind the white panel (e.g. a Wash). */
  backdrop?: ReactNode;
}) {
  return (
    <section
      data-nav-theme="light"
      className="relative isolate flex min-h-[calc(100vh-92px)] flex-col overflow-hidden"
      style={backdrop ? undefined : { backgroundImage: toneGradient(tone) }}
    >
      {backdrop ?? <ToneBackdrop tone={tone} />}
      <div className="relative mx-auto flex w-full max-w-7xl flex-1 items-stretch px-6 py-10 sm:px-10">
        <div className="flex w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl lg:flex-row">
          <div className="flex flex-1 flex-col justify-center p-8 sm:p-10 lg:p-14">
            {heading.eyebrow ? <p className="eyebrow text-[#26262a]/70">{heading.eyebrow}</p> : null}
            <h1 className="mt-4 font-display text-4xl font-bold leading-[1.02] tracking-tight text-balance text-[#26262a] sm:text-5xl lg:text-6xl">
              {heading.title}
            </h1>
            {heading.body ? <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">{heading.body}</p> : null}
            {ctas.length ? (
              <div className="mt-9 flex flex-wrap items-center gap-4">
                {ctas.map((cta, i) => (
                  <a
                    key={cta.label}
                    href={cta.href}
                    className={
                      i === 0
                        ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-[#26262a] px-7 py-4 text-sm font-semibold text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2 focus-visible:outline-none"
                        : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-border px-7 py-4 text-sm font-semibold text-[#26262a] transition-colors duration-200 hover:bg-accent focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:outline-none"
                    }
                  >
                    {cta.label}
                    {i === 0 ? <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" /> : null}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
          <div className="relative flex min-h-[22rem] flex-1 items-center justify-center p-6 lg:p-10">
            <IsoGrid />
            <div className="relative w-full max-w-xl">{figure}</div>
          </div>
        </div>
      </div>
    </section>
  );
}
