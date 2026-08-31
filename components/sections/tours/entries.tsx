import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Tour01 } from "@/components/sections/tours/tour-01";
import { Tour02 } from "@/components/sections/tours/tour-02";
import { Tour03 } from "@/components/sections/tours/tour-03";
import { Tour04 } from "@/components/sections/tours/tour-04";
import { Tour05 } from "@/components/sections/tours/tour-05";
import { Tour06 } from "@/components/sections/tours/tour-06";
import { Tour07 } from "@/components/sections/tours/tour-07";
import { Tour08 } from "@/components/sections/tours/tour-08";
import { Tour09 } from "@/components/sections/tours/tour-09";
import { Tour10 } from "@/components/sections/tours/tour-10";
import { Tour11 } from "@/components/sections/tours/tour-11";
import { Tour12 } from "@/components/sections/tours/tour-12";
import { Tour13 } from "@/components/sections/tours/tour-13";
import { Tour14 } from "@/components/sections/tours/tour-14";
import { Tour15 } from "@/components/sections/tours/tour-15";
import { demoContact, demoTiers, demoTours } from "@/content/demo";

export const TOUR_ENTRIES: CatalogEntry[] = [
  {
    code: "TOUR-01",
    category: "Tours",
    label: "Four-up marketplace grid with rounded photo cards, a floating heart save button, and price stacked below the title. Best for large catalogs of many similar-priced trips, like snorkel rentals or day tours, that guests want to scan quickly the way they would a shopping page.",
    file: "components/sections/tours/tour-01.tsx",
    component: "Tour01",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour01
        heading={{
          eyebrow: "Departing Slip 14",
          title: "Every trip we run out of Renaissance Marina",
          body: "Twelve guests maximum, gear and lunch aboard, and a captain who has read this water for twelve seasons.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "See all departures", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-02",
    category: "Tours",
    label: "Booking-site rows stacking full width: photo left, rating and detail icons in the middle, a bordered price rail with CTA button on the right. Best for a tight catalog of four to six trips where each one needs enough detail to compare confidently, like a classic OTA listing page.",
    file: "components/sections/tours/tour-02.tsx",
    component: "Tour02",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour02
        heading={{
          eyebrow: "Availability this week",
          title: "Pick a trip, pick a time, we hold the slot",
          body: "Fares shown are per guest with tax included. Free rebooking if the captain calls it off for weather.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-03",
    category: "Tours",
    label: "Three-up photo cards where a bold price chip overlaps the seam between the image and the body, with a duration badge floating on the photo itself. Best for a small set of three to six flagship trips with strong photography, where the fare reads as a headline, not a spec line.",
    file: "components/sections/tours/tour-03.tsx",
    component: "Tour03",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour03
        heading={{
          eyebrow: "Blue Water Sail",
          title: "Three ways to spend a day on this coast",
          body: "Reef in the morning, coast run at midday, dinner under the lighthouse at golden hour.",
        }}
        tours={demoTours.slice(0, 3)}
        cta={{ label: "See the itinerary", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-04",
    category: "Tours",
    label: "Three classic pricing tiers with the featured plan scaled up, dropped onto the brand colour, and carrying the ticked feature list. Best for operators selling a handful of fixed packages by tier, half day, full day, private charter, rather than distinct named trips.",
    file: "components/sections/tours/tour-04.tsx",
    component: "Tour04",
    props: "heading?: SectionHeading, tiers: PriceTier[], cta?: Cta",
    node: (
      <Tour04
        heading={{
          eyebrow: "Fares",
          title: "What a day aboard costs",
          body: "One price per guest. Snorkel gear, lunch and soft drinks are in the fare, not bolted on at the dock.",
        }}
        tiers={demoTiers}
        cta={{ label: "Book this trip", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-05",
    category: "Tours",
    label: "A dense comparison table with a sticky header, one row per inclusion and one column per fare. Best for three to five fixed packages sharing a common feature set that guests need to line up side by side, a feature matrix rather than a browsable trip catalog.",
    file: "components/sections/tours/tour-05.tsx",
    component: "Tour05",
    props: "heading?: SectionHeading, tiers: PriceTier[], cta?: Cta",
    sticky: true,
    node: (
      <Tour05
        heading={{
          eyebrow: "Compare",
          title: "What is aboard on each trip",
          body: "The half day, the full day and the private charter, line by line, so nothing is a surprise at Slip 14.",
        }}
        tiers={demoTiers}
        cta={{ label: "Book", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-06",
    category: "Tours",
    label: "Bento grid where one hero trip fills half the layout with a full-bleed photo, badge and price, while three compact list rows fill the rest. Best for an operator with one clear flagship trip, like a signature sunset cruise, that deserves top billing over a few alternatives.",
    file: "components/sections/tours/tour-06.tsx",
    component: "Tour06",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour06
        heading={{
          eyebrow: "Most booked",
          title: "The sunset run, and three good alternatives",
          body: "If the evening trip is full, these three leave from the same slip and end just as well.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-07",
    category: "Tours",
    label: "An editorial index with no cards at all: hairline rows, oversized numerals, a stamp-sized thumbnail and the fare set right in mono type. Best for a long full list of six or more trips read as a scannable timetable, for a brand that wants an editorial feel over a shopping grid.",
    file: "components/sections/tours/tour-07.tsx",
    component: "Tour07",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour07
        heading={{
          eyebrow: "The full list",
          title: "Six trips, one marina, no upsell at the dock",
          body: "Everything Blue Water Sail runs out of Oranjestad, in the order the boats leave.",
        }}
        tours={demoTours}
        cta={{ label: "Book", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-08",
    category: "Tours",
    label: "Tall portrait poster cards on an auto-advancing horizontal rail, photo on top and copy on a solid surface below it. Best for surfacing many trips in a compact vertical footprint, a mobile-friendly browse-the-rail feel for catalogs too big for a static grid.",
    file: "components/sections/tours/tour-08.tsx",
    component: "Tour08",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour08
        heading={{
          eyebrow: "On the water this month",
          title: "Trips that fill first in high season",
          body: "Ten days ahead for the sunset cruise, a full week for a private charter so the galley can plan.",
        }}
        tours={demoTours}
        cta={{ label: "Reserve a seat", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-09",
    category: "Tours",
    label: "Two-up cards closed off by a three-cell spec strip for duration, departure point and group size beneath the description. Best for trips where logistics matter as much as the experience, structured excursions, classes or charters where guests need spec-sheet clarity before booking.",
    file: "components/sections/tours/tour-09.tsx",
    component: "Tour09",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour09
        heading={{
          eyebrow: "Trip details",
          title: "Times, meeting point and group size up front",
          body: "Every trip boards at Slip 14, Renaissance Marina, fifteen minutes before departure. Parking is free.",
        }}
        tours={demoTours.slice(0, 4)}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-10",
    category: "Tours",
    label: "Quiet cards that stay minimal until hover or keyboard focus rolls out the full what's-included list. Best for a catalog where trips look similar at a glance but differ in what actually comes with the fare, letting the inclusions do the differentiating instead of the photography.",
    file: "components/sections/tours/tour-10.tsx",
    component: "Tour10",
    props: "heading?: SectionHeading, tours: Tour[], included?: string[], cta?: Cta",
    node: (
      <Tour10
        heading={{
          eyebrow: "Included in every fare",
          title: "The price at the dock is the price you booked",
          body: "Hover a trip to see what comes with it. Nothing on this list is an extra.",
        }}
        tours={demoTours.slice(0, 3)}
        included={[
          "Masks, fins and vests in every size",
          "Lunch grilled on the back deck",
          "Cold drinks and shade all day",
          "Reef safe sunscreen aboard",
          "Free rebooking if the captain calls it off",
        ]}
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-11",
    category: "Tours",
    label: "Ticket-stub cards with punched circle notches, a dashed tear line between the trip details and the fare, and a mono booking reference code. Best for a small catalog of two to four trips from a boutique or playful nautical brand that wants a novelty presentation over a utilitarian listing.",
    file: "components/sections/tours/tour-11.tsx",
    component: "Tour11",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta",
    node: (
      <Tour11
        heading={{
          eyebrow: "Your boarding pass",
          title: "Book online, show the stub at Slip 14",
          body: "No printing, no paperwork. The crew ticks you off the list and you are aboard.",
        }}
        tours={demoTours.slice(0, 3)}
        cta={{ label: "Get your ticket", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-12",
    category: "Tours",
    label: "A dark, ink-toned section with three cards, the brand accent held at low alpha and an animated border beam tracing the featured boat. Best for a small set of premium offerings, like private charters or VIP add-ons, that a luxury-leaning operator wants set apart from the main trip grid.",
    file: "components/sections/tours/tour-12.tsx",
    component: "Tour12",
    props: "heading?: SectionHeading, tours: Tour[], cta?: Cta, featuredIndex?: number",
    node: (
      <Tour12
        heading={{
          eyebrow: "Private charter",
          title: "Take the whole boat for the evening",
          body: "Up to twelve guests, your route, your playlist. The crew handles the catering and the paperwork.",
        }}
        tours={demoTours.slice(0, 3)}
        featuredIndex={0}
        cta={{ label: "Enquire about a charter", href: "#contact" }}
      />
    ),
  },
  {
    code: "TOUR-13",
    category: "Tours",
    label: "A chip-filtered grid driven by trip tags, with a live result count and a real empty state instead of going blank. Best for a catalog large enough, eight or more trips, that guests need to filter by type of experience (snorkel, sunset, fishing, private) before browsing options.",
    file: "components/sections/tours/tour-13.tsx",
    component: "Tour13",
    props: "heading?: SectionHeading, tours: Tour[], allLabel?: string, cta?: Cta",
    node: (
      <Tour13
        heading={{
          eyebrow: "Find your trip",
          title: "Filter by what you actually want from the day",
          body: "Morning glass water, an afternoon on the reef, or the whole boat to yourselves.",
        }}
        tours={demoTours}
        allLabel="Every trip"
        cta={{ label: "Check availability", href: "#book" }}
      />
    ),
  },
  {
    code: "TOUR-14",
    category: "Tours",
    label: "A map panel that stays sticky on one side while a compact, scrollable trip list runs past it on the other. Best for operators where departure point or location is a real differentiator between trips, or a brand that wants to lead with where they sail from.",
    file: "components/sections/tours/tour-14.tsx",
    component: "Tour14",
    props: "heading?: SectionHeading, tours: Tour[], mapQuery: string, bbox?: string, marker?: string, cta?: Cta",
    sticky: true,
    node: (
      <Tour14
        heading={{
          eyebrow: "Where we sail from",
          title: "Slip 14, Renaissance Marina, Oranjestad",
          body: "Two minutes from the bus stop, free parking on the quay, and the boats are visible from the gate.",
        }}
        tours={demoTours}
        mapQuery={demoContact.mapQuery}
        cta={{ label: "Get directions", href: "#contact" }}
      />
    ),
  },
  {
    code: "TOUR-15",
    category: "Tours",
    label: "A head-to-head comparison of exactly two trips on a shared row grid, with the popular pick wearing a ribbon badge. Best for a simple binary choice, half day versus full day or two flagship packages, when guests decide between two options rather than browsing a full catalog.",
    file: "components/sections/tours/tour-15.tsx",
    component: "Tour15",
    props: "heading?: SectionHeading, tours: Tour[], popularIndex?: number, cta?: Cta",
    node: (
      <Tour15
        heading={{
          eyebrow: "Half day or full day",
          title: "Three hours on the reef, or six down the coast",
          body: "The two trips guests weigh up most often, every line on the same baseline so you can read across.",
        }}
        tours={demoTours.slice(1, 3)}
        popularIndex={0}
        cta={{ label: "Book this trip", href: "#book" }}
      />
    ),
  },
];
