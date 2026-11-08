/**
 * Shared chrome copy: navbar, footer, global CTA. Page-specific copy goes in
 * content/<page>.ts.
 */
import type { NavItem, Cta, Link } from "./types";

type FooterGroup = { title: string; links: Link[] };

export const site = {
  /** Navbar links. */
  nav: [
    {
      label: "Services",
      href: "/services",
      menu: "list",
      seeAll: "See all services",
      children: [
        { label: "Contact center services", href: "/services/contact-center-services", icon: "Headset" },
        { label: "Inbound contact center", href: "/services/inbound-contact-center", icon: "PhoneIncoming" },
        { label: "Outbound contact center", href: "/services/outbound-contact-center", icon: "PhoneOutgoing" },
        { label: "Customer support", href: "/services/customer-support", icon: "LifeBuoy" },
        { label: "Technical support", href: "/services/technical-support", icon: "Wrench" },
        { label: "E-commerce support", href: "/services/ecommerce-customer-support", icon: "ShoppingBag" },
        { label: "CX management", href: "/services/customer-experience-management", icon: "HeartHandshake" },
        { label: "Lead generation", href: "/services/lead-generation", icon: "Target" },
        { label: "Telemarketing", href: "/services/telemarketing", icon: "Megaphone" },
        { label: "Sales support", href: "/services/sales-support", icon: "Handshake" },
        { label: "Back office support", href: "/services/back-office-support", icon: "FileStack" },
        { label: "Workforce management", href: "/services/workforce-management", icon: "CalendarRange" },
        { label: "Process reengineering", href: "/services/business-process-reengineering", icon: "Workflow" },
      ],
    },
    {
      label: "Solutions",
      href: "/solutions",
      menu: "list",
      seeAll: "See all solutions",
      children: [
        { label: "Knowledge base system", href: "/solutions/knowledge-base-system", icon: "BookOpen" },
        { label: "Helpdesk system", href: "/solutions/help-desk-software", icon: "LifeBuoy" },
        { label: "Quality management system", href: "/solutions/quality-management-system", icon: "ClipboardCheck" },
        { label: "Survey software", href: "/solutions/survey-software", icon: "MessageSquareHeart" },
      ],
    },
    {
      label: "Industries",
      href: "/industries",
      seeAll: "See all industries",
      children: [
        { label: "HVAC", href: "/industries/hvac", icon: "Wind" },
        { label: "Plumbing", href: "/industries/plumbing", icon: "Droplets" },
        { label: "Electrical", href: "/industries/electrical", icon: "Zap" },
        { label: "Roofing", href: "/industries/roofing", icon: "HardHat" },
        { label: "Railing and fencing", href: "/industries/railing-fencing", icon: "Fence" },
        { label: "Landscaping", href: "/industries/landscaping", icon: "Trees" },
        { label: "Pest control", href: "/industries/pest-control", icon: "Bug" },
        { label: "Cleaning", href: "/industries/cleaning", icon: "SprayCan" },
        { label: "Healthcare", href: "/industries/healthcare", icon: "HeartPulse" },
      ],
    },
    { label: "Case studies", href: "/case-studies" },
    {
      label: "Company",
      href: "/about",
      menu: "list",
      seeAll: "About Growtk",
      children: [
        { label: "About", href: "/about", icon: "Building2" },
        { label: "Why Growtk", href: "/why-growtk", icon: "Sparkles" },
        { label: "Leadership", href: "/team", icon: "Users" },
        { label: "Security", href: "/security", icon: "ShieldCheck" },
        { label: "Technology", href: "/technology", icon: "Cpu" },
        { label: "Careers", href: "/careers", icon: "Briefcase" },
      ],
    },
  ] as NavItem[],

  /** The single button in the navbar. */
  navCta: { label: "Contact us", href: "/contact", variant: "primary" } as Cta | null,

  /** Footer link groups. */
  footer: {
    /** Short line under the logo. */
    blurb:
      "AI-first outsourcing for customer operations: contact center, support, lead generation and back office, run by AI agents with a person on every escalation.",
    groups: [
      {
        title: "Services",
        links: [
          { label: "Contact center services", href: "/services/contact-center-services" },
          { label: "Inbound contact center", href: "/services/inbound-contact-center" },
          { label: "Outbound contact center", href: "/services/outbound-contact-center" },
          { label: "Customer support", href: "/services/customer-support" },
          { label: "Technical support", href: "/services/technical-support" },
          { label: "E-commerce support", href: "/services/ecommerce-customer-support" },
          { label: "CX management", href: "/services/customer-experience-management" },
          { label: "Lead generation", href: "/services/lead-generation" },
          { label: "Telemarketing", href: "/services/telemarketing" },
          { label: "Sales support", href: "/services/sales-support" },
          { label: "Back office support", href: "/services/back-office-support" },
          { label: "Workforce management", href: "/services/workforce-management" },
          { label: "Process reengineering", href: "/services/business-process-reengineering" },
        ] as Link[],
      },
      {
        title: "Solutions",
        links: [
          { label: "Knowledge base system", href: "/solutions/knowledge-base-system" },
          { label: "Helpdesk system", href: "/solutions/help-desk-software" },
          { label: "Quality management system", href: "/solutions/quality-management-system" },
          { label: "Survey software", href: "/solutions/survey-software" },
          { label: "All solutions", href: "/solutions" },
        ] as Link[],
      },
      {
        title: "Industries",
        links: [
          { label: "HVAC", href: "/industries/hvac" },
          { label: "Plumbing", href: "/industries/plumbing" },
          { label: "Electrical", href: "/industries/electrical" },
          { label: "Roofing", href: "/industries/roofing" },
          { label: "Railing and fencing", href: "/industries/railing-fencing" },
          { label: "Landscaping", href: "/industries/landscaping" },
          { label: "Pest control", href: "/industries/pest-control" },
          { label: "Cleaning", href: "/industries/cleaning" },
          { label: "Healthcare", href: "/industries/healthcare" },
        ] as Link[],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Why Growtk", href: "/why-growtk" },
          { label: "Leadership", href: "/team" },
          { label: "Security", href: "/security" },
          { label: "Technology", href: "/technology" },
          { label: "Careers", href: "/careers" },
          { label: "Case studies", href: "/case-studies" },
          { label: "How we work", href: "/process" },
          { label: "Contact", href: "/contact" },
          { label: "Groowt", href: "/groowt" },
        ] as Link[],
      },
    ] as FooterGroup[],
    /** Bottom-row legal links for footers that render them separately. */
    legalLinks: [
      { label: "Terms of service", href: "/terms" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Compliance", href: "/compliance" },
    ] as Link[],
    /** Plain copyright line. No certifications or claims belong here. */
    legal: "Growtk. AI-first customer operations outsourcing.",
  },
} as const;

export default site;
