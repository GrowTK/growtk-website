import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/about-hero";
import { AboutStory } from "@/components/sections/about/about-story";
import { AboutCompare } from "@/components/sections/about/about-compare";
import { AboutValues } from "@/components/sections/about/about-values";
import { FoundersTeaser } from "@/components/sections/about/founders-teaser";
import { IndustryCta } from "@/components/sections/industries/industry-cta";
import { Wash, washTone } from "@/components/sections/company/wash";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-jsonld";
import { about } from "@/content/about";
import { team } from "@/content/team";
import { home } from "@/content/home";

export const metadata: Metadata = { title: about.meta.title, description: about.meta.description };

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "About", path: "/about" }]} />
      <AboutHero heading={about.hero} ctas={about.hero.ctas} image={about.heroImage} facts={about.facts} />
      <AboutStory heading={about.story.heading} body={about.story.body} image={about.story.image} caption={about.story.caption} />
      <AboutCompare heading={about.compare.heading} rows={about.compare.rows} columns={about.compare.columns} />
      <AboutValues heading={about.values.heading} lead={about.values.lead} values={about.values.items} />
      <FoundersTeaser heading={about.founders.heading} members={team.team} link={about.founders.link} />
      <IndustryCta heading={about.cta.heading} primary={about.cta.primary} tone={washTone("apricot")} backdrop={<Wash name="apricot" />} figureLabel={home.hero.figureLabel} />
    </>
  );
}
