/**
 * Terms of Service. Draft, standard boilerplate for a service business
 * marketing site. This governs use of the marketing website and general
 * inquiries; it is not a signed services agreement, and it requires
 * attorney review before public launch.
 */
import type { PageContent, Cta, SectionHeading } from "./types";

export const terms = {
  meta: {
    title: "Terms of service",
    description: "Terms of service for the Growtk website.",
    path: "/terms",
  },
  effectiveDate: "Draft, last updated September 2026",
  intro:
    "These terms cover your use of this website and your general inquiries with Growtk. This is a draft policy pending review by counsel before public launch. If anything here is unclear, contact hello@growtk.com before relying on it.",
  sections: [
    {
      heading: "Who this applies to",
      body: [
        "These terms apply to anyone visiting growtk.com or contacting Growtk about a project or quote.",
        "If you sign a separate written services agreement with Growtk for a website, automation, voice agent, or integration project, that agreement governs the work itself. These website terms do not replace it.",
      ],
    },
    {
      heading: "Project scope and quotes",
      body: [
        "Pricing shown on this site is a starting point, not a final quote. The actual scope, timeline, and price for any project are set after a free audit call and confirmed in a written proposal before work begins.",
        "Nothing described on this website, including anything answered by the FAQ widget, is a binding quote or commitment on its own.",
      ],
    },
    {
      heading: "Acceptable use",
      body: [
        "Do not use this website to attempt unauthorized access to any system, submit content that is unlawful or infringing, or interfere with the site's normal operation.",
        "The FAQ widget on this site is an informational tool only. Do not submit passwords, payment details, or other sensitive credentials through it or through this marketing website's contact form.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The Growtk name, logo, and the content of this website belong to Growtk and may not be copied or used without permission, except as needed to view the site normally in a browser.",
      ],
    },
    {
      heading: "No warranty",
      body: [
        "This website and the information on it are provided as is. We describe our services and how we work accurately to the best of our knowledge, but we make no warranty that the website will be uninterrupted or error free.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, Growtk is not liable for indirect, incidental, or consequential damages arising from use of this website. Nothing here limits liability where the law does not allow it to be limited.",
      ],
    },
    {
      heading: "Governing law",
      body: [
        "Governing law and venue will be specified here once finalized with counsel. This section is a placeholder pending that review.",
      ],
    },
    {
      heading: "Changes to these terms",
      body: [
        "We may update these terms as the company and website develop. We will update the date at the top of this page when we do.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about these terms can be sent to hello@growtk.com.",
      ],
    },
  ],

  cta: {
    heading: {
      eyebrow: "Questions",
      title: "Anything here unclear?",
      body: "Write to us directly and a real person will answer.",
    } as SectionHeading,
    primary: { label: "Email hello@growtk.com", href: "mailto:hello@growtk.com" } as Cta,
    secondary: { label: "Contact us", href: "/contact" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default terms;
