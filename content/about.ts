/**
 * About page copy. Honest about stage: pre-launch, two people, real infra.
 * No invented team size, no fabricated headshots standing in for real people.
 */
import type { PageContent, Cta, Img, SectionHeading, Feature } from "./types";

export const about = {
  meta: {
    title: "About Dentavanta",
    description:
      "Dentavanta is a pre-launch practice management platform built by Jean Derisma and Muhammad Anique for small dental and cosmetology practices that deserve compliance-grade software.",
    path: "/about",
  },

  hero: {
    eyebrow: "About Dentavanta",
    title: "Small enough to know exactly whose data this is",
    body: "We are two people building practice management software the way we would want it built for a family member's dental office: security first, and honest about what is not finished yet.",
    ctas: [{ label: "Book a demo", href: "/book-demo", variant: "primary" }] as Cta[],
  },

  story: {
    heading: {
      eyebrow: "Where we are today",
      title: "Two people, one real endpoint, and a rule we will not break",
      body: "Dentavanta is pre-launch. We would rather you know that from us than find out on a sales call.",
    } as SectionHeading,
    body: [
      "Jean Derisma runs the business side of Dentavanta. Muhammad Anique builds the platform. That is the whole team today, and we are not going to pretend otherwise to sound bigger than we are.",
      "The idea started from a simple observation: small dental and cosmetology practices are asked to hand over patient data to software built for hospital systems with security teams they do not have, or to software built cheaply with none of that rigor at all. Neither option is honest with the people whose data it is.",
      "So we started with the infrastructure most vendors add later, if ever. Cognito authentication, row-level tenant isolation in the database, encryption through AWS KMS, and an audit log on every access, before a single scheduling screen existed. One real API endpoint proves that entire chain works end to end today.",
      "Everything else on the platform is being built on that same foundation, in the open, with founding practices telling us what they actually need next.",
    ],
    image: {
      src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      alt: "A laptop open on a clean desk beside tall windows, early in a working day",
    } as Img,
    caption: "Built one endpoint at a time, with the security layer first.",
  },

  values: {
    heading: {
      eyebrow: "What we will not compromise on",
      title: "The rules we built the platform around",
    } as SectionHeading,
    lead: "None of this is aspirational. It is the standard every line of the platform is held to before it ships.",
    items: [
      {
        icon: "ShieldCheck",
        title: "Security first, not bolted on",
        body: "Tenant isolation, authentication and audit logging existed before the first customer-facing feature did, and every new feature is held to the same bar.",
      },
      {
        icon: "MessageSquareText",
        title: "Honest about what is built",
        body: "We say early access when we mean early access, and we will tell you plainly what is not built yet instead of implying it exists.",
      },
      {
        icon: "Stethoscope",
        title: "Built for small practices, not enterprise contracts",
        body: "Dentavanta is sized for a practice with a handful of providers, not a hospital system with its own IT department.",
      },
      {
        icon: "Users",
        title: "Built with practices, not just for them",
        body: "Founding practices see the roadmap and shape what gets built next, instead of receiving a finished product with no say in it.",
      },
    ] as Feature[],
  },

  cta: {
    heading: {
      eyebrow: "Join us early",
      title: "Talk to the people actually building this",
      body: "Book a call with Jean and Muhammad directly. No account managers, no scripts.",
    } as SectionHeading,
    primary: { label: "Book a demo", href: "/book-demo" } as Cta,
    secondary: { label: "Read our security model", href: "/security" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default about;
