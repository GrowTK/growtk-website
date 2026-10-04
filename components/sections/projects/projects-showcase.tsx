import { ViewTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/magic/reveal";
import { cn } from "@/lib/utils";
import type { Project, SectionHeading } from "@/content/types";

/**
 * Bespoke: project cards whose thumbnail morphs into the detail page's hero
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
              <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-balance text-foreground sm:text-5xl">
                {heading.title}
              </h2>
            ) : null}
            {heading.body ? <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{heading.body}</p> : null}
          </Reveal>
        ) : null}

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((project) => (
            <Reveal key={project.slug}>
              <Link href={`/work/${project.slug}`} className="group block cursor-pointer">
                <ViewTransition name={`project-${project.slug}`} share="morph" default="none">
                  <div
                    className={cn(
                      "relative flex aspect-4/3 items-center justify-center overflow-hidden rounded-3xl transition-transform duration-300 ease-out group-hover:scale-[1.03]",
                      project.thumbnailClassName,
                    )}
                  >
                    <Image
                      src={project.logo.src}
                      alt={project.logo.alt}
                      width={200}
                      height={56}
                      className={cn(
                        "object-contain transition-transform duration-300 ease-out group-hover:scale-110",
                        project.logoShape === "square" ? "h-1/2 w-auto" : "w-2/5",
                      )}
                    />
                  </div>
                </ViewTransition>
                <div className="mt-5">
                  <p className="font-display text-lg font-semibold text-foreground">{project.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{project.tagline}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
