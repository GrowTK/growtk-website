import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Project, SectionHeading } from "@/content/types";

/**
 * Bento widths on large screens, in a six column grid: wide and narrow cards
 * trade places row to row (4+2, 2+4), then the last row splits evenly (3+3).
 * Literal class strings so Tailwind keeps them.
 */
const SPANS = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4", "lg:col-span-3", "lg:col-span-3"];

/**
 * Bespoke: each project is its own brand-coloured tile with a real screenshot
 * floating up from the bottom, and the tile morphs into the detail page's deck
 * via React's ViewTransition, named per slug. No library block covers this,
 * it exists only for this content.
 */
export function ProjectsShowcase({ heading, items }: { heading?: SectionHeading; items: Project[] }) {
  return (
    <section id="work" className="bg-background py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-6">
        {heading ? (
          <Reveal className="mx-auto max-w-2xl text-center">
            {heading.eyebrow ? <p className="eyebrow text-primary">{heading.eyebrow}</p> : null}
            {heading.title ? (
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">{heading.title}</h2>
            ) : null}
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-6">
          {items.map((project, i) => (
            <Reveal key={project.slug} className={SPANS[i % SPANS.length]}>
              <ProjectCard project={project} wide={SPANS[i % SPANS.length] === "lg:col-span-4"} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project, wide }: { project: Project; wide: boolean }) {
  const square = project.logoShape === "square";
  return (
    <Link
      href={`/work/${project.slug}`}
      className="group block cursor-pointer rounded-[28px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
    >
      <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
        <div className={cn("relative h-80 overflow-hidden rounded-[28px] sm:h-96", project.thumbnailClassName)}>
          {/* Soft light from the top corner, so a flat brand fill reads as a surface. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_0%_0%,rgba(255,255,255,.22),transparent_55%)]" />

          <div className="relative flex items-start justify-between gap-4 p-6 sm:p-7">
            <Image
              src={project.logo.src}
              alt={project.logo.alt}
              width={200}
              height={56}
              className={cn("object-contain object-left transition-transform duration-500 ease-out group-hover:scale-105", square ? "h-12 w-auto" : "h-8 w-auto max-w-[55%]")}
            />
            {project.kind ? (
              <span className="shrink-0 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">{project.kind}</span>
            ) : null}
          </div>

          {project.preview ? (
            // The product in a window, rising out of the tile. It lifts on hover.
            <div
              className={cn(
                "absolute bottom-0 overflow-hidden rounded-t-2xl bg-white shadow-[0_-20px_60px_-20px_rgba(0,0,0,.45)] ring-1 ring-black/10 transition-transform duration-500 ease-out group-hover:-translate-y-3",
                wide ? "inset-x-10 translate-y-6 sm:inset-x-14" : "inset-x-6 translate-y-8",
              )}
            >
              <div className="flex items-center gap-1.5 border-b border-zinc-200 bg-zinc-50 px-3 py-2" aria-hidden>
                <span className="size-2 rounded-full bg-[#FF5F57]" />
                <span className="size-2 rounded-full bg-[#FEBC2E]" />
                <span className="size-2 rounded-full bg-[#28C840]" />
              </div>
              <div className={cn("relative", wide ? "h-60 sm:h-64" : "h-52 sm:h-60")}>
                {/* Plain lazy img: the homepage keeps its next/image budget for the logos and the hero. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.preview.src}
                  alt={project.preview.alt}
                  width={project.preview.width}
                  height={project.preview.height}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 size-full object-cover object-left-top"
                />
              </div>
            </div>
          ) : null}
        </div>
      </ViewTransition>

      <div className="mt-5 flex items-start justify-between gap-4 px-1">
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold text-foreground">{project.name}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
          {project.tags?.length ? (
            <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="What we built">
              {project.tags.map((t) => (
                <li key={t} className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-foreground">
                  {t}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <span
          aria-hidden
          className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition duration-300 group-hover:border-transparent group-hover:bg-[var(--accent)] group-hover:text-white"
          style={{ ["--accent" as string]: project.accentHex }}
        >
          <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:rotate-45" />
        </span>
      </div>
    </Link>
  );
}
