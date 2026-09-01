/**
 * Contact page copy. This is a mailto-based inquiry form, not a wired-up
 * backend. Copy must stay honest about that (see BookDemoForm component,
 * reused here as-is with contact-specific copy).
 */
import type { PageContent, SectionHeading, Feature } from "./types";

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

  form: {
    nameLabel: "Your name",
    namePlaceholder: "Jordan Ellis",
    practiceLabel: "Business name",
    practicePlaceholder: "Summit Roofing Co.",
    emailLabel: "Email address",
    emailPlaceholder: "you@yourbusiness.com",
    messageLabel: "What do you want to automate or rebuild?",
    messagePlaceholder: "Tell us about your business, what's eating your time day to day, and anything you already know you want: a new website, an automation, a voice agent, or all three.",
    submitLabel: "Open email to send",
    disclaimer:
      "This opens your email app with a pre-filled message. Nothing is sent automatically and no account is created. If your email app does not open, write to us directly at hello@growtk.com.",
  },

  expect: {
    heading: {
      eyebrow: "What happens next",
      title: "No sales sequence, just a direct reply",
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
} satisfies PageContent & Record<string, unknown>;

export default contact;
