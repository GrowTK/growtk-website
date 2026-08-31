type Section = { heading: string; body: string[] };

/** Single-column legal document: eyebrow, title, effective date, intro, numbered sections. */
export function LegalDocument({ eyebrow, title, effectiveDate, intro, sections }: {
  eyebrow: string;
  title: string;
  effectiveDate: string;
  intro: string;
  sections: Section[];
}) {
  return (
    <section className="bg-background px-6 py-20 lg:py-28">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-primary">{eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
        <p className="mt-3 font-mono text-xs tracking-wide text-primary">{effectiveDate}</p>
        <p className="mt-8 border-l-2 border-primary pl-5 text-lg leading-relaxed text-muted-foreground">{intro}</p>

        <div className="mt-12 space-y-12 border-t border-border pt-10">
          {sections.map((section, i) => (
            <div key={section.heading} className="flex gap-5">
              <span aria-hidden className="font-mono text-sm font-semibold text-primary/50">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">{section.heading}</h2>
                <div className="mt-3 space-y-3">
                  {section.body.map((p) => (
                    <p key={p.slice(0, 32)} className="text-base leading-relaxed text-muted-foreground">{p}</p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
