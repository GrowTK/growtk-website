import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { TeamGrid } from "@/components/sections/team/team-grid";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { brand } from "@/brand.config";
import { team } from "@/content/team";

export const metadata: Metadata = { title: team.meta.title, description: team.meta.description };

const teamJsonLd = team.team.map((member) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  name: member.name,
  jobTitle: member.role,
  worksFor: {
    "@type": "Organization",
    name: brand.name,
  },
}));

export default function TeamPage() {
  return (
    <>
      {teamJsonLd.map((entry) => (
        <script
          key={entry.name}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry) }}
        />
      ))}
      <BreadcrumbJsonLd items={[{ name: "Team", path: "/team" }]} />

      <section data-nav-theme="dark" className="relative isolate flex min-h-[calc(100vh-92px)] items-center overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/brand/blob-poster.jpg"
          className="absolute inset-0 -z-20 size-full object-cover opacity-50 blur-[2px]"
        >
          <source src="/brand/blob-animation.mp4" type="video/mp4" />
        </video>
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/70 to-black/40" />

        <div className="relative mx-auto w-full max-w-3xl px-6 py-20 text-center">
          {team.hero.eyebrow ? <p className="eyebrow text-white/60">{team.hero.eyebrow}</p> : null}
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] tracking-tight text-balance text-white sm:text-6xl">
            {team.hero.title}
          </h1>
          {team.hero.body ? (
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/80">{team.hero.body}</p>
          ) : null}
          {team.hero.ctas?.length ? (
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              {team.hero.ctas.map((cta, i) => (
                <Link
                  key={cta.label}
                  href={cta.href}
                  className={
                    i === 0
                      ? "group inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:outline-none"
                      : "inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/40 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
                  }
                >
                  {cta.label}
                  {i === 0 ? (
                    <ArrowRight aria-hidden className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
                  ) : null}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <TeamGrid heading={team.intro} team={team.team} />
      <Cta12
        heading={team.cta.heading}
        primary={team.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
