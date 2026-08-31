import { Reveal } from "@/components/magic/reveal";

type LegalSection = { heading: string; body: string[] };

/** Shared shape for a plain, text-first legal page: Terms, Privacy. */
export function LegalPage({ title, effectiveDate, intro, sections }: {
  title: string;
  effectiveDate: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="eyebrow text-primary">{effectiveDate}</p>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{intro}</p>
        </Reveal>

        <div className="mt-14 space-y-10 border-t border-border pt-10">
          {sections.map((s, i) => (
            <Reveal key={s.heading} delay={Math.min(i * 0.03, 0.3)}>
              <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">{s.heading}</h2>
              <div className="mt-3 space-y-3">
                {s.body.map((p) => (
                  <p key={p.slice(0, 32)} className="text-base leading-relaxed text-muted-foreground">{p}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
