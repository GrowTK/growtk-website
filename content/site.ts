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
    {
      label: "Industries",
      href: "/industries",
      children: [
        { label: "HVAC", href: "/industries/hvac", icon: "Wind" },
        { label: "Plumbing", href: "/industries/plumbing", icon: "Droplets" },
        { label: "Electrical", href: "/industries/electrical", icon: "Zap" },
        { label: "Roofing", href: "/industries/roofing", icon: "HardHat" },
        { label: "Railing and fencing", href: "/industries/railing-fencing", icon: "Fence" },
        { label: "Landscaping", href: "/industries/landscaping", icon: "Trees" },
        { label: "Pest control", href: "/industries/pest-control", icon: "Bug" },
        { label: "Cleaning", href: "/industries/cleaning", icon: "SprayCan" },
        { label: "Healthcare", href: "/industries/healthcare", icon: "HeartPulse" },
      ],
    },
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
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
          { label: "SEO and content", href: "/services#seo" },
          { label: "Custom widgets", href: "/services#widgets" },
          { label: "Workflow automation", href: "/services#automation" },
          { label: "Voice agents", href: "/services#voice-agents" },
          { label: "Integrations", href: "/services#integrations" },
          { label: "Vibe code cleanup", href: "/code-cleanup" },
        ] as Link[],
      },
      {
        title: "Industries",
        links: [
          { label: "HVAC", href: "/industries/hvac" },
          { label: "Plumbing", href: "/industries/plumbing" },
          { label: "Electrical", href: "/industries/electrical" },
          { label: "Roofing", href: "/industries/roofing" },
          { label: "Railing and fencing", href: "/industries/railing-fencing" },
          { label: "Landscaping", href: "/industries/landscaping" },
          { label: "Pest control", href: "/industries/pest-control" },
          { label: "Cleaning", href: "/industries/cleaning" },
          { label: "Healthcare", href: "/industries/healthcare" },
        ] as Link[],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Team", href: "/team" },
          { label: "How we work", href: "/process" },
          { label: "Contact", href: "/contact" },
        ] as Link[],
      },
    ] as FooterGroup[],
    /** Bottom-row legal links for footers that render them separately. */
    legalLinks: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Compliance", href: "/compliance" },
    ] as Link[],
    /** Plain copyright line. No certifications or claims belong here. */
    legal: "Growtk. Websites and automation for service businesses.",
  },
} as const;

export default site;
