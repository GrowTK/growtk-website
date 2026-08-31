import { Check, X } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/magic/reveal";
import { Icon } from "@/components/sections/icon";
import type { SectionHeading } from "@/content/types";

export type SecurityLayer = {
  /** lucide-react icon name. */
  icon?: string;
  title: string;
  body: string;
};

type Note = { title: string; body: string };
type Honesty = { title: string; live: string[]; notYet: string[] };

/**
 * Bespoke: a connected, numbered stack of the real infrastructure layers a
 * request passes through, top to bottom, with a vertical spine joining them.
 * No stock block in this library covers a request-path security diagram, so
 * this is authored specifically for Dentavanta's Security & Compliance page.
 *
 * Closes with a plain "live today, not yet" honesty split so the page never
 * implies more is built than actually is.
 */
export function SecurityArchitecture({ heading, layers, note, honesty }: {
  heading: SectionHeading;
  layers: SecurityLayer[];
  note?: Note;
  honesty?: Honesty;
}) {
  return (
    <section className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-5xl px-6">
        <Reveal className="max-w-2xl">
          {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
            {heading.title}
          </h2>
          {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
        </Reveal>

        <RevealGroup className="relative mt-16 space-y-8">
          {/* The spine: a single vertical line joining every layer, drawn once. */}
          <div aria-hidden className="absolute top-2 bottom-2 left-[1.6rem] w-px bg-border sm:left-[1.85rem]" />

          {layers.map((layer, i) => (
            <RevealItem key={layer.title} className="relative flex gap-5 sm:gap-6">
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-2xl border border-border bg-card text-primary shadow-sm sm:size-14">
                <Icon name={layer.icon} className="size-5 sm:size-6" />
              </span>
              <div className="pt-1">
                <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                  Layer {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-display text-xl font-semibold tracking-tight text-foreground">
                  {layer.title}
                </h3>
                <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">{layer.body}</p>
              </div>
            </RevealItem>
          ))}
        </RevealGroup>

        {note ? (
          <Reveal delay={0.1} className="mt-14 rounded-2xl border border-border bg-accent p-8 sm:p-10">
            <h3 className="font-display text-xl font-semibold tracking-tight text-accent-foreground">{note.title}</h3>
            <p className="mt-3 max-w-3xl leading-relaxed text-accent-foreground/80">{note.body}</p>
          </Reveal>
        ) : null}

        {honesty ? (
          <Reveal delay={0.15} className="mt-8">
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">{honesty.title}</h3>
            <div className="mt-6 grid gap-8 sm:grid-cols-2">
              <div>
                <p className="eyebrow text-primary">Live today</p>
                <ul className="mt-3 space-y-2.5">
                  {honesty.live.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-primary" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow text-muted-foreground">Not yet</p>
                <ul className="mt-3 space-y-2.5">
                  {honesty.notYet.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <X aria-hidden className="mt-0.5 size-4 shrink-0 text-muted-foreground" /> {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
