/**
 * The section catalogue: metadata plus a rendered demo for each entry.
 *
 * `code` is the stable handle. It is what appears in the copied prompt, so a
 * build agent can resolve a selection straight to an import without guessing.
 * Keep codes stable once published.
 */
import { Nav01 } from "@/components/sections/nav/nav-01";
import { Nav02 } from "@/components/sections/nav/nav-02";
import { Nav03 } from "@/components/sections/nav/nav-03";
import { Nav04 } from "@/components/sections/nav/nav-04";
import { Nav05 } from "@/components/sections/nav/nav-05";
import { Hero01 } from "@/components/sections/hero/hero-01";
import { Hero02 } from "@/components/sections/hero/hero-02";
import { Hero03 } from "@/components/sections/hero/hero-03";
import { Hero04 } from "@/components/sections/hero/hero-04";
import { Hero05 } from "@/components/sections/hero/hero-05";
import { Hero06 } from "@/components/sections/hero/hero-06";
import { Hero07 } from "@/components/sections/hero/hero-07";
import { Hero08 } from "@/components/sections/hero/hero-08";
import { Hero09 } from "@/components/sections/hero/hero-09";
import { Hero10 } from "@/components/sections/hero/hero-10";
import { Hero11 } from "@/components/sections/hero/hero-11";
import { Hero12 } from "@/components/sections/hero/hero-12";
import { Hero13 } from "@/components/sections/hero/hero-13";
import { Hero14 } from "@/components/sections/hero/hero-14";
import { Hero15 } from "@/components/sections/hero/hero-15";
import { Hero16 } from "@/components/sections/hero/hero-16";
import { Hero17 } from "@/components/sections/hero/hero-17";
import { Hero18 } from "@/components/sections/hero/hero-18";
import { Hero19 } from "@/components/sections/hero/hero-19";
import { Hero20 } from "@/components/sections/hero/hero-20";
import { Hero21 } from "@/components/sections/hero/hero-21";
import { Feature01 } from "@/components/sections/features/feature-01";
import { Feature02 } from "@/components/sections/features/feature-02";
import { Feature03 } from "@/components/sections/features/feature-03";
import { Feature04 } from "@/components/sections/features/feature-04";
import { Feature05 } from "@/components/sections/features/feature-05";
import { Feature06 } from "@/components/sections/features/feature-06";
import { Feature07 } from "@/components/sections/features/feature-07";
import { Feature08 } from "@/components/sections/features/feature-08";
import { FeatureBlob } from "@/components/sections/features/feature-blob";
import { FeatureVoiceBlob } from "@/components/sections/features/voice-blob";
import { NAV_ENTRIES } from "@/components/sections/nav/entries";
import { FOOTER_ENTRIES } from "@/components/sections/footer/entries";
import { TESTIMONIAL_ENTRIES } from "@/components/sections/testimonials/entries";
import { MEDIA_ENTRIES } from "@/components/sections/media/entries";
import { GALLERY_ENTRIES } from "@/components/sections/gallery/entries";
import { FAQ_ENTRIES } from "@/components/sections/faq/entries";
import { CTA_ENTRIES } from "@/components/sections/cta/entries";
import { TOUR_ENTRIES } from "@/components/sections/tours/entries";
import { ABOUT_ENTRIES } from "@/components/sections/about/entries";
import { BLOG_ENTRIES } from "@/components/sections/blog/entries";
import { CONTACT_ENTRIES } from "@/components/sections/contact/entries";
import { QUOTE_ENTRIES } from "@/components/sections/quote/entries";
import { FLEET_ENTRIES } from "@/components/sections/fleet/entries";
import { TEMPLATE_ENTRIES } from "@/components/templates/entries";
import { SPOTLIGHT_ENTRIES } from "@/components/sections/spotlight/entries";
import { demoCta, demoCtaAlt, demoFeatures, demoNav, demoStats, img } from "@/content/demo";

export type { CatalogEntry } from "@/components/sections/catalog-types";
import type { CatalogEntry } from "@/components/sections/catalog-types";

const withImages = demoFeatures.map((f, i) => ({ ...f, image: img(20 + i, f.title) }));

export const CATALOG: CatalogEntry[] = [
  { code: "NAV-01", category: "Navbar", label: "A pill shaped navbar that floats over the hero with no border, shrinking and gaining a background the instant the page scrolls, with a real slide out mobile sheet. Best for a hero led landing page with a strong photo or colour block up top that the pill can float over cleanly, not a page that opens straight into dense content.", sticky: true, overlay: true,
    file: "components/sections/nav/nav-01.tsx", component: "Nav01", props: "brand, items: NavItem[], cta?, overlay=true",
    node: <Nav01 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { code: "NAV-02", category: "Navbar", label: "A two tier navbar: a slim coloured utility bar up top always showing the phone number, with the main navigation and logo below it. Best for a business that takes phone bookings directly and wants that number visible on every page, not buried in the footer.", sticky: true,
    file: "components/sections/nav/nav-02.tsx", component: "Nav02", props: "brand, items, cta?, phone?",
    node: <Nav02 brand="Marlin Charters" items={demoNav} cta={demoCta} phone="+297 592 1140" /> },
  { code: "NAV-03", category: "Navbar", label: "An editorial navbar with the wordmark centred and nav links split evenly on either side, bordered and set in small tracked type with no icons. Best for a boutique or editorial brand wanting a quiet, typographic first impression rather than a busy utility bar.", sticky: true,
    file: "components/sections/nav/nav-03.tsx", component: "Nav03", props: "brand, items, cta?",
    node: <Nav03 brand="Marlin" items={demoNav} cta={demoCta} /> },
  { code: "NAV-04", category: "Navbar", label: "A mega menu navbar where hovering a nav item opens a real panel rather than a flat dropdown list, built around showing a rating badge next to the brand. Best for a tour or activity business with enough distinct trips or categories that a single flat link list would get overwhelming.", sticky: true,
    file: "components/sections/nav/nav-04.tsx", component: "Nav04", props: "brand, items (with children), cta?, rating?",
    node: <Nav04 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },
  { code: "NAV-05", category: "Navbar", label: "A permanently dark, high contrast bar that stays solid at the top of the page regardless of what sits beneath it, never transparent or floating. Best for a brand with a very bright or busy hero photo where a transparent or light navbar would disappear into it.", sticky: true,
    file: "components/sections/nav/nav-05.tsx", component: "Nav05", props: "brand, items, cta?",
    node: <Nav05 brand="Marlin Charters" items={demoNav} cta={demoCta} /> },

  { code: "HERO-01", category: "Hero", label: "A classic split hero: headline and body copy on the left, one photo on the right, with a row of stats running beneath both. Best for a business with real numbers to show immediately (years running, guests served, a rating) and one strong photo, the safest and most broadly applicable hero in the library.",
    file: "components/sections/hero/hero-01.tsx", component: "Hero01", props: "eyebrow?, title, body, image, ctas[], stats[], rating?",
    node: <Hero01 eyebrow="Small group sailing" title="Twelve guests, one reef, no queue for the ladder"
      body="Half and full day trips from Slip 14. Local captains, lunch cooked aboard, gear that actually fits."
      image={img(0, "Sailboat moored in clear water")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" /> },
  { code: "HERO-02", category: "Hero", label: "Full bleed photo across the top with the headline and copy sitting on a solid card underneath it, never text laid over the photo. Best for when the photo itself needs to be the first, uninterrupted thing a visitor sees and readability matters more than a punchy overlap.", leadsWithMedia: true,
    file: "components/sections/hero/hero-02.tsx", component: "Hero02", props: "eyebrow?, title, body, image, ctas[]",
    node: <Hero02 eyebrow="Since 2013" title="The reef is twenty minutes out. We know the calm side."
      body="Twelve seasons of logbooks decide where we anchor, not a brochure."
      image={img(31, "Open sea from a boat bow")} ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-03", category: "Hero", label: "A saturated colour block hero with no photograph at all, just bold type and conviction. Best for a brand with a strong colour identity but no hero-worthy photo yet, or one making a confident, minimal first statement rather than leading with imagery.",
    file: "components/sections/hero/hero-03.tsx", component: "Hero03", props: "eyebrow?, title, body, ctas[], footnote?",
    node: <Hero03 eyebrow="Daily departures" title="Book the boat, not a seat on it."
      body="Private charters for up to twelve, your route and your playlist. The crew handles the rest."
      ctas={[demoCta, demoCtaAlt]} footnote="Free rebooking if the captain calls it off for weather." /> },
  { code: "HERO-04", category: "Hero", label: "An editorial hero with hairline rules and wide letter tracking, built around a five photo strip laid out over two uneven rows. Best for a business with a genuinely strong, varied set of five photos and a magazine-like, considered brand voice rather than a punchy sales pitch.",
    file: "components/sections/hero/hero-04.tsx", component: "Hero04", props: "eyebrow?, title, body, images[5], ctas[], meta[]",
    node: <Hero04 eyebrow="Marlin Charters" title="Sail the leeward coast the way the crew would on a day off"
      body="Three snorkel stops, a beach landing, and lunch off the back deck."
      images={[
        img(1, "Catamaran at anchor in clear water"),
        img(2, "Snorkeller above a shallow reef"),
        img(3, "Beach seen from the water"),
        img(19, "Guests boarding at the dock"),
        img(11, "Crew member at the helm"),
      ]}
      ctas={[demoCta]} meta={["Slip 14", "12 guests max", "Est. 2013"]} /> },
  { code: "HERO-05", category: "Hero", label: "Copy on the left beside a flush four photo mosaic on the right, the photos clipped together into one seamless block with no gaps between them. Best for a business with four strong, varied photos and enough to say that the copy column needs more than a single short line.",
    file: "components/sections/hero/hero-05.tsx", component: "Hero05", props: "eyebrow?, title, body, paragraphs[], images[4], ctas[], location?, stats[]",
    node: <Hero05 eyebrow="Half day from $68" title="Two reef stops before lunch"
      body="Out at nine from Slip 14, back at the dock by one. Twelve guests, two crew, gear that actually fits, and a galley that feeds everyone aboard."
      paragraphs={[
        "The first stop is the leeward reef, twenty minutes out, where the water stays calm even when the trade winds pick up in the afternoon. We tie to a mooring buoy rather than dropping an anchor, so nothing gets dragged across the coral.",
        "Lunch is grilled on the back deck while the boat swings on the mooring. Tell us about allergies when you book and the galley sorts it, including vegetarian, vegan and gluten free plates.",
      ]}
      images={[img(4, "View across the deck at sea"), img(5, "Turquoise shallows over pale sand"), img(6, "Crew trimming a sail"), img(7, "Reef fish in clear water")]}
      ctas={[demoCta, demoCtaAlt]} location="Slip 14, Oranjestad Marina" stats={demoStats} /> },
  { code: "HERO-06", category: "Hero", label: "Centred headline and copy with a horizontally scrolling band of photos running beneath it. Best for a business with a wide, varied photo set worth browsing right on the hero, without committing to any single image as THE hero shot.",
    file: "components/sections/hero/hero-06.tsx", component: "Hero06", props: "eyebrow?, title, body, images[], ctas[]",
    node: <Hero06 eyebrow="This season" title="Every trip ends with the sun on the water"
      body="Sunset cruise, snorkel and sail, or the full day coast run."
      images={[img(8, "Sunset over the sea"), img(9, "Sail against the sky"), img(10, "Guests swimming"), img(11, "Boat wake at dusk"), img(12, "Anchored at golden hour"), img(13, "Coastline from the water")]}
      ctas={[demoCta]} /> },
  { code: "HERO-07", category: "Hero", label: "A dark hero built around an inline booking form: the form itself is the whole point of the section, not a decorative afterthought. Best for a business where visitors expect to check availability or start a booking immediately, like a tour operator or reservation driven business, rather than one that needs to sell the idea first.",
    file: "components/sections/hero/hero-07.tsx", component: "Hero07", props: "eyebrow?, title, body, image, tours[], action?, ctaLabel?",
    node: <Hero07 eyebrow="Live availability" title="Pick a date. We will tell you what is open."
      body="No card needed to hold a spot, and the captain confirms the weather by 7am."
      image={img(14, "Boat ready at the dock")}
      tours={["Sunset cruise with dinner", "Snorkel and sail half day", "Full day coast run", "Private charter"]} /> },
  { code: "HERO-08", category: "Hero", label: "An asymmetric hero where a price card physically overlaps the edge of the photo. Best for a business that wants price visible in the very first view, like a tour with a clear per person rate, rather than one where price is secondary or variable.",
    file: "components/sections/hero/hero-08.tsx", component: "Hero08", props: "eyebrow?, title, body, image, price, period?, duration?, rating?, ctas[]",
    node: <Hero08 eyebrow="Most booked" title="Sunset cruise with dinner aboard"
      body="Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange."
      image={img(15, "Sailboat silhouetted at sunset")} price="$88" period="per guest" duration="3 hours, evening" rating="4.9" ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-09", category: "Hero", label: "Two photos in offset, overlapping frames with a rule lined heading. Best for a business with exactly two strong complementary shots, say the boat and the destination, rather than one hero image or a whole gallery's worth.",
    file: "components/sections/hero/hero-09.tsx", component: "Hero09", props: "eyebrow?, title, body, images[2], ctas[], highlights[]",
    node: <Hero09 eyebrow="Private charter" title="The whole boat, and a crew who plan around you"
      body="Twelve guests, catering to order, and a route you choose on the morning."
      images={[img(16, "Catamaran under sail"), img(17, "Table set on deck")]} ctas={[demoCta, demoCtaAlt]}
      highlights={["Up to twelve guests", "Catering and bar to order", "Departure time is yours", "Skipper and mate included"]} /> },
  { code: "HERO-10", category: "Hero", label: "A hero with a video thumbnail that opens into a real modal dialog when clicked, rather than an embedded autoplay clip. Best for a business with an actual promotional or explainer video worth watching in full, not just decorative background footage.",
    file: "components/sections/hero/hero-10.tsx", component: "Hero10", props: "eyebrow?, title, body, image, videoUrl, ctas[], caption?",
    node: <Hero10 eyebrow="Watch first" title="Ninety seconds aboard the Marlin II"
      body="Shot on an ordinary Tuesday in March, no drone operator and no actors."
      image={img(18, "Catamaran deck under way")} videoUrl="https://www.youtube.com/embed/dQw4w9WgXcQ"
      ctas={[demoCta, demoCtaAlt]} caption="Filmed on the full day coast run" /> },

  { code: "HERO-11", category: "Hero", label: "Full video background with the copy sitting directly on the footage, autoplaying muted and inline with a carefully tuned directional gradient for contrast. Best for a business with genuinely good b-roll footage, the boat underway, the view, the activity in motion, worth using as atmosphere rather than a static photo dressed up.", leadsWithMedia: true,
    file: "components/sections/hero/hero-11.tsx", component: "Hero11", props: "eyebrow?, title, body, videoSrc, poster, ctas[], footnote?",
    node: <Hero11 eyebrow="Aboard the Marlin II" title="Twenty minutes from the dock to open water"
      body="Muted autoplay, real footage, no stock drone reel. Pause it any time."
      videoSrc="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"
      poster={img(0, "Sailboat under way in open water")} ctas={[demoCta, demoCtaAlt]}
      footnote="Filmed on the full day coast run, March 2026." /> },
  { code: "HERO-12", category: "Hero", label: "A slow, cross fading photo background with a gentle Ken Burns drift, copy sitting on top with dot controls so a visitor can hold a favourite frame. Best for a business with several strong photos and no video, wanting the same cinematic, ever changing feel as a video hero without needing actual footage.", leadsWithMedia: true,
    file: "components/sections/hero/hero-12.tsx", component: "Hero12", props: "eyebrow?, title, body, images[], ctas[], interval?, badge?",
    node: <Hero12 badge="Most booked" eyebrow="Four trips daily" title="The coast changes every hour. So does the trip."
      body="Sunrise dolphin runs, midday reef stops, and the sunset cruise everyone rebooks."
      images={[img(1, "Catamaran at anchor in turquoise water"), img(8, "Sunset over the sea"), img(5, "Turquoise shallows over sand"), img(16, "Catamaran under full sail")]}
      ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-13", category: "Hero", label: "Content on the left, one photo bleeding all the way to the top, bottom and right edge of the viewport with no padding or rounded corners at all. Best for a strong vertical or full height photo that benefits from filling the whole frame rather than being contained in a card.",
    file: "components/sections/hero/hero-13.tsx", component: "Hero13", props: "eyebrow?, title, body, image, ctas[], bullets[]",
    node: <Hero13 eyebrow="Half day from $68" title="Two reef stops, lunch aboard, back by one"
      body="Out at nine from Slip 14. Twelve guests, two crew, and water calm enough for a four year old."
      image={img(19, "Guests boarding at the dock")} ctas={[demoCta, demoCtaAlt]}
      bullets={["Masks and fins in every size", "Lunch cooked on the back deck", "Free rebooking if weather cancels", "Reef safe sunscreen supplied"]} /> },
  { code: "HERO-14", category: "Hero", label: "The mirror of Hero13: the same full bleed, edge to edge photo treatment but on the left, with copy on the right. Best for the same kind of strong vertical photo as Hero13, choose this one when the photo's own composition reads better on the left.",
    file: "components/sections/hero/hero-14.tsx", component: "Hero14", props: "eyebrow?, title, body, image, ctas[], stats[], rating?",
    node: <Hero14 eyebrow="Twelve seasons" title="The crew grew up on this coast"
      body="Every skipper is local and licensed, and knows which reef stays calm when the trades pick up."
      image={img(11, "Crew member at the helm")} ctas={[demoCta, demoCtaAlt]} stats={demoStats} rating="4.9" /> },
  { code: "HERO-15", category: "Hero", label: "A full photo background with a solid, saturated colour block laid over part of it carrying all the copy, fully opaque so contrast never depends on the photo underneath. Best for a photo that is busy or unpredictable in tone but still worth using as atmosphere, since the opaque block guarantees legibility regardless.", leadsWithMedia: true,
    file: "components/sections/hero/hero-15.tsx", component: "Hero15", props: "eyebrow?, title, body, image, ctas[], note?",
    node: <Hero15 eyebrow="Private charter" title="Book the boat, not a seat on it"
      body="Up to twelve guests, catering to order, and a route you pick on the morning."
      image={img(16, "Catamaran under sail in open water")} ctas={[demoCta, demoCtaAlt]}
      note="Deposit refundable up to 72 hours before departure." /> },
  { code: "HERO-16", category: "Hero", label: "A full bleed photo filling the entire hero with a solid, opaque booking strip anchored along the bottom edge. Best for a business that wants the photo completely uninterrupted while still surfacing a real booking prompt low in the frame, a quieter alternative to Hero07's full inline form.", leadsWithMedia: true,
    file: "components/sections/hero/hero-16.tsx", component: "Hero16", props: "eyebrow?, title, image, ctas[], facts[]",
    node: <Hero16 eyebrow="Sunset cruise" title="Anchor off the lighthouse as the sky goes orange"
      image={img(15, "Sailboat silhouetted against a sunset")} ctas={[demoCta, demoCtaAlt]}
      facts={[{ icon: "clock", label: "Duration", value: "3 hours, departs 17:30" }, { icon: "users", label: "Group size", value: "12 guests maximum" }, { icon: "pin", label: "Departs", value: "Slip 14, Oranjestad Marina" }]} /> },
  { code: "HERO-17", category: "Hero", label: "Centred type sitting directly on the photo with no card or panel at all, contrast carried entirely by a carefully measured dark scrim. Best reserved for a photo that can survive being noticeably darkened; use Hero15 or Hero16 instead when the picture needs to stay bright and true to colour.", leadsWithMedia: true,
    file: "components/sections/hero/hero-17.tsx", component: "Hero17", props: "eyebrow?, title, body, image, ctas[], scrollHint?",
    node: <Hero17 eyebrow="Marlin Charters, est. 2013" title="Sail the leeward coast"
      body="Small groups, local captains, and twelve seasons of knowing where the water stays calm."
      image={img(33, "Open ocean horizon at dusk")} ctas={[demoCta, demoCtaAlt]} scrollHint="Scroll for the trips" /> },

  { code: "HERO-18", category: "Hero", label: "A rotating photo background with centred copy, previous and next arrows and a progress bar that doubles as a timer. Best for a business with several equally strong photos and nothing more specific to say about any one of them individually, a general purpose rotating hero.", leadsWithMedia: true,
    file: "components/sections/hero/hero-18.tsx", component: "Hero18", props: "eyebrow?, title, body, images[], ctas[], interval?",
    node: <Hero18 eyebrow="Four trips daily" title="Sail the leeward coast"
      body="Small groups, local captains, and twelve seasons of knowing where the water stays calm."
      images={[img(33, "Open ocean at dusk"), img(1, "Catamaran at anchor"), img(8, "Sunset over the sea"), img(16, "Catamaran under full sail")]}
      ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-19", category: "Hero", label: "A rotating photo background with copy bottom left and a clickable thumbnail rail bottom right, so a visitor can see what is coming and jump straight to it. Best for a business with several distinct offerings worth previewing up front, like different trip types, rather than one that is just cycling through pretty shots of the same thing.", leadsWithMedia: true,
    file: "components/sections/hero/hero-19.tsx", component: "Hero19", props: "eyebrow?, title, body, images[], ctas[], interval?",
    node: <Hero19 eyebrow="Slip 14, Oranjestad" title="Pick the trip, we will read the water"
      body="The captain calls the route on the morning, based on wind and swell, not on a brochure."
      images={[img(5, "Turquoise shallows over sand"), img(2, "Snorkeller above coral"), img(19, "Guests boarding at the dock"), img(15, "Sailboat at sunset"), img(11, "Crew at the helm")]}
      ctas={[demoCta, demoCtaAlt]} /> },
  { code: "HERO-20", category: "Hero", label: "A true slideshow where each slide carries its own headline, copy and price, not just a shared caption over rotating photos. Best for a business that needs to sell several genuinely different offerings above the fold, like three distinct tour packages at different price points, rather than one message with supporting imagery.", leadsWithMedia: true,
    file: "components/sections/hero/hero-20.tsx", component: "Hero20", props: "slides: HeroSlide[], cta?, interval?",
    node: <Hero20 cta={demoCta} slides={[
      { image: img(15, "Sailboat silhouetted at sunset"), eyebrow: "Most booked", title: "Sunset cruise with dinner aboard", body: "Leave at golden hour, anchor off the lighthouse, eat while the sky goes orange.", price: "$88", duration: "3 hours, departs 17:30" },
      { image: img(2, "Snorkeller above a shallow reef"), eyebrow: "Family favourite", title: "Snorkel and sail, half day", body: "Two reef stops in calm water, gear supplied, lunch cooked on the back deck.", price: "$68", duration: "3.5 hours, departs 09:00" },
      { image: img(16, "Catamaran under full sail"), eyebrow: "For a full day out", title: "Coast run to the sand bar", body: "Down the coast with three swim stops and a beach landing before the run home.", price: "$124", duration: "6 hours, departs 09:30" },
      { image: img(17, "Table set on a boat deck"), eyebrow: "Private", title: "The whole boat, your route", body: "Up to twelve guests, catering to order, and a departure time that suits you.", price: "$960", duration: "Flexible" },
    ]} /> },
  { code: "HERO-21", category: "Hero", label: "Full bleed autoplaying video with zero text laid over it, ever, the copy sits on a solid card overlapping the video's bottom edge instead, exactly Hero02's 'photo, then a card below it' rule applied to motion. Best for genuinely good b-roll footage when the footage itself needs to be seen clearly, choose Hero11 instead if the brand wants copy sitting directly on the video.", leadsWithMedia: true,
    file: "components/sections/hero/hero-21.tsx", component: "Hero21", props: "eyebrow?, title, body, videoSrc, poster?, ctas[], announcement?",
    node: <Hero21 announcement="Small group sailing, Slip 14" title="Twenty minutes from the dock to open water"
      body="Muted autoplay, real footage, no stock drone reel."
      videoSrc="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"
      poster={img(0, "Sailboat under way in open water")} ctas={[demoCta, demoCtaAlt]} /> },

  { code: "FEAT-01", category: "Features", label: "A clean three column grid of icon led feature cards with a hairline divider running between rows. Best for a straightforward list of three, six or nine features, amenities or inclusions with no photo needed for any of them, the simplest and most neutral features layout in the library.",
    file: "components/sections/features/feature-01.tsx", component: "Feature01", props: "heading: SectionHeading, features: Feature[]",
    node: <Feature01 heading={{ eyebrow: "Why us", title: "What twelve seasons taught us", body: "Small boats, local crews, and no upselling on the water." }} features={demoFeatures} /> },
  { code: "FEAT-02", category: "Features", label: "A bento style grid where one feature gets a large featured cell with its own photo and the rest sit as smaller compact cards around it. Best for a business with one standout feature or offering worth visually leading with, alongside several smaller supporting points.",
    file: "components/sections/features/feature-02.tsx", component: "Feature02", props: "heading, features[] (first needs image)",
    node: <Feature02 heading={{ eyebrow: "Aboard", title: "What is included, and what is not" }} features={withImages} /> },
  { code: "FEAT-03", category: "Features", label: "Alternating full rows of photo and text, swapping sides each time, with optional bullet lists per row. Best for walking a visitor through a short sequence like a day's itinerary or a multi-step process, where each step deserves its own real photo rather than just an icon.",
    file: "components/sections/features/feature-03.tsx", component: "Feature03", props: "heading?, rows: {title, body, image, bullets[]}[]",
    node: <Feature03 heading={{ eyebrow: "How a day runs", title: "From the dock to the last swim stop" }}
      rows={[
        { title: "Board at Slip 14", body: "Arrive fifteen minutes early. Parking is free and the crew stows your bag in the dry locker.", image: img(19, "Guests boarding at the dock"), bullets: ["Free marina parking", "Dry storage aboard", "Safety briefing before we leave"] },
        { title: "First reef stop", body: "Twenty minutes out to the leeward reef, where the water stays calm when the trades pick up.", image: img(20, "Snorkellers in calm water"), bullets: ["Masks and fins in every size", "Crew in the water with you", "Mooring buoy, never an anchor"] },
        { title: "Lunch on the back deck", body: "Grilled catch, fruit, and cold drinks while the boat swings on the mooring.", image: img(21, "Food served on a boat deck"), bullets: ["Vegetarian and vegan plates", "Allergies handled at booking", "Beer and wine after the last swim"] },
      ]} /> },
  { code: "FEAT-04", category: "Features", label: "A numbered list of features running down a dark, high contrast panel, split beside the heading. Best for a process, itinerary or exactly what's included list where the order matters and a dark treatment gives it more weight than a plain white section.",
    file: "components/sections/features/feature-04.tsx", component: "Feature04", props: "heading, features[]",
    node: <Feature04 heading={{ eyebrow: "Included", title: "Everything in the price", body: "No fuel surcharge, no gear rental, no tipping expected." }} features={demoFeatures} /> },
  { code: "FEAT-05", category: "Features", label: "A real tabbed panel, keyboard operable with arrow keys and Home/End wired up, where each tab crossfades into a different photo, with an optional auto advance timer. Best for presenting several distinct trip or service options side by side that a visitor picks between; higher effort than a plain grid, so reserve it for a page's main feature section.",
    file: "components/sections/features/feature-05.tsx", component: "Feature05", props: "heading, features: TabItem[] (tab?, bullets[], meta?, cta?), autoAdvance?",
    node: <Feature05 autoAdvance={7000}
      heading={{ eyebrow: "Choose a trip", title: "Four ways to spend a day on the water", body: "Every trip leaves from Slip 14 with twelve guests maximum and two crew aboard." }}
      features={[
        { icon: "Sunset", tab: "Sunset cruise", title: "Sunset cruise with dinner aboard", meta: "3 hours, departs 17:30", body: "Leave at golden hour, anchor off the lighthouse, and eat while the sky goes orange.", image: img(15, "Sailboat silhouetted against a sunset"), bullets: ["Grilled catch cooked on board", "Beer, wine and soft drinks", "Back at the dock by 20:30"], cta: { label: "Book the sunset cruise", href: "#book" } },
        { icon: "Waves", tab: "Snorkel and sail", title: "Snorkel and sail, half day", meta: "3.5 hours, departs 09:00", body: "Two reef stops in water calm enough for a four year old, with the crew in the water alongside you.", image: img(2, "Snorkeller above a shallow reef"), bullets: ["Masks and fins in every size", "Mooring buoys, never an anchor", "Reef safe sunscreen supplied"], cta: { label: "Book the half day", href: "#book" } },
        { icon: "Compass", tab: "Coast run", title: "Full day run to the sand bar", meta: "6 hours, departs 09:30", body: "Down the leeward coast with three swim stops and a beach landing before the run home.", image: img(16, "Catamaran under full sail"), bullets: ["Three swim stops", "Beach landing and lunch ashore", "Towels and shade on deck"], cta: { label: "Book the full day", href: "#book" } },
        { icon: "Ship", tab: "Private charter", title: "The whole boat, your route", meta: "Flexible, up to 12 guests", body: "Pick the departure time and the route on the morning. The galley caters to order.", image: img(17, "Table set on a boat deck"), bullets: ["Up to twelve guests", "Catering and bar to order", "Bring your own playlist"], cta: { label: "Enquire about a charter", href: "#contact" } },
      ]} /> },
  { code: "FEAT-06", category: "Features", label: "A narrow heading column beside a plain two column grid of icon led text, no cards, no dividers, no numbers. Best for a quick, scannable list of six or so credentials, guarantees or capabilities that need to read as sober fact rather than a decorated feature grid, like a fleet's safety credentials or a booking platform's guarantees.",
    file: "components/sections/features/feature-06.tsx", component: "Feature06", props: "heading: SectionHeading, features: Feature[]",
    node: <Feature06 heading={{ eyebrow: "Built for charter operators", title: "Everything a marina needs to sign off on", body: "The credentials operators ask about before they will list a boat, not after." }}
      features={[
        { icon: "ShieldCheck", title: "Coast guard certified", body: "Annual hull inspection on record, and a certificate the marina office can call to verify." },
        { icon: "LifeBuoy", title: "Life jackets in every size", body: "Infant through adult, checked and restocked before each season, not just before an inspection." },
        { icon: "Radio", title: "VHF and GPS on every boat", body: "Marine radio and a tracked position, monitored from the dock during every trip out." },
        { icon: "FileCheck", title: "Licensed, insured crew", body: "Every skipper carries a commercial licence, and the fleet carries passenger liability cover." },
        { icon: "Wrench", title: "Logged maintenance", body: "Engine hours and service history kept per boat, available to the marina on request." },
        { icon: "CloudSun", title: "A real weather policy", body: "A published call time and a free rebooking rule, not a judgement call made at the dock." },
      ]} /> },
  { code: "FEAT-07", category: "Features", label: "A split header, heading on the left and supporting copy plus a CTA button on the right, above a plain grid of numbered cards rather than icon-led ones. Best for a concrete, countable list of offerings or guarantees that reads well as a numbered index, six or so items, paired with a single clear next action like 'see the full list'.",
    file: "components/sections/features/feature-07.tsx", component: "Feature07", props: "heading: SectionHeading, cta?: Cta, features: Feature[]",
    node: <Feature07
      heading={{ eyebrow: "Every trip", title: "Six things every charter includes", body: "The same list whether it is your first sail with us or your fiftieth." }}
      cta={{ label: "See all trips", href: "#tours" }}
      features={demoFeatures} /> },
  { code: "FEAT-08", category: "Features", label: "A swipeable filmstrip of journal style cards: a tag pill and an index chip up top, a headline and body, then a tall photo with an icon and a two line caption resting on its own gradient. Best for a small set of capabilities that each want real editorial presence, more than a plain gallery caption, distinct from a stock icon grid feature list.",
    file: "components/sections/features/feature-08.tsx", component: "Feature08", props: "heading?: SectionHeading, cards: { image: Img, tag: string, title: string, body: string, icon: string, caption: [string, string] }[]",
    node: <Feature08
      heading={{ eyebrow: "Every trip", title: "What is actually included", body: "Swipe, drag, or use the arrows to see every trip." }}
      cards={[
        { image: img(19, "Guests boarding at the dock"), tag: "Small groups", title: "Twelve guests, never more", body: "Two crew on every trip, so nobody queues for the ladder or the shade.", icon: "Anchor", caption: ["Slip 14", "Oranjestad Marina"] },
        { image: img(2, "Snorkeller above a shallow reef"), tag: "Gear", title: "Fitted, not just supplied", body: "Masks and fins in every size, reef safe sunscreen, crew in the water with you.", icon: "Waves", caption: ["Reef stop", "20 minutes out"] },
        { image: img(21, "Food served on a boat deck"), tag: "Lunch", title: "Cooked aboard, not packed", body: "Grilled catch and fresh fruit, vegetarian and allergy plates sorted at booking.", icon: "UtensilsCrossed", caption: ["Back deck", "Grilled to order"] },
        { image: img(16, "Catamaran under full sail"), tag: "Weather", title: "A promise, not a policy page", body: "The captain calls it by 7am. Free rebooking, no arguing about deposits.", icon: "CloudSun", caption: ["Called by", "7:00am daily"] },
      ]} /> },
  { code: "FEAT-BLOB", category: "Features", label: "A row of circular blob previews: a sharp circular photo sits over its own blurred, oversized glow of that same image, a hover ring, and a centered play button, ElevenLabs voice-picker style. Best for a small set of short audio, video or people previews that deserve a soft, glowing circular treatment rather than a rectangular card.",
    file: "components/sections/features/feature-blob.tsx", component: "FeatureBlob", props: "heading?: SectionHeading, items: { image: Img, title: string, subtitle?: string }[]",
    node: <FeatureBlob
      heading={{ eyebrow: "Meet the crew", title: "Every voice on the radio, one tap away" }}
      items={[
        { image: img(11, "Captain at the helm"), title: "Capt. Ray Oduber", subtitle: "Morning briefing" },
        { image: img(12, "Crew member coiling a line"), title: "Ilse Croes", subtitle: "Booking confirmation" },
        { image: img(13, "Diver preparing gear on deck"), title: "Marcus Vrolijk", subtitle: "Reef safety talk" },
        { image: img(14, "Fresh food prepared on a boat"), title: "Sofia Martinez", subtitle: "Lunch is ready" },
      ]} /> },
  { code: "FEAT-VOICE-BLOB", category: "Features", label: "One large blob: a looping video clipped into a circle, always gently in motion, ElevenLabs' voice-picker effect. Pass a real audioSrc once a recording exists and the play button plays it alongside the loop, no other change needed. Best for a single hero-like audio or voice preview, not a row of several.",
    file: "components/sections/features/voice-blob.tsx", component: "FeatureVoiceBlob", props: "heading?: SectionHeading, videoSrc: string, poster?: string, title?: string, subtitle?: string, audioSrc?: string",
    node: <FeatureVoiceBlob
      heading={{ eyebrow: "Hear it for yourself", title: "The voice on the radio" }}
      videoSrc="https://videos.pexels.com/video-files/1093662/1093662-hd_1920_1080_30fps.mp4"
      poster={img(11, "Captain at the helm").src}
      title="Capt. Ray Oduber"
      subtitle="Morning briefing, recorded live"
    /> },

  ...NAV_ENTRIES,
  ...FOOTER_ENTRIES,
  ...TESTIMONIAL_ENTRIES,
  ...MEDIA_ENTRIES,
  ...GALLERY_ENTRIES,
  ...FAQ_ENTRIES,
  ...CTA_ENTRIES,
  ...TOUR_ENTRIES,
  ...ABOUT_ENTRIES,
  ...BLOG_ENTRIES,
  ...CONTACT_ENTRIES,
  ...QUOTE_ENTRIES,
  ...FLEET_ENTRIES,
  ...SPOTLIGHT_ENTRIES,
  ...TEMPLATE_ENTRIES,
];

export const CATEGORIES = [...new Set(CATALOG.map((c) => c.category))];
export const byCode = (code: string) => CATALOG.find((c) => c.code === code);
