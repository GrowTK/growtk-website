/**
 * Contact page copy. This is a mailto-based inquiry form, not a wired-up
 * backend. Copy must stay honest about that (see BookDemoForm component,
 * reused here as-is with contact-specific copy).
 */
import type { PageContent, SectionHeading, Feature, FaqItem } from "./types";

export const contact = {
  meta: {
    title: "Contact Growtk",
    description:
      "Tell Growtk about your business and what you want redesigned or automated. We reply directly within one business day, no automated sequence.",
    path: "/contact",
  },

  header: {
    eyebrow: "Contact",
    title: "Tell us about your business",
    body: "Fill in the form and it will open a pre-filled email to hello@growtk.com in your email app. We reply directly, usually within one business day, no automated sequence.",
  },

  /** The direct-contact card beside the form. */
  direct: {
    label: "Prefer email?",
    copy: "Copy",
    copied: "Copied",
    reply: "Usually a reply within one business day",
    who: "Written by an engineer on the team, not a bot",
  },

  form: {
    title: "Start with the basics",
    servicesLabel: "What do you need help with?",
    notSure: "Not sure yet",
    tradeLabel: "Your trade",
    tradePlaceholder: "Pick your trade",
    tradeOther: "Something else",
    phoneLabel: "Phone (optional)",
    phonePlaceholder: "(555) 010-0199",
    nameLabel: "Your name",
    namePlaceholder: "Jordan Ellis",
    practiceLabel: "Business name",
    practicePlaceholder: "Summit Roofing Co.",
    emailLabel: "Email address",
    emailPlaceholder: "you@yourbusiness.com",
    messageLabel: "What do you want to automate or rebuild?",
    messagePlaceholder: "Tell us about your business, what's eating your time day to day, and anything you already know you want: a new website, an automation, a voice agent, or all three.",
    submitLabel: "Send inquiry",
    sendingLabel: "Sending…",
    sent: "Thanks {name}, it's in. We read every inquiry and reply within one business day, from {email}.",
    /** If sending fails, the form falls back to opening the visitor's own email app. */
    opened: "That didn't go through on our side, so your email app should be opening with the message ready, addressed to {email}. If nothing happened, write to us there directly.",
    disclaimer:
      "Sends your details straight to the team. No account is created and you won't be added to a mailing list.",
  },

  expect: {
    heading: {
      eyebrow: "What happens next",
      title: "No sales sequence, just a direct reply",
      body: "Three steps between this form and a clear plan. Nothing to commit to until the last one.",
    } as SectionHeading,
    items: [
      {
        icon: "Clock",
        title: "A reply within one business day",
        body: "From the Growtk team directly, not a scheduling bot.",
      },
      {
        icon: "Phone",
        title: "A free audit call",
        body: "We walk through what's actually slowing your business down and what's worth fixing first.",
      },
      {
        icon: "FileCheck",
        title: "A clear, scoped quote",
        body: "You'll know what it costs and how long it takes before you commit to anything.",
      },
    ] as Feature[],
  },

  faq: {
    heading: {
      eyebrow: "Before you write",
      title: "Quick answers",
      body: "The things people usually want to know before they send the first email.",
    } as SectionHeading,
    items: [
      {
        q: "Do I need to know exactly what I want?",
        a: "No. Tell us what is eating your time or losing you jobs, and we will work out on the audit call which of the six services, if any, would actually fix it.",
      },
      {
        q: "Is the audit call really free?",
        a: "Yes. It is a conversation about your current site, calls and tools, and what we would fix first. You are not signing anything on it.",
      },
      {
        q: "What if my business is not a good fit?",
        a: "We will tell you. If what you need is not something we build well, we would rather say so on the first call than take on a project we cannot do justice to.",
      },
    ] as FaqItem[],
  },
} satisfies PageContent & Record<string, unknown>;

export default contact;
