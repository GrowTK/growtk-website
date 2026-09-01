/**
 * Privacy Policy. Draft, standard boilerplate for a service business
 * marketing site. Covers this marketing website and its contact form.
 * Requires attorney review before public launch.
 */
import type { PageContent, Cta, SectionHeading } from "./types";

export const privacy = {
  meta: {
    title: "Privacy policy",
    description: "Privacy policy for the Growtk marketing website.",
    path: "/privacy",
  },
  effectiveDate: "Draft, last updated September 2026",
  intro:
    "This policy covers growtk.com, our public marketing website. Growtk is a service studio, not a software platform with its own login, so this page covers what we collect when you visit this site or get in touch through it. This is a draft pending review by counsel before public launch.",
  sections: [
    {
      heading: "What we collect on this website",
      body: [
        "If you contact us through the site, we receive whatever you choose to include: your name, business name, email address, and any message you write. That form opens a pre-filled email in your own email client and is sent from your address, not submitted to a server we control.",
        "If you use the FAQ widget in the corner of the site, your typed question and our reply are processed to generate an answer. See the section on third parties below.",
        "We do not currently use third-party analytics, advertising, or tracking cookies on this website.",
      ],
    },
    {
      heading: "Keep sensitive information out of the contact form",
      body: [
        "This is a marketing website, not a system for managing your business's operational data. Please do not include passwords, payment details, or other sensitive credentials in the contact form or the FAQ widget. If a project needs you to share something sensitive, we will set up a secure way to do that directly.",
      ],
    },
    {
      heading: "How we use what we collect",
      body: [
        "We use contact form information to respond to your inquiry and follow up about your project. We do not sell personal information, and we do not share it with third parties for their own marketing purposes.",
      ],
    },
    {
      heading: "Third parties",
      body: [
        "The FAQ widget on this site can be configured to use OpenAI's API to generate answers grounded in our own published content. When that is active, the text you type into the widget is sent to OpenAI for processing. Do not include anything sensitive in that widget.",
        "We use standard cloud hosting infrastructure to run this website. The website itself does not store your contact form submission in a database; the form opens an email in your own email client instead.",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "Contact form emails are kept as long as reasonably needed to follow up and maintain a record of the relationship, then deleted or archived per our internal retention practice.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask us what information we hold about you from this website and ask us to delete it by writing to hello@growtk.com. We will respond within a reasonable time.",
      ],
    },
    {
      heading: "Changes to this policy",
      body: [
        "We may update this policy as the company and website develop. We will update the date at the top of this page when we do.",
      ],
    },
    {
      heading: "Contact",
      body: [
        "Questions about this policy, or requests about your data, can be sent to hello@growtk.com.",
      ],
    },
  ],

  cta: {
    heading: {
      eyebrow: "Questions",
      title: "Want to know what we hold about you?",
      body: "Ask us directly. We will respond within a reasonable time.",
    } as SectionHeading,
    primary: { label: "Email hello@growtk.com", href: "mailto:hello@growtk.com" } as Cta,
    secondary: { label: "Learn more about Growtk", href: "/about" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default privacy;
