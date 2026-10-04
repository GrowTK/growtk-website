/**
 * Compliance page. Describes real practices Growtk follows in how this
 * website and client projects are built, framed honestly as engineering
 * discipline, not as certifications Growtk holds. Growtk holds no formal
 * compliance certifications today and says so plainly on this page.
 * Draft, standard boilerplate for a service business marketing site.
 * Requires attorney review before public launch.
 */
import type { PageContent, Cta, SectionHeading } from "./types";

export const compliance = {
  meta: {
    title: "Compliance",
    description: "How Growtk builds with security and accessibility in mind, and an honest statement of what we are not certified for.",
    path: "/compliance",
  },
  effectiveDate: "Draft, last updated September 2026",
  intro:
    "This page describes real practices Growtk follows when building this website and client projects. It is not a list of certifications: Growtk is a small software studio, and we would rather tell you plainly what we do and do not hold than let a vague word like compliance do the talking. This is a draft pending review by counsel before public launch.",
  sections: [
    {
      heading: "Accessibility",
      body: [
        "This website is built to real accessibility practices: one heading per page, semantic landmarks for navigation, main content and footer, visible focus rings on every interactive element, meaningful alt text on images, and body text that clears standard color contrast guidelines.",
        "We aim for WCAG 2.1 AA as a practical target for how we build, not as a certified audit result. We have not commissioned a third-party accessibility audit of this site.",
      ],
    },
    {
      heading: "Security practices",
      body: [
        "Every commit to this website's codebase runs through automated secret scanning and a supply chain scan that checks for suspicious install scripts and unsafe code before it ships. This is engineering discipline we hold ourselves to, not a formal security certification.",
        "This marketing website's contact form and FAQ widget are not built to store sensitive data. We do not ask for or knowingly store passwords, payment details, or other sensitive credentials through either of them.",
      ],
    },
    {
      heading: "SMS and voice automation for client projects",
      body: [
        "When Growtk builds an SMS follow-up campaign or a voice agent for a client's business, we build consent and opt-out handling into that automation as part of the work, the same way this website only texts or calls people who contacted us first. That is a description of how we build, not a claim of certification under any specific telecom regulation.",
      ],
    },
    {
      heading: "Cloud infrastructure",
      body: [
        "Growtk builds and deploys on AWS. That is a statement about the infrastructure we use, not a claim of AWS certification or partner status.",
      ],
    },
    {
      heading: "What we do not hold",
      body: [
        "Growtk does not currently hold SOC 2, ISO 27001, HIPAA, or PCI DSS certification. If a client asks, we say so plainly rather than imply otherwise. We think a small studio being direct about this is worth more than vague language that lets a visitor assume a compliance posture we do not have.",
        "If your business is in a regulated industry, healthcare included, we build with privacy-aware and security-aware practices, but your business remains responsible for its own regulatory compliance obligations. Growtk is not a compliance authority and this page is not legal or compliance advice.",
      ],
    },
    {
      heading: "Changes to this page",
      body: [
        "We may update this page as our practices develop. We will update the date at the top of this page when we do.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about how Growtk builds, or about any of the practices on this page, can be sent to hello@growtk.com.",
      ],
    },
  ],

  cta: {
    heading: {
      eyebrow: "Questions",
      title: "Want the honest version before you sign?",
      body: "Ask us directly what we do and do not have in place. We would rather tell you plainly than let you assume.",
    } as SectionHeading,
    primary: { label: "Email hello@growtk.com", href: "mailto:hello@growtk.com" } as Cta,
    secondary: { label: "Learn more about Growtk", href: "/about" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default compliance;
