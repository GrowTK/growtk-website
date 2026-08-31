import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Spotlight01 } from "@/components/sections/spotlight/spotlight-01";
import { Spotlight02 } from "@/components/sections/spotlight/spotlight-02";
import { Spotlight03 } from "@/components/sections/spotlight/spotlight-03";
import { Spotlight04 } from "@/components/sections/spotlight/spotlight-04";
import { Spotlight05 } from "@/components/sections/spotlight/spotlight-05";
import { Spotlight06 } from "@/components/sections/spotlight/spotlight-06";
import { Spotlight07 } from "@/components/sections/spotlight/spotlight-07";
import { Spotlight08 } from "@/components/sections/spotlight/spotlight-08";
import { Spotlight09 } from "@/components/sections/spotlight/spotlight-09";
import { Spotlight10 } from "@/components/sections/spotlight/spotlight-10";
import { demoCta, demoStats, img } from "@/content/demo";

/**
 * Spotlight: full colour or full image "breather" sections with little or no
 * copy of their own. They are not a page's main content, they are the beat
 * between two content sections that gives the "colour, then white, then
 * colour" alternation the design law asks for (see CLAUDE.md, "Backgrounds
 * alternate on purpose"). Drop one between two `bg-background` sections
 * instead of stacking three white sections in a row.
 */
export const SPOTLIGHT_ENTRIES: CatalogEntry[] = [
  {
    code: "SPOT-01",
    category: "Spotlight",
    label: "A full bleed brand colour band holding one oversized number and a label, nothing else. Best as a single, confident proof point (years running, guests served) dropped between two white sections purely to break up the page with colour, not for more than one statistic at a time.",
    file: "components/sections/spotlight/spotlight-01.tsx",
    component: "Spotlight01",
    props: "value: string, label: string, sublabel?: string",
    node: <Spotlight01 value="12" label="Seasons sailing this coast" sublabel="Same captains, same marina, since 2013" />,
  },
  {
    code: "SPOT-02",
    category: "Spotlight",
    label: "One full bleed photograph, no text, no overlay, no card. The quietest possible breather, a full stop between two dense sections rather than one more thing to read. Best when a page has been talking for a while and just needs a beat to look at something before the next section starts.",
    file: "components/sections/spotlight/spotlight-02.tsx",
    component: "Spotlight02",
    props: "image: Img, height?: string",
    node: <Spotlight02 image={img(9, "Sail against an open sky")} />,
  },
  {
    code: "SPOT-03",
    category: "Spotlight",
    label: "A full bleed photo with a solid caption bar directly beneath it carrying one line and an optional link, a museum plaque rather than text laid over the image. Best for a single striking shot that deserves one real sentence of context, more considered than Spotlight02's silent version but still not a whole section of copy.",
    file: "components/sections/spotlight/spotlight-03.tsx",
    component: "Spotlight03",
    props: "image: Img, caption: string, cta?: Cta",
    node: (
      <Spotlight03
        image={img(12, "Anchored at golden hour")}
        caption="Every trip ends the same way: engine off, sails down, waiting on the light."
        cta={demoCta}
      />
    ),
  },
  {
    code: "SPOT-04",
    category: "Spotlight",
    label: "A colour panel cut at an angle into a photo instead of a straight 50/50 split, a short headline on the colour side. Best for a page that wants a graphic jolt of shape between sections rather than another rectangle, used sparingly since the diagonal is a strong move.",
    file: "components/sections/spotlight/spotlight-04.tsx",
    component: "Spotlight04",
    props: "eyebrow?: string, title: string, image: Img",
    node: <Spotlight04 eyebrow="Since 2013" title="Twelve seasons of knowing exactly where the reef stays calm" image={img(6, "Crew trimming a sail")} />,
  },
  {
    code: "SPOT-05",
    category: "Spotlight",
    label: "A colour band carrying a scrolling ticker of short phrases, dot separated, pausing on hover, not logos, words. Best as a rhythmic, motion driven punctuation mark between two static sections, three to eight short phrases that summarise the brand in a glance rather than a paragraph anyone is meant to read closely.",
    file: "components/sections/spotlight/spotlight-05.tsx",
    component: "Spotlight05",
    props: "words: string[], tone?: \"primary\" | \"foreground\"",
    node: <Spotlight05 words={["Twelve guests maximum", "Local captains", "Reef safe", "No queue for the ladder", "Since 2013"]} />,
  },
  {
    code: "SPOT-06",
    category: "Spotlight",
    label: "A full bleed photo with one oversized word bled across the bottom edge at low opacity, the same giant type as texture move the footer's bleed wordmark uses. Best as pure decoration, a brand word or a one word mood ('Aground.', 'Underway.') rather than a message anyone needs to actually read.",
    file: "components/sections/spotlight/spotlight-06.tsx",
    component: "Spotlight06",
    props: "image: Img, word: string",
    node: <Spotlight06 image={img(33, "Open ocean horizon at dusk")} word="Underway" />,
  },
  {
    code: "SPOT-07",
    category: "Spotlight",
    label: "A colour band holding a row of three or four stats side by side, the multi number sibling to Spotlight01's single big figure. Best when there are several real numbers worth a beat of their own between content sections, rather than folded into a hero or a feature grid where they would compete for attention.",
    file: "components/sections/spotlight/spotlight-07.tsx",
    component: "Spotlight07",
    props: "stats: Stat[]",
    node: <Spotlight07 stats={demoStats} />,
  },
  {
    code: "SPOT-08",
    category: "Spotlight",
    label: "Full bleed, muted, looping video with zero text and zero controls, the motion sibling of Spotlight02's still photo breather. Best when there is real ambient footage, the work happening, the place itself, worth a quiet pause on, never as a hero and never carrying a message.",
    file: "components/sections/spotlight/spotlight-08.tsx",
    component: "Spotlight08",
    props: "videoSrc: string, poster?: Img, height?: string",
    node: <Spotlight08 videoSrc="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4" poster={img(0, "Sailboat under way in open water")} />,
  },
  {
    code: "SPOT-09",
    category: "Spotlight",
    label: "A straight 50/50 split: a solid colour panel with one short line and an icon on one side, a full bleed photo on the other, both sides carrying their own natural contrast so nothing sits on top of the image. Best as a quieter, more literal alternative to Spotlight04's diagonal split, for a page that wants the break without the extra geometry.",
    file: "components/sections/spotlight/spotlight-09.tsx",
    component: "Spotlight09",
    props: "icon?: string, title: string, body?: string, image: Img",
    node: (
      <Spotlight09
        icon="Anchor"
        title="Every hull surveyed, every January"
        body="Coast guard inspection, marina berth audit and a reef operator review, before the first charter of the season leaves the dock."
        image={img(10, "Catamaran moored in clear water")}
      />
    ),
  },
  {
    code: "SPOT-10",
    category: "Spotlight",
    label: "A colour background with the photo held well inside it on a wide margin, framed rather than bled to the edges, an optional caption line underneath. Best for a single strong shot that reads better presented like a print on a wall than plastered edge to edge, a gentler alternative to Spotlight02 or Spotlight06 when the colour itself should still show.",
    file: "components/sections/spotlight/spotlight-10.tsx",
    component: "Spotlight10",
    props: "image: Img, caption?: string",
    node: <Spotlight10 image={img(31, "Open sea from a boat bow")} caption="Twenty minutes out, the water goes from green to true blue." />,
  },
];
