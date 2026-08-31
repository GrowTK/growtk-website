import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Fleet01 } from "@/components/sections/fleet/fleet-01";
import { Fleet02 } from "@/components/sections/fleet/fleet-02";
import { Fleet03 } from "@/components/sections/fleet/fleet-03";
import { Fleet04 } from "@/components/sections/fleet/fleet-04";
import { demoBoats } from "@/content/demo";

export const FLEET_ENTRIES: CatalogEntry[] = [
  { code: "FLEET-01", category: "Fleet", label: "One boat per full-width spread, alternating a bled photo left and right against a hairline spec table with mono labels beneath the name and blurb. Best for a small fleet of two to four named boats where each one earns its own space and story, such as a boutique charter or dive operator, not a large rental roster that needs scanning.",
    file: "components/sections/fleet/fleet-01.tsx", component: "Fleet01", props: "heading?: SectionHeading, boats: Boat[], note?: string",
    node: <Fleet01
      heading={{ eyebrow: "The fleet", title: "Two hulls, one dock, no charter you have not seen first", body: "Both boats live on Slip 14 at Renaissance Marina. Walk down before you book and we will show you the deck you are paying for." }}
      boats={demoBoats.slice(0, 2)}
      note="Survey and safety kit renewed every January. Certificates are on the bulkhead by the companionway if you want to read them." /> },

  { code: "FLEET-02", category: "Fleet", label: "A four-column card grid where every card closes with a compact three-icon spec strip (length, guests, year) split by vertical hairlines. Best for a fleet of four or more similar vessels that visitors need to scan and compare at a glance, like a tour or rental operator with several comparable boats rather than a couple of flagship ones.",
    file: "components/sections/fleet/fleet-02.tsx", component: "Fleet02", props: "heading?: SectionHeading, boats: Boat[]",
    node: <Fleet02
      heading={{ eyebrow: "Blue Water Sail", title: "Four boats, and the one you want depends on the day", body: "Wind above eighteen knots and we put you on Trade Wind. Flat calm with a group of fourteen and it is Lighthouse." }}
      boats={demoBoats} /> },

  { code: "FLEET-03", category: "Fleet", label: "A keyboard-navigable tablist of boat names drives a single panel that crossfades between photo and a two-column spec grid, so only one boat shows at a time. Best for a larger fleet (five or more) where you want to keep the section short and let visitors click through boats one by one instead of scrolling a long page.",
    file: "components/sections/fleet/fleet-03.tsx", component: "Fleet03", props: "heading?: SectionHeading, boats: Boat[], footnote?: string",
    node: <Fleet03
      heading={{ eyebrow: "Pick a boat", title: "Every hull we sail out of Oranjestad", body: "Tap a name to see the deck, the draft and how many guests we will actually take aboard." }}
      boats={demoBoats}
      footnote="Guest counts are the number we sail with, not the number the licence allows. Nobody waits for the swim ladder." /> },

  { code: "FLEET-04", category: "Fleet", label: "The lead boat's photo and a booking CTA pin on the left while the rest of the fleet runs as spec cards scrolling past on the right, set on a solid accent-colored background. Best for a marina or charter business that wants to spotlight one flagship boat and drive bookings, with the remaining fleet listed as supporting detail rather than equal billing.",
    file: "components/sections/fleet/fleet-04.tsx", component: "Fleet04", props: "heading?: SectionHeading, boats: Boat[], cta?: Cta",
    node: <Fleet04
      heading={{ eyebrow: "Slip 14", title: "Come down to the marina and read the specs off the transom", body: "The whole fleet is tied up within sixty metres of the Renaissance Marina boardwalk in Oranjestad." }}
      boats={demoBoats}
      cta={{ label: "Book a boat", href: "#book", variant: "primary" }} /> },
];
