/**
 * Shared chrome copy: navbar, footer, global CTA. Page-specific copy goes in
 * content/<page>.ts.
 */
import type { NavItem, Cta, Link } from "./types";

type FooterGroup = { title: string; links: Link[] };

export const site = {
  /** Navbar links. */
  nav: [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ] as NavItem[],

  /** The single button in the navbar. */
  navCta: { label: "Get started", href: "/contact", variant: "primary" } as Cta | null,

  /** Footer link groups. */
  footer: {
    /** Short line under the logo. */
    blurb:
      "Websites, widgets and automation for roofing, railing, healthcare and other service businesses, built to connect with the tools you already run.",
    groups: [
      {
        title: "Services",
        links: [
          { label: "Website redesign", href: "/services#website-redesign" },
          { label: "Custom widgets", href: "/services#widgets" },
          { label: "Workflow automation", href: "/services#automation" },
          { label: "Voice agents", href: "/services#voice-agents" },
          { label: "Integrations", href: "/services#integrations" },
        ] as Link[],
      },
      {
        title: "Industries",
        links: [
          { label: "Roofing", href: "/industries/roofing" },
          { label: "Railing and fencing", href: "/industries/railing-fencing" },
          { label: "Healthcare", href: "/industries/healthcare" },
          { label: "All industries", href: "/industries" },
        ] as Link[],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Pricing", href: "/pricing" },
          { label: "Contact", href: "/contact" },
        ] as Link[],
      },
    ] as FooterGroup[],
    /** Bottom-row legal links for footers that render them separately. */
    legalLinks: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ] as Link[],
    /** Plain copyright line. No certifications or claims belong here. */
    legal: "Growtk. Websites and automation for service businesses.",
  },
} as const;

export default site;
