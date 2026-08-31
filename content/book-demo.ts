/**
 * Book a demo page copy. This is a mailto-based inquiry form, not a wired-up
 * backend. Copy must stay honest about that (see BookDemoForm component).
 */
import type { PageContent, SectionHeading, Feature } from "./types";

export const bookDemo = {
  meta: {
    title: "Book a demo",
    description:
      "Book a demo with Dentavanta. Tell us about your practice and we will reply within one business day to walk through the platform and our security model.",
    path: "/book-demo",
  },

  header: {
    eyebrow: "Book a demo",
    title: "Tell us about your practice",
    body: "Fill in the form and it will open a pre-filled email to hello@getdentavanta.com in your email app. We reply directly, within one business day, no automated sequence.",
  },

  form: {
    nameLabel: "Your name",
    namePlaceholder: "Jordan Ellis",
    practiceLabel: "Practice name",
    practicePlaceholder: "Ellis Family Dental",
    emailLabel: "Email address",
    emailPlaceholder: "you@yourpractice.com",
    messageLabel: "What would you like to know?",
    messagePlaceholder: "Tell us about your practice size, what you are hoping to see, or any security questions you already have.",
    submitLabel: "Open email to send",
    disclaimer:
      "This opens your email app with a pre-filled message. Nothing is sent automatically and no account is created. If your email app does not open, write to us directly at hello@getdentavanta.com.",
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
        body: "From Jean or Muhammad directly, not a scheduling bot.",
      },
      {
        icon: "Video",
        title: "A thirty minute call, no pressure",
        body: "We show you what is actually live today and answer every question straight.",
      },
      {
        icon: "FileCheck",
        title: "A real look at the security model",
        body: "Including the Business Associate Agreement, if you want to see it before anything else.",
      },
    ] as Feature[],
  },
} satisfies PageContent & Record<string, unknown>;

export default bookDemo;
