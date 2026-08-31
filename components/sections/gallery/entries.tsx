import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Gallery01 } from "@/components/sections/gallery/gallery-01";
import { Gallery02 } from "@/components/sections/gallery/gallery-02";
import { Gallery03 } from "@/components/sections/gallery/gallery-03";
import { Gallery04 } from "@/components/sections/gallery/gallery-04";
import { Gallery05, type TaggedImage } from "@/components/sections/gallery/gallery-05";
import { Gallery06 } from "@/components/sections/gallery/gallery-06";
import { Gallery07 } from "@/components/sections/gallery/gallery-07";
import { Gallery08 } from "@/components/sections/gallery/gallery-08";
import { Gallery09 } from "@/components/sections/gallery/gallery-09";
import { demoGallery, demoCta, img } from "@/content/demo";

const GALLERY_CATEGORIES = ["Reef", "Sunset", "On deck", "The fleet"];

const taggedGallery: TaggedImage[] = demoGallery.map((image, i) => ({
  ...image,
  category: GALLERY_CATEGORIES[i % GALLERY_CATEGORIES.length],
}));

export const GALLERY_ENTRIES: CatalogEntry[] = [
  {
    code: "GAL-01",
    category: "Gallery",
    label: "Three vertical marquee columns drift at different speeds and directions, masked top and bottom so photos arrive and leave rather than start and stop, autoplay pauses only on hover. Best for a large ambient photo pool used as atmosphere or texture, not for a small set of hero shots that each need to be seen individually.",
    file: "components/sections/gallery/gallery-01.tsx",
    component: "Gallery01",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery01
        heading={{
          eyebrow: "Aboard",
          title: "Twelve seasons of guests, water and light",
          body: "Every frame here was shot on a real charter out of Slip 14. No stock, no staging, no models.",
        }}
        images={demoGallery}
      />
    ),
  },
  {
    code: "GAL-02",
    category: "Gallery",
    label: "A four-column masonry wall opens any frame into a full-screen, keyboard-navigable lightbox, with a running photo count and an optional caption note beneath. Best for a large mixed-orientation library, dozens of shots, where visitors want to click in and page through full screen rather than just glance at thumbnails.",
    file: "components/sections/gallery/gallery-02.tsx",
    component: "Gallery02",
    props: "heading?: SectionHeading, images: Img[], note?: string",
    node: (
      <Gallery02
        heading={{
          eyebrow: "The log",
          title: "Open any frame full screen",
          body: "Click a photograph to enlarge it, then move through the set with the arrow keys.",
        }}
        images={demoGallery}
        note="Shot by the crew on charter days. Guests are welcome to ask for a copy of anything they appear in."
      />
    ),
  },
  {
    code: "GAL-03",
    category: "Gallery",
    label: "A horizontal scroll snap filmstrip with numbered captions and prev/next arrow buttons, draggable, wheel scrollable, and arrow key navigable, one photo at a time. Best for a small sequential set, a dozen or so, that tells a single story in order, like one trip or one event from start to finish.",
    file: "components/sections/gallery/gallery-03.tsx",
    component: "Gallery03",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery03
        heading={{
          eyebrow: "One afternoon",
          title: "A sunset run, start to finish",
          body: "Cast off at Renaissance Marina, anchor at the reef, back alongside by dark.",
        }}
        images={demoGallery.slice(0, 12)}
      />
    ),
  },
  {
    code: "GAL-04",
    category: "Gallery",
    label: "A bento wall of nine uneven cells, one large feature frame surrounded by smaller supporting cells, static with no lightbox or click interaction. Best for a small curated set of standout shots, up to nine, where one photo should visually dominate, not a large archive that needs browsing.",
    file: "components/sections/gallery/gallery-04.tsx",
    component: "Gallery04",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery04
        heading={{
          eyebrow: "Oranjestad",
          title: "What a half day off Aruba actually looks like",
          body: "Nine frames, no filter, picked from the last three months of charters.",
        }}
        images={demoGallery.slice(2, 11)}
      />
    ),
  },
  {
    code: "GAL-05",
    category: "Gallery",
    label: "A chip filterable grid shows a live 'X of Y' count and a dedicated empty state when a filter returns nothing, and it requires every image tagged with a category. Best for a larger, categorized library, for example reef, sunset, deck and fleet, where visitors want to narrow the set down by type rather than scroll through everything at once.",
    file: "components/sections/gallery/gallery-05.tsx",
    component: "Gallery05",
    props: "heading?: SectionHeading, images: (Img & { category: string })[], allLabel?: string, emptyLabel?: string",
    node: (
      <Gallery05
        heading={{
          eyebrow: "Browse",
          title: "Filter the log by what you came for",
          body: "Reef trips, sunset runs, deck life and the boats themselves.",
        }}
        images={taggedGallery}
        allLabel="Everything"
        emptyLabel="Nothing filed under this yet. Try Reef or Sunset."
      />
    ),
  },
  {
    code: "GAL-06",
    category: "Gallery",
    label: "A sticky, crossfading feature image on the left pairs with a scrolling captioned thumbnail list on the right, clicking a thumbnail swaps the big frame. Best for a small to medium curated set, six to ten shots, where each photo carries its own caption and deserves a moment of full attention, like a photo essay rather than a quick scan archive.",
    file: "components/sections/gallery/gallery-06.tsx",
    component: "Gallery06",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery06
        heading={{
          eyebrow: "Frame by frame",
          title: "Pick a photograph and it opens on the left",
          body: "Captions come straight from the crew log, so they say what was happening rather than what looks good.",
        }}
        images={demoGallery.slice(0, 8)}
      />
    ),
  },
  {
    code: "GAL-07",
    category: "Gallery",
    label: "Gallery06's sticky split layout, made live: it auto advances on a timer instead of waiting for a click, pausing on hover, with a card style thumbnail rail (accent bar, display face numerals) that scrolls internally rather than a plain hairline list. Best for the same six to ten shot curated set as Gallery06, when the section should feel alive on its own rather than needing a visitor to drive it.",
    file: "components/sections/gallery/gallery-07.tsx",
    component: "Gallery07",
    props: "heading?: SectionHeading, images: Img[], intervalMs?: number",
    node: (
      <Gallery07
        heading={{
          eyebrow: "Frame by frame",
          title: "Every reef stop, on rotation",
          body: "The frame changes on its own. Hover it to pause, or pick a thumbnail to jump straight there.",
        }}
        images={demoGallery.slice(0, 8)}
      />
    ),
  },
  {
    code: "GAL-08",
    category: "Gallery",
    label: "A full height, full width showcase that cycles through distinct offerings on a timer, Hero09's two photo overlapping frame blown out to fill the whole section: the current item fills the frame, the next one up sits as a small offset inset photo so every rotation previews where it is headed. Best for a handful of genuinely different things worth spotlighting in turn (trip packages, menu items, rooms), not a plain photo archive, which is what Gallery01 through 07 are for.",
    file: "components/sections/gallery/gallery-08.tsx",
    component: "Gallery08",
    tallPreview: true,
    props: "items: { title, meta?, price?, image: Img, cta?: Cta }[], intervalMs?: number",
    node: (
      <Gallery08
        items={[
          { title: "Sunset cruise with dinner", price: "$88", meta: "3 hours, departs 17:30", image: img(15, "Sailboat silhouetted against a sunset"), cta: demoCta },
          { title: "Snorkel and sail, half day", price: "$68", meta: "3.5 hours, departs 09:00", image: img(2, "Snorkeller above a shallow reef"), cta: demoCta },
          { title: "Full day coast run", price: "$124", meta: "6 hours, departs 09:30", image: img(16, "Catamaran under full sail"), cta: demoCta },
          { title: "Private charter", price: "$960", meta: "Flexible, up to 12 guests", image: img(17, "Table set on a boat deck"), cta: demoCta },
        ]}
      />
    ),
  },
  {
    code: "GAL-09",
    category: "Gallery",
    label: "One tall, heavily rounded card centred on the page, a single image at a time you swipe, drag, arrow through or arrow-key past, rather than a filmstrip of many separate cards. Best for a small, deliberate sequence, four to six shots, that should read as one object worth lingering on, like a photo essay opener, not a large archive to browse.",
    file: "components/sections/gallery/gallery-09.tsx",
    component: "Gallery09",
    props: "heading?: SectionHeading, images: Img[]",
    node: (
      <Gallery09
        heading={{
          eyebrow: "One trip",
          title: "Swipe through a sunset run",
          body: "Cast off, first reef stop, the light going orange, back alongside by dark.",
        }}
        images={demoGallery.slice(0, 5)}
      />
    ),
  },
];
