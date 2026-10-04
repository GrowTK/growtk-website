import type { Metadata } from "next";
import { IndustryHero } from "@/components/sections/industries/industry-hero";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { Wash, washTone } from "@/components/sections/company/wash";
import { FounderBadges } from "@/components/sections/team/founder-badges";
import { WorkSplit } from "@/components/sections/team/work-split";
import { FounderProfiles } from "@/components/sections/team/founder-profiles";
import { TeamPromise } from "@/components/sections/team/team-promise";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { brand } from "@/brand.config";
import { team } from "@/content/team";
import { home } from "@/content/home";

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

      <IndustryHero heading={team.hero} ctas={team.hero.ctas} tone={washTone("blob")} backdrop={<Wash name="blob" />} figure={<FounderBadges members={team.team} />} />
      <WorkSplit heading={team.intro} members={team.team} shared={team.shared} />
      <FounderProfiles members={team.team} buildsLabel={team.profile.builds} />
      <TeamPromise heading={team.promise.heading} items={team.promise.items} />
      <IndustryCta heading={team.cta.heading} primary={team.cta.primary} tone={washTone("sunset")} backdrop={<img src="/brand/8.jpg" alt="" aria-hidden loading="lazy" decoding="async" className="pointer-events-none absolute inset-0 -z-10 size-full scale-125 object-cover blur-2xl" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
