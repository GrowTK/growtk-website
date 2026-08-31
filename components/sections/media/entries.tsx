import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Logos01 } from "@/components/sections/media/logos-01";
import { Logos02 } from "@/components/sections/media/logos-02";
import { Logos03 } from "@/components/sections/media/logos-03";
import { Logos04 } from "@/components/sections/media/logos-04";
import { demoLogos } from "@/content/demo";

export const MEDIA_ENTRIES: CatalogEntry[] = [
  {
    code: "LOGO-01",
    category: "Logos",
    label: "A single horizontal marquee strip that scrolls edge to edge, fading out at both sides and pausing on hover, with an optional small tracked eyebrow above it. Best for a long, open-ended list of press mentions or partner marks (ten or more) that needs one lightweight, continuously moving row rather than a fixed grid.",
    file: "components/sections/media/logos-01.tsx",
    component: "Logos01",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string",
    node: <Logos01 logos={demoLogos} heading="Who signs off on Blue Water Sail" />,
  },
  {
    code: "LOGO-02",
    category: "Logos",
    label: "A muted band split into a short caption on the left and two pill-badged logo rows on the right, each row scrolling in the opposite direction at a different speed. Best for a mid-size batch of certifications or partners paired with a one-line trust statement, where the counter-scrolling rows read as a denser, more textured strip than a single marquee.",
    file: "components/sections/media/logos-02.tsx",
    component: "Logos02",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string",
    node: <Logos02 logos={demoLogos} heading="Inspected, licensed, reef safe" />,
  },
  {
    code: "LOGO-03",
    category: "Logos",
    label: "An editorial two column layout: an eyebrow, heading and body copy on the left, a bordered card on the right holding a vertical ticker of marks scrolling upward. Best for a small handful of logos backed by a real trust story, inspections, licenses, reviews, where the copy carries as much weight as the marks themselves.",
    file: "components/sections/media/logos-03.tsx",
    component: "Logos03",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string, body?: string, eyebrow?: string",
    node: (
      <Logos03
        logos={demoLogos}
        eyebrow="Slip 14, Renaissance Marina"
        heading="Every boat we run is checked by someone who is not us"
        body="Coast Guard inspection, marina berth audit and a reef operator review, renewed each season before the first charter leaves Oranjestad."
      />
    ),
  },
  {
    code: "LOGO-04",
    category: "Logos",
    label: "A static hairline grid of logo cells on desktop (three or six columns, no motion at all) that collapses to a horizontal ticker below the md breakpoint, with an optional badge-icon trust line underneath. Best for a small, fixed set of certifications or named partners, up to six, that should be scannable at a glance on desktop rather than kept in constant motion.",
    file: "components/sections/media/logos-04.tsx",
    component: "Logos04",
    props: "logos: string[] | { name: string; src?: string }[], heading?: string, trustLine?: string",
    node: (
      <Logos04
        logos={demoLogos}
        heading="Certifications we hold, and keep current"
        trustLine="All six renewed within the last twelve months. Paperwork is on the wall at Slip 14 if you want to read it."
      />
    ),
  },
];
