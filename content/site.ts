/**
 * Shared chrome copy: navbar, footer, global CTA. Page-specific copy goes in
 * content/<page>.ts.
 */
import type { NavItem, Cta, Link } from "./types";

type FooterGroup = { title: string; links: Link[] };

export const site = {
  /** Navbar links. */
  nav: [
    { label: "Platform", href: "/" },
    { label: "Security", href: "/security" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ] as NavItem[],

  /** The single button in the navbar. */
  navCta: { label: "Book a demo", href: "/book-demo", variant: "primary" } as Cta | null,

  /** Footer link groups. */
  footer: {
    /** Short line under the logo. */
    blurb:
      "Practice management software for small dental and cosmetology practices, built on tenant-isolated, audited AWS infrastructure.",
    groups: [
      {
        title: "Product",
        links: [
          { label: "Platform", href: "/" },
          { label: "Pricing", href: "/pricing" },
          { label: "Book a demo", href: "/book-demo" },
        ] as Link[],
      },
      {
        title: "Security",
        links: [
          { label: "Security and compliance", href: "/security" },
          { label: "Business Associate Agreement", href: "/security#baa" },
        ] as Link[],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Contact us", href: "mailto:hello@getdentavanta.com" },
        ] as Link[],
      },
      {
        title: "Legal",
        links: [
          { label: "Terms of service", href: "/terms" },
          { label: "Privacy policy", href: "/privacy" },
        ] as Link[],
      },
    ] as FooterGroup[],
    /** Bottom-row legal links for footers that render them separately. */
    legalLinks: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
    ] as Link[],
    /** Plain copyright line. No certifications or claims belong here. */
    legal: "Dentavanta. Built on AWS in us-east-1.",
  },
} as const;

export default site;
