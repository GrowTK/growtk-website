import type { CatalogEntry } from "@/components/sections/catalog-types";
import type { NavItem } from "@/content/types";
import { Nav06 } from "@/components/sections/nav/nav-06";
import { Nav07 } from "@/components/sections/nav/nav-07";
import { Nav08 } from "@/components/sections/nav/nav-08";
import { Nav09 } from "@/components/sections/nav/nav-09";
import { Nav10 } from "@/components/sections/nav/nav-10";
import { demoCta, demoContact, demoNav, img } from "@/content/demo";

/** demoNav plus a lucide icon per item, for the rail nav that renders icons. */
const iconNav: NavItem[] = demoNav.map((it, i) => ({
  ...it,
  icon: ["Sailboat", "Anchor", "Images", "Star", "MapPin"][i] ?? "Circle",
}));

export const NAV_ENTRIES: CatalogEntry[] = [
  {
    code: "NAV-06",
    category: "Navbar",
    label: "A slim hairline bar whose 'Menu' word button explodes into a full screen takeover: numbered links at oversized display scale stagger in one by one, with a contact rail of hours and phone beside them. Best for a boutique or editorial brand with a short, curated nav list that wants the menu itself to feel like a moment, not a utility.",
    file: "components/sections/nav/nav-06.tsx",
    component: "Nav06",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, meta?: { label, value, href? }[]",
    sticky: true,
    node: (
      <Nav06
        items={demoNav}
        cta={demoCta}
        brandName="Blue Water Sail"
        meta={[
          { label: "Dock", value: demoContact.address },
          { label: "Call the dock", value: demoContact.phone, href: `tel:${demoContact.phone.replace(/\s/g, "")}` },
          { label: "Sunday hours", value: "08:00 to 17:00" },
        ]}
      />
    ),
  },
  {
    code: "NAV-07",
    category: "Navbar",
    label: "A search first bar where the centre slot is a command trigger rather than a link list, so Cmd K or the slash key opens a filterable palette listing every page and child link. Best for a site with many tours, products or pages where visitors already know what they want and typing beats scanning a crowded menu.",
    file: "components/sections/nav/nav-07.tsx",
    component: "Nav07",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, placeholder?: string",
    sticky: true,
    node: <Nav07 items={demoNav} cta={demoCta} brandName="Blue Water Sail" placeholder="Search tours, boats and pages" />,
  },
  {
    code: "NAV-08",
    category: "Navbar",
    label: "A vertical icon rail that floats down the left edge and expands on hover to reveal labels, collapsing to a squared top bar with a slide down drawer on mobile. Best for a small, icon-friendly nav on a bold or app-like brand willing to break from the horizontal bar convention, such as a booking portal or a dashboard-styled marketing site.",
    file: "components/sections/nav/nav-08.tsx",
    component: "Nav08",
    props: "items: NavItem[] (icon per item), cta?: Cta, logo?, brandName?",
    sticky: true,
    overlay: true,
    tallPreview: true,
    node: <Nav08 items={iconNav} cta={{ ...demoCta, icon: "CalendarCheck" }} brandName="Blue Water Sail" />,
  },
  {
    code: "NAV-09",
    category: "Navbar",
    label: "A bar that slides out of view as you scroll down and snaps back the instant you scroll up, with a reading progress hairline along its bottom edge and child links opening in an inline tray that pushes the page rather than floating over it. Best for long, content-heavy pages such as a blog or a story-driven scroll, where the nav should get out of the way while reading but stay one scroll-up away.",
    file: "components/sections/nav/nav-09.tsx",
    component: "Nav09",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?",
    sticky: true,
    node: <Nav09 items={demoNav} cta={demoCta} brandName="Blue Water Sail" />,
  },
  {
    code: "NAV-10",
    category: "Navbar",
    label: "A two row header where a utility strip of phone, hours and socials sits above the bar and rolls away on scroll, and hovering a parent link opens a wide mega panel with grouped links beside a featured photo card. Best for a multi-location or multi-service business with enough pages to need a real mega menu and enough trust signals to want them visible at first load.",
    file: "components/sections/nav/nav-10.tsx",
    component: "Nav10",
    props: "items: NavItem[], cta?: Cta, logo?, brandName?, phone?, hours?, socials?: Link[], featured?: { image: Img, eyebrow?, title, body, href }",
    sticky: true,
    node: (
      <Nav10
        items={demoNav}
        cta={demoCta}
        brandName="Blue Water Sail"
        phone={demoContact.phone}
        hours="Slip 14, Renaissance Marina, 07:00 to 19:00"
        socials={demoContact.socials}
        featured={{
          image: img(4, "Sailboat anchored off a quiet reef at first light"),
          eyebrow: "Most booked",
          title: "Sunset cruise, 17:30",
          body: "Three hours out of Slip 14, twelve guests, grilled catch aboard and the ride back under sail.",
          href: "#sunset",
        }}
      />
    ),
  },
];
