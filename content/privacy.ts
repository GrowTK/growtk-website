/**
 * Privacy Policy. Draft, standard boilerplate for a pre-launch B2B SaaS
 * marketing site. Covers this marketing website; the in-app product will
 * carry its own, more detailed notice once it launches. Requires attorney
 * review before public launch.
 */
import type { PageContent, Cta, SectionHeading } from "./types";

export const privacy = {
  meta: {
    title: "Privacy policy",
    description: "Privacy policy for the Dentavanta marketing website.",
    path: "/privacy",
  },
  effectiveDate: "Draft, last updated August 2026",
  intro:
    "This policy covers getdentavanta.com, our public marketing website. It does not cover the Dentavanta platform itself, which is pre-launch and will carry its own, more detailed privacy and HIPAA notice once practices are onboarded. This is a draft pending review by counsel before public launch.",
  sections: [
    {
      heading: "What we collect on this website",
      body: [
        "If you book a demo, we receive whatever you choose to include: your name, practice name, email address, and any message you write. That form opens a pre-filled email in your own email client and is sent from your address, not submitted to a server we control.",
        "If you use the FAQ widget in the corner of the site, your typed question and our reply are processed to generate an answer. See the section on third parties below.",
        "We do not currently use third-party analytics, advertising, or tracking cookies on this website.",
      ],
    },
    {
      heading: "Do not send patient information here",
      body: [
        "This is a marketing website, not the Dentavanta platform. Do not submit protected health information, patient records, or any other confidential data through the demo request form or the FAQ widget. Ask us how to reach us securely if you need to share anything sensitive before your practice is onboarded.",
      ],
    },
    {
      heading: "How we use what we collect",
      body: [
        "We use demo request information to respond to your inquiry and follow up about early access. We do not sell personal information, and we do not share it with third parties for their own marketing purposes.",
      ],
    },
    {
      heading: "Third parties",
      body: [
        "The FAQ widget on this site can be configured to use OpenAI's API to generate answers grounded in our own published content. When that is active, the text you type into the widget is sent to OpenAI for processing. Do not include anything sensitive in that widget.",
        "We use Amazon Web Services to host the infrastructure behind our platform, described on our security page. This marketing website itself does not store submissions in a database.",
      ],
    },
    {
      heading: "Data retention",
      body: [
        "Demo request emails are kept as long as reasonably needed to follow up and maintain a record of the relationship, then deleted or archived per our internal retention practice.",
      ],
    },
    {
      heading: "Your rights",
      body: [
        "You can ask us what information we hold about you from this website and ask us to delete it by writing to hello@getdentavanta.com. We will respond within a reasonable time.",
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
        "Questions about this policy, or requests about your data, can be sent to hello@getdentavanta.com.",
      ],
    },
  ],

  cta: {
    heading: {
      eyebrow: "Questions",
      title: "Want to know what we hold about you?",
      body: "Ask us directly. We will respond within a reasonable time.",
    } as SectionHeading,
    primary: { label: "Email hello@getdentavanta.com", href: "mailto:hello@getdentavanta.com" } as Cta,
    secondary: { label: "Read our security page", href: "/security" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default privacy;
