import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Testimonial01 } from "@/components/sections/testimonials/testimonial-01";
import { Testimonial02 } from "@/components/sections/testimonials/testimonial-02";
import { Testimonial03 } from "@/components/sections/testimonials/testimonial-03";
import { Testimonial04 } from "@/components/sections/testimonials/testimonial-04";
import { Testimonial05 } from "@/components/sections/testimonials/testimonial-05";
import { Testimonial06 } from "@/components/sections/testimonials/testimonial-06";
import { Testimonial07 } from "@/components/sections/testimonials/testimonial-07";
import { Testimonial08 } from "@/components/sections/testimonials/testimonial-08";
import { Testimonial09 } from "@/components/sections/testimonials/testimonial-09";
import { Testimonial10 } from "@/components/sections/testimonials/testimonial-10";
import { demoLogos, demoTestimonials, img } from "@/content/demo";
import type { Testimonial } from "@/content/types";

/** demoTestimonials with a verified photo attached, for the blocks that show faces. */
const withFaces: Testimonial[] = demoTestimonials.map((t, i) => ({
  ...t,
  avatar: img(i + 30, `${t.name}, back from a trip with Blue Water Sail`),
}));

export const TESTIMONIAL_ENTRIES: CatalogEntry[] = [
  {
    code: "TEST-01",
    category: "Testimonials",
    label: "One oversized pull quote, centred, giant display type up to text-6xl with a small avatar and name line underneath. Best for a brand with one standout testimonial worth the whole section, not a volume play: a single quote that does the persuading on its own.",
    file: "components/sections/testimonials/testimonial-01.tsx",
    component: "Testimonial01",
    props: "eyebrow?: string, testimonial: Testimonial",
    node: <Testimonial01 eyebrow="What guests say" testimonial={withFaces[0]} />,
  },
  {
    code: "TEST-02",
    category: "Testimonials",
    label: "Masonry wall on CSS columns with a heading up top, so card heights stagger naturally and every third quote gets bumped to bold display type for rhythm. Best for six or more varied-length quotes you want to show at once as a dense, credible wall, not a single hero quote or a curated short list.",
    file: "components/sections/testimonials/testimonial-02.tsx",
    component: "Testimonial02",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial02
        heading={{
          eyebrow: "Reviews",
          title: "Six seasons of guests, in their own words",
          body: "Every review below came from a guest who sailed out of Slip 14 at Renaissance Marina.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-03",
    category: "Testimonials",
    label: "Two vertical marquee columns auto-scrolling in opposite directions, pausable on hover, beside a fixed heading with fade masks top and bottom. Best for a large, ever-growing pool of short quotes where you want the sense of a constant stream of praise rather than a fixed, countable set.",
    file: "components/sections/testimonials/testimonial-03.tsx",
    component: "Testimonial03",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial03
        heading={{
          eyebrow: "Guest log",
          title: "The reviews keep rolling in",
          body: "Twelve guests a trip means the crew learns your name. That is what people write about afterwards.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-04",
    category: "Testimonials",
    label: "Split slider inside a bordered card, a full height photo on one side and the quote with progress dots and prev/next buttons on the other, keyboard arrow support included. Best for a handful (three to six) of longer, story-like testimonials paired with a real photo each, where you want visitors to browse one at a time rather than scan a wall.",
    file: "components/sections/testimonials/testimonial-04.tsx",
    component: "Testimonial04",
    props: "heading?: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial04
        heading={{ eyebrow: "Aboard", title: "One trip, one story at a time" }}
        testimonials={withFaces.slice(0, 4)}
      />
    ),
  },
  {
    code: "TEST-05",
    category: "Testimonials",
    label: "Ratings forward, a sticky panel with a huge average score, star row and review count beside a compact divided list of five-star reviews. Best for a business with a strong aggregate rating on a named platform like TripAdvisor or Google, where the number itself is the trust signal and the quotes are supporting evidence.",
    file: "components/sections/testimonials/testimonial-05.tsx",
    component: "Testimonial05",
    props: "heading: SectionHeading, score: number, reviewCount: string, source?: string, testimonials: Testimonial[]",
    node: (
      <Testimonial05
        heading={{
          eyebrow: "Rated by guests",
          title: "4.9 across two thousand trips",
          body: "Ratings come from guests who actually sailed. We do not filter the low ones out.",
        }}
        score={4.9}
        reviewCount="2,041"
        source="TripAdvisor"
        testimonials={withFaces.slice(0, 4)}
      />
    ),
  },
  {
    code: "TEST-06",
    category: "Testimonials",
    label: "Inverted brand color band with no cards at all, exactly three quotes stacked on hairline rules with quote icon, text and attribution in a three column row. Best for exactly three strong, short quotes you want to feel authoritative and editorial, as a change of pace section between lighter panels rather than a large review count.",
    file: "components/sections/testimonials/testimonial-06.tsx",
    component: "Testimonial06",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial06
        heading={{
          eyebrow: "On the water",
          title: "Why people book us twice",
          body: "Three notes from the guest book at Slip 14, picked because they say the same thing three ways.",
        }}
        testimonials={demoTestimonials}
      />
    ),
  },
  {
    code: "TEST-07",
    category: "Testimonials",
    label: "A logo marquee of certifications or listing sites scrolling above one featured quote in a bordered card. Best for a business that leans on third party credibility (certifications, associations, listing platforms) and has only one or two standout quotes to pair with it, not a large review archive.",
    file: "components/sections/testimonials/testimonial-07.tsx",
    component: "Testimonial07",
    props: "eyebrow?: string, logos: string[], testimonial: Testimonial",
    node: <Testimonial07 eyebrow="Certified and listed by" logos={demoLogos} testimonial={withFaces[1]} />,
  },
  {
    code: "TEST-08",
    category: "Testimonials",
    label: "A stacked deck of quote cards next to a heading and counter, click the top card or the 'Next review' button and it flies off left to reveal the next underneath. Best for a playful, interactive brand voice with a moderate set of quotes (five to ten) where visitors actively click through rather than passively scroll past a wall.",
    file: "components/sections/testimonials/testimonial-08.tsx",
    component: "Testimonial08",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial08
        heading={{
          eyebrow: "Guest book",
          title: "Deal one review at a time",
          body: "Tap a card to see the next note guests left after a sunset run out of Oranjestad.",
        }}
        testimonials={withFaces}
      />
    ),
  },
  {
    code: "TEST-09",
    category: "Testimonials",
    label: "Editorial numbered list with oversized ghost numerals in the margin, each entry alternating left and right alignment down the page. Best for four to six longer, well-written testimonials you want read in full one at a time, in a magazine-feature tone rather than a scannable grid.",
    file: "components/sections/testimonials/testimonial-09.tsx",
    component: "Testimonial09",
    props: "heading: SectionHeading, testimonials: Testimonial[]",
    node: (
      <Testimonial09
        heading={{ eyebrow: "Selected notes", title: "Five reviews worth reading in full" }}
        testimonials={withFaces.slice(0, 5)}
      />
    ),
  },
  {
    code: "TEST-10",
    category: "Testimonials",
    label: "Bento grid, one tall featured card with a photo spanning both rows on the left and four smaller text-only quote cells packed around it on the right. Best for one hero testimonial with a great photo backed by four shorter supporting quotes, giving both a showcase moment and a sense of broader volume in one section.",
    file: "components/sections/testimonials/testimonial-10.tsx",
    component: "Testimonial10",
    props: "heading: SectionHeading, featured: Testimonial, testimonials: Testimonial[]",
    node: (
      <Testimonial10
        heading={{
          eyebrow: "Reviews",
          title: "The whole guest book on one screen",
          body: "Sunset cruises, reef trips and private charters. Same crew, same twelve seats.",
        }}
        featured={{
          quote: "Third year running. The boat is spotless and the snorkel gear actually fits children properly.",
          name: "Hannah Wiggins",
          role: "Toronto",
          avatar: img(6, "Guests swimming off the stern on a reef stop"),
        }}
        testimonials={demoTestimonials.slice(0, 4)}
      />
    ),
  },
];
