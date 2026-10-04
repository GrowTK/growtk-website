import { cn } from "@/lib/utils";
import { Icon } from "@/components/sections/icon";
import { Reveal } from "@/components/magic/reveal";
import { Wash, washTone, type WashName } from "@/components/sections/company/wash";
import type { Feature, SectionHeading } from "@/content/types";

/** Cell sizes and surfaces for the four values, in order: wide tone (beside the heading), then three white cells. */
const CELLS: { span: string; surface: "tone" | "card" | "dark"; wash: WashName }[] = [
  { span: "lg:col-span-2", surface: "tone", wash: "sunset" },
  { span: "", surface: "card", wash: "peach" },
  { span: "", surface: "card", wash: "lilac" },
  { span: "", surface: "card", wash: "apricot" },
];

/**
 * The working standards as a bento: heading and lead on the left of the first
 * row, then four cells of different weight so the most important standard
 * (saving real hours) leads on the sunset wash, and each cell has its own accent.
 */
export function AboutValues({ heading, lead, values }: {
  heading: SectionHeading;
  lead?: string;
  values: Feature[];
}) {
  return (
    <section className="bg-background pt-24 lg:pt-36">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-4 lg:grid-cols-3">
          <Reveal className="flex flex-col justify-end pb-2 lg:pr-8">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            <h2 className="mt-3 font-display text-4xl leading-[1.05] font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            {lead ? <p className="mt-5 text-base leading-relaxed text-muted-foreground">{lead}</p> : null}
          </Reveal>

          {values.map((v, i) => {
              const cell = CELLS[i % CELLS.length]!;
              const dark = cell.surface === "dark";
              const tone = washTone(cell.wash);
              return (
                <Reveal key={v.title} delay={i * 0.07} className={cell.span}>
                  <article
                    className={cn(
                      "relative isolate flex h-full min-h-64 flex-col justify-between gap-10 overflow-hidden rounded-md p-7 sm:p-8",
                      cell.surface === "card" && "border border-border bg-card",
                      dark && "bg-[#26262a] text-white",
                    )}
                  >
                    {cell.surface === "tone" ? <Wash name={cell.wash} /> : null}
                    <div className="flex items-start justify-between">
                      <span
                        className={cn("flex size-12 items-center justify-center rounded-md", dark ? "text-[#26262a]" : cell.surface === "tone" ? "bg-card text-foreground" : "text-foreground")}
                        style={cell.surface === "tone" ? undefined : { backgroundColor: tone.from }}
                      >
                        <Icon name={v.icon} className="size-6" strokeWidth={1.75} />
                      </span>
                      <span className={cn("font-mono text-xs font-medium tabular-nums", dark ? "text-white/50" : "text-foreground/50")}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div>
                      <h3 className={cn("font-display font-bold tracking-tight text-balance", cell.span ? "text-3xl" : "text-2xl", dark ? "text-white" : "text-foreground")}>{v.title}</h3>
                      <p className={cn("mt-3 max-w-xl text-base leading-relaxed", dark ? "text-white/75" : cell.surface === "tone" ? "text-foreground/80" : "text-muted-foreground")}>{v.body}</p>
                    </div>
                  </article>
                </Reveal>
              );
            })}
        </div>
      </div>
    </section>
  );
}
