/**
 * Project showcase: the grid on the homepage plus each /work/[slug] detail
 * page. One entry per project. Copy lives here, never in the components.
 */
import type { Project, SectionHeading, Cta } from "./types";

export const projectsShowcase = {
  heading: {
    eyebrow: "What we've built",
    title: "Projects we can show you running",
    body: "Not mockups. Real systems built the same way we build yours.",
  } as SectionHeading,
  items: [
    {
      slug: "corvinn",
      name: "Corvinn",
      tagline: "An AI-native CRM and voice agent platform for field service businesses",
      description:
        "Corvinn is our own in-house build: one system that routes leads, answers the phone with a voice agent, schedules the job and keeps the whole crew on one calendar. It is the same playbook we build into every client site, proven on our own stack first.",
      logo: { src: "/ingested/corvinn/logo-white-full.png", alt: "Corvinn logo" },
      thumbnailClassName: "bg-[#FA5F68]",
      accentHex: "#FA5F68",
    },
    {
      slug: "yetti",
      name: "Yetti",
      tagline: "An AI front desk and booking system for tour, charter and rental operators",
      description:
        "Yetti answers guests on WhatsApp, Instagram, Messenger, Telegram and email, checks live availability, books the trip and takes payment. The same workspace runs the booking calendar, waivers, guest check-in and the CRM, so a booking made in a chat is on the dock sheet a second later.",
      logo: { src: "/ingested/yetti/face.png", alt: "Yetti logo, a smiling yeti face" },
      logoShape: "square",
      thumbnailClassName: "bg-[#2d6695]",
      accentHex: "#2d6695",
    },
    {
      slug: "jerrys",
      name: "Jerry's POS",
      tagline: "Point of sale, stock and restaurant automation for a quick service kitchen",
      description:
        "Jerry's POS runs the counter of a burger restaurant: catalogue tiles, meal deals, saved tickets and cash or QR checkout on a tablet. Every sale takes its recipe out of stock, and low stock, drawer variances and sales reach the owner on WhatsApp.",
      logo: { src: "/ingested/jerrys/mark-white.png", alt: "Jerry's logo, a hand drawn J's" },
      thumbnailClassName: "bg-[#d92025]",
      accentHex: "#d92025",
    },
  ] as Project[],
};

export const projectDetailCta = {
  heading: { title: "Want something like this running for your business" } as SectionHeading,
  primary: { label: "Start a project", href: "/contact", variant: "primary" } as Cta,
};
