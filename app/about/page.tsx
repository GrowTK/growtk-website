import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { About01 } from "@/components/sections/about/about-01";
import { About05 } from "@/components/sections/about/about-05";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { about } from "@/content/about";

export const metadata: Metadata = { title: about.meta.title, description: about.meta.description };

export default function AboutPage() {
  return (
    <>
      <PageHero
        heading={about.hero}
        image={{ src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80", alt: "Clean, modern dental treatment room" }}
        ctas={about.hero.ctas}
      />
      <About01
        heading={about.story.heading}
        body={about.story.body}
        image={about.story.image}
        caption={about.story.caption}
      />
      <About05
        heading={about.values.heading}
        lead={about.values.lead}
        values={about.values.items}
      />
      <Cta12
        heading={about.cta.heading}
        primary={about.cta.primary}
        image={{ src: "/brand/blue-blur.jpg", alt: "" }}
      />
    </>
  );
}
