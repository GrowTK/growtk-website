import type { CatalogEntry } from "@/components/sections/catalog-types";
import { Cta01 } from "@/components/sections/cta/cta-01";
import { Cta02 } from "@/components/sections/cta/cta-02";
import { Cta03 } from "@/components/sections/cta/cta-03";
import { Cta04 } from "@/components/sections/cta/cta-04";
import { Cta05 } from "@/components/sections/cta/cta-05";
import { Cta06 } from "@/components/sections/cta/cta-06";
import { Cta07 } from "@/components/sections/cta/cta-07";
import { Cta08 } from "@/components/sections/cta/cta-08";
import { Cta09 } from "@/components/sections/cta/cta-09";
import { Cta10 } from "@/components/sections/cta/cta-10";
import { Cta11 } from "@/components/sections/cta/cta-11";
import { Cta12 } from "@/components/sections/cta/cta-12";
import { demoContact, demoCta, demoCtaAlt, demoStats, img } from "@/content/demo";

export const CTA_ENTRIES: CatalogEntry[] = [
  {
    code: "CTA-01",
    category: "CTA",
    label: "Full bleed brand colour band with a centered eyebrow, headline, body line and a primary plus outline button pair, nothing else on the page competes for attention. Best for the final closing CTA at the very bottom of a homepage or long page, where you want one loud, simple, high conviction ask rather than a photo or proof point.",
    file: "components/sections/cta/cta-01.tsx",
    component: "Cta01",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta01
        heading={{
          eyebrow: "Slip 14, Renaissance Marina",
          title: "The trade winds drop at four. That is when we sail.",
          body: "Sunset departures run seven days a week from Oranjestad, twelve guests maximum, lunch and snorkel gear included.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Free rebooking if the captain calls it off for weather."
      />
    ),
  },
  {
    code: "CTA-02",
    category: "CTA",
    label: "A rounded card on a muted page background with a travelling border beam animation, heading left and stacked buttons right in an asymmetric split, quieter than a full colour band. Best for a mid page nudge between two content sections, where the ask should feel present but not shout, and the beam gives a small motion accent instead of a big colour hit.",
    file: "components/sections/cta/cta-02.tsx",
    component: "Cta02",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta02
        heading={{
          eyebrow: "Private charter",
          title: "Take the whole boat for the afternoon",
          body: "Eight to twelve guests, your route, your playlist. The crew handles the cake, the cooler and the paperwork.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Deposit refundable up to 48 hours out."
      />
    ),
  },
  {
    code: "CTA-03",
    category: "CTA",
    label: "A two column bordered panel: copy, a checklist of reassurance points and buttons on a solid card surface, a real photograph filling the other half edge to edge. Best for promoting one specific offering (a tour, a package, a room) where a supporting image and a short list of what is included do more convincing than headline copy alone.",
    file: "components/sections/cta/cta-03.tsx",
    component: "Cta03",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, image?: Img, points?: string[], footnote?: string",
    node: (
      <Cta03
        heading={{
          eyebrow: "Half day reef trip",
          title: "Two reefs, one lunch, back by three",
          body: "We leave the marina at nine, moor at Mangel Halto, then run north to the second reef while the galley grills the catch.",
        }}
        points={[
          "Mooring buoys instead of anchors, every trip",
          "Reef safe sunscreen and masks in children's sizes",
          "Vegetarian and allergy plates sorted when you book",
        ]}
        primary={demoCta}
        secondary={demoCtaAlt}
        image={img(3, "Snorkellers sliding off the stern ladder above the reef at Mangel Halto")}
        footnote="Departs daily at 09:00 from Slip 14."
      />
    ),
  },
  {
    code: "CTA-04",
    category: "CTA",
    label: "A narrow, centered band with a mail icon, heading and a single email field beside a submit button, plus a swapped in success line once submitted. Best for capturing an email address rather than driving a booking or purchase, for example a mailing list or conditions alert, and it is the only CTA block in this set with real form state.",
    file: "components/sections/cta/cta-04.tsx",
    component: "Cta04",
    props: "heading: SectionHeading, buttonLabel?: string, placeholder?: string, footnote?: string, successNote?: string",
    node: (
      <Cta04
        heading={{
          eyebrow: "Tide notes",
          title: "Know when the water is flat",
          body: "One short email each Thursday: the week's sailing conditions, open seats, and the odd turtle photo from the crew.",
        }}
        buttonLabel="Send me the notes"
        placeholder="you@example.com"
        footnote="One email a week. Unsubscribe in a click, no hard feelings."
        successNote="Thanks. Check your inbox to confirm and we will see you Thursday."
      />
    ),
  },
  {
    code: "CTA-05",
    category: "CTA",
    label: "A slim, sticky, blurred bar pinned to the bottom of the viewport with a price, an optional live availability line and a single booking button riding along every scroll position. Best for booking or pricing pages where the ask needs to stay reachable the whole time the visitor reads, not for a one off section inside a normal content flow.",
    file: "components/sections/cta/cta-05.tsx",
    component: "Cta05",
    props: "price: string, priceNote?: string, availability?: string, primary?: Cta",
    sticky: true,
    node: (
      <Cta05
        price="$89"
        priceNote="per guest"
        availability="Four seats left on Friday's sunset sail"
        primary={demoCta}
      />
    ),
  },
  {
    code: "CTA-06",
    category: "CTA",
    label: "A dark, full bleed panel washed with a soft colour mesh built from the primary token, an oversized headline and one big pill shaped button, no secondary link to dilute it. Best for a dramatic, high stakes closing moment on a premium or flagship page, where the brand colour and scale should read as a statement rather than a routine sign off.",
    file: "components/sections/cta/cta-06.tsx",
    component: "Cta06",
    props: "heading: SectionHeading, primary?: Cta, footnote?: string",
    node: (
      <Cta06
        heading={{
          eyebrow: "Blue Water Sail",
          title: "Twelve guests. One boat. No queue for the ladder.",
          body: "Twelve years running small trips out of Oranjestad with captains who grew up on this water.",
        }}
        primary={demoCta}
        footnote="Coast guard certified, hull inspected every year."
      />
    ),
  },
  {
    code: "CTA-07",
    category: "CTA",
    label: "Three big stacked numbers on hairline dividers hold the left column, a bordered card with the heading and buttons sits on the right, proof and ask side by side. Best for a CTA that needs to win trust first, such as years in business, reviews or guests served, immediately before asking for the click, better than any other CTA here when you actually have real numbers to show.",
    file: "components/sections/cta/cta-07.tsx",
    component: "Cta07",
    props: "heading: SectionHeading, stats?: Stat[], primary?: Cta, secondary?: Cta, footnote?: string",
    node: (
      <Cta07
        heading={{
          eyebrow: "Since 2013",
          title: "Book the boat the island books",
          body: "Most of our Friday seats go to people who sailed with us last season. The rest fill by Wednesday.",
        }}
        stats={demoStats}
        primary={demoCta}
        secondary={demoCtaAlt}
        footnote="Average guest rating across 2,400 reviews."
      />
    ),
  },
  {
    code: "CTA-08",
    category: "CTA",
    label: "Two large bordered tiles side by side, one a real tel: link for a phone call and one a real wa.me link for WhatsApp, each with an icon, the number itself and an optional note on hours or response time. Best for a direct human contact moment, a dedicated contact page or an FAQ page footer, when the goal is a call or message rather than an online booking or purchase.",
    file: "components/sections/cta/cta-08.tsx",
    component: "Cta08",
    props: "heading: SectionHeading, phone: string, whatsapp: string, callLabel?, messageLabel?, callNote?, messageNote?, footnote?",
    node: (
      <Cta08
        heading={{
          eyebrow: "Talk to the crew",
          title: "Questions about the swell, the kids, or the cooler?",
          body: "Someone at Slip 14 picks up between seven and seven. If the boat is out, WhatsApp reaches the office instead.",
        }}
        phone={demoContact.phone}
        whatsapp={demoContact.whatsapp}
        callLabel="Call the marina office"
        messageLabel="Message us on WhatsApp"
        callNote="Monday to Saturday, 07:00 to 19:00 island time."
        messageNote="Usually answered within the hour, photos welcome."
        footnote="Slip 14, Renaissance Marina, Oranjestad."
      />
    ),
  },
  {
    code: "CTA-09",
    category: "CTA",
    label: "An editorial band bounded by top and bottom hairlines, no card or colour block, with an oversized headline that runs the button inline as part of the last line of text itself. Best for a typographic, magazine style page where the copy is confident enough to carry the section on its own, and for pairing with an urgency line like limited seats rather than a long body paragraph.",
    file: "components/sections/cta/cta-09.tsx",
    component: "Cta09",
    props: "heading: SectionHeading, tail?: string, primary?: Cta, footnote?: string",
    node: (
      <Cta09
        heading={{
          eyebrow: "Oranjestad",
          title: "The reef is twenty minutes out and the boat leaves at nine.",
          body: "Sunset cruise, snorkel and sail, or the whole boat to yourself. Twelve guests maximum on every departure.",
        }}
        tail="Seats go fast."
        primary={demoCta}
        footnote="Slip 14, Renaissance Marina. Daily departures 09:00 and 16:30."
      />
    ),
  },
  {
    code: "CTA-10",
    category: "CTA",
    label: "An asymmetric twelve column layout: a coloured panel with the heading and buttons runs wide on the left, a photo card overlaps its right edge and spills past the boundary instead of sitting in a clean half. Best for a mid page CTA that still wants colour and an image together but needs a more dynamic, less symmetrical feel than the straight split panel, useful as a change of pace section on a page that already carries a plain full bleed CTA elsewhere.",
    file: "components/sections/cta/cta-10.tsx",
    component: "Cta10",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, image?: Img, footnote?: string",
    node: (
      <Cta10
        heading={{
          eyebrow: "Sunset cruise",
          title: "Cast off at half four, back under the lights",
          body: "Two and a half hours down the leeward coast with the galley open and the sails up the whole way.",
        }}
        primary={demoCta}
        secondary={demoCtaAlt}
        image={img(7, "Blue Water Sail's catamaran heeling into the light off the Oranjestad coast")}
        footnote="Prices are per guest and include lunch, drinks and snorkel gear. Children under six sail free with a paying adult."
      />
    ),
  },
  {
    code: "CTA-11",
    category: "CTA",
    label: "Cta03's split panel, floating on a full bleed photo backdrop that fills the whole section behind it, the card catching a real shadow for depth instead of sitting flat on the page background. Best for a closing CTA that wants the split panel's checklist and photo but needs more atmosphere than a plain white or muted section gives it.",
    file: "components/sections/cta/cta-11.tsx",
    component: "Cta11",
    props: "heading: SectionHeading, primary?: Cta, secondary?: Cta, image?: Img, backdrop: Img, points?: string[], footnote?: string",
    node: (
      <Cta11
        heading={{
          eyebrow: "Half day reef trip",
          title: "Two reefs, one lunch, back by three",
          body: "We leave the marina at nine, moor at Mangel Halto, then run north to the second reef while the galley grills the catch.",
        }}
        points={[
          "Mooring buoys instead of anchors, every trip",
          "Reef safe sunscreen and masks in children's sizes",
          "Vegetarian and allergy plates sorted when you book",
        ]}
        primary={demoCta}
        secondary={demoCtaAlt}
        image={img(3, "Snorkellers sliding off the stern ladder above the reef at Mangel Halto")}
        backdrop={img(28, "Open water and coastline seen from the deck")}
        footnote="Departs daily at 09:00 from Slip 14."
      />
    ),
  },
  {
    code: "CTA-12",
    category: "CTA",
    label: "Cta06's dark, full bleed closing panel, a real photo behind the scrim instead of a token colour mesh, centered eyebrow, oversized headline and one big pill button. Best for a dramatic, photo led closing moment when the brand has a strong image to spend on the very last section, rather than an abstract colour treatment.",
    file: "components/sections/cta/cta-12.tsx",
    component: "Cta12",
    props: "heading: SectionHeading, primary?: Cta, footnote?: string, image: Img",
    node: (
      <Cta12
        heading={{
          eyebrow: "Slip 14, Renaissance Marina",
          title: "The trade winds drop at four. That is when we sail.",
          body: "Sunset departures run seven days a week from Oranjestad, twelve guests maximum, lunch and snorkel gear included.",
        }}
        primary={demoCta}
        image={img(15, "Sailboat silhouetted against a sunset")}
        footnote="Free rebooking if the captain calls it off for weather."
      />
    ),
  },
];
