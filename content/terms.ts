/**
 * Terms of Service. Draft, standard boilerplate for a pre-launch B2B SaaS
 * marketing site. This governs use of the marketing website and the early
 * access relationship generally; it is not the in-app end user agreement,
 * and it requires attorney review before public launch.
 */
import type { PageContent, Cta, SectionHeading } from "./types";

export const terms = {
  meta: {
    title: "Terms of service",
    description: "Terms of service for the Dentavanta website and early access program.",
    path: "/terms",
  },
  effectiveDate: "Draft, last updated August 2026",
  intro:
    "These terms cover your use of this website and Dentavanta's early access program. Dentavanta is a pre-launch company and this is a draft policy pending review by counsel before public launch. If anything here is unclear, contact hello@getdentavanta.com before relying on it.",
  sections: [
    {
      heading: "Who this applies to",
      body: [
        "These terms apply to anyone visiting getdentavanta.com or requesting a demo, an early access account, or information from Dentavanta. Dentavanta is the internal engineering name for the company; our public product may be marketed under this or another brand name.",
        "If your practice signs a separate written agreement with Dentavanta, such as a services agreement or a Business Associate Agreement, that agreement governs your use of the platform itself. These website terms do not replace it.",
      ],
    },
    {
      heading: "Early access",
      body: [
        "Dentavanta is pre-launch. Features described on this site may not be built yet, may change, or may be delayed. We try to be explicit about what is live today versus planned, and you should treat anything described as early access, planned, or coming as not yet available.",
        "Booking a demo or joining early access does not create a binding commitment on either side beyond what is stated in a separate signed agreement.",
      ],
    },
    {
      heading: "Acceptable use",
      body: [
        "Do not use this website to attempt unauthorized access to any system, submit content that is unlawful or infringing, or interfere with the site's normal operation.",
        "The FAQ widget on this site is an informational tool only. Do not submit patient information, protected health information, or any other confidential data through it or through this marketing website's contact forms.",
      ],
    },
    {
      heading: "Intellectual property",
      body: [
        "The Dentavanta name, logo, and the content of this website belong to Dentavanta and may not be copied or used without permission, except as needed to view the site normally in a browser.",
      ],
    },
    {
      heading: "No warranty",
      body: [
        "This website and the information on it are provided as is. We describe our infrastructure and security practices accurately to the best of our knowledge, but we make no warranty that the website or the eventual platform will be uninterrupted or error free.",
      ],
    },
    {
      heading: "Limitation of liability",
      body: [
        "To the fullest extent permitted by law, Dentavanta is not liable for indirect, incidental, or consequential damages arising from use of this website. Nothing here limits liability where the law does not allow it to be limited.",
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
        "We may update these terms as the company and product develop. We will update the date at the top of this page when we do.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about these terms can be sent to hello@getdentavanta.com.",
      ],
    },
  ],

  cta: {
    heading: {
      eyebrow: "Questions",
      title: "Anything here unclear?",
      body: "Write to us directly and a real person will answer.",
    } as SectionHeading,
    primary: { label: "Email hello@getdentavanta.com", href: "mailto:hello@getdentavanta.com" } as Cta,
    secondary: { label: "Book a demo", href: "/book-demo" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default terms;
