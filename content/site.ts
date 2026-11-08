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
        { label: "Contact center services", href: "/services/contact-center-services", icon: "Headset", desc: "24/7 inbound, outbound and omnichannel in one" },
        { label: "Inbound contact center", href: "/services/inbound-contact-center", icon: "PhoneIncoming", desc: "Handle high volume queries at scale" },
        { label: "Outbound contact center", href: "/services/outbound-contact-center", icon: "PhoneOutgoing", desc: "Proactive outreach for sales and retention" },
        { label: "E-commerce customer support", href: "/services/ecommerce-customer-support", icon: "ShoppingBag", desc: "Dedicated support for online retail operations" },
        { label: "Customer support services", href: "/services/customer-support", icon: "LifeBuoy", desc: "Full cycle support across all touchpoints" },
        { label: "Customer experience management", href: "/services/customer-experience-management", icon: "HeartHandshake", desc: "Design and optimize the complete CX journey" },
        { label: "Workforce management", href: "/services/workforce-management", icon: "CalendarRange", desc: "Optimize staffing, scheduling and performance" },
        { label: "Technical support services", href: "/services/technical-support", icon: "Wrench", desc: "Tier 1 to 3 helpdesk and issue resolution" },
        { label: "Business process reengineering", href: "/services/business-process-reengineering", icon: "Workflow", desc: "Redesign core processes for efficiency" },
        { label: "Back office support services", href: "/services/back-office-support", icon: "FileStack", desc: "Administrative and back end operational support" },
        { label: "Telemarketing services", href: "/services/telemarketing", icon: "Megaphone", desc: "Targeted voice campaigns that convert" },
        { label: "Sales support services", href: "/services/sales-support", icon: "Handshake", desc: "Enable your sales team with qualified support" },
        { label: "Lead generation services", href: "/services/lead-generation", icon: "Target", desc: "Build a consistent pipeline of qualified leads" },
      ],
      groups: [
        { title: "Customer support", links: [
          { label: "Contact center services", href: "/services/contact-center-services", icon: "Headset", desc: "24/7 inbound, outbound and omnichannel in one" },
          { label: "Inbound contact center", href: "/services/inbound-contact-center", icon: "PhoneIncoming", desc: "Handle high volume queries at scale" },
          { label: "Outbound contact center", href: "/services/outbound-contact-center", icon: "PhoneOutgoing", desc: "Proactive outreach for sales and retention" },
          { label: "E-commerce customer support", href: "/services/ecommerce-customer-support", icon: "ShoppingBag", desc: "Dedicated support for online retail operations" },
          { label: "Customer support services", href: "/services/customer-support", icon: "LifeBuoy", desc: "Full cycle support across all touchpoints" },
          { label: "Customer experience management", href: "/services/customer-experience-management", icon: "HeartHandshake", desc: "Design and optimize the complete CX journey" },
        ] },
        { title: "Operations", links: [
          { label: "Workforce management", href: "/services/workforce-management", icon: "CalendarRange", desc: "Optimize staffing, scheduling and performance" },
          { label: "Technical support services", href: "/services/technical-support", icon: "Wrench", desc: "Tier 1 to 3 helpdesk and issue resolution" },
          { label: "Business process reengineering", href: "/services/business-process-reengineering", icon: "Workflow", desc: "Redesign core processes for efficiency" },
          { label: "Back office support services", href: "/services/back-office-support", icon: "FileStack", desc: "Administrative and back end operational support" },
        ] },
        { title: "Growth", links: [
          { label: "Telemarketing services", href: "/services/telemarketing", icon: "Megaphone", desc: "Targeted voice campaigns that convert" },
          { label: "Sales support services", href: "/services/sales-support", icon: "Handshake", desc: "Enable your sales team with qualified support" },
          { label: "Lead generation services", href: "/services/lead-generation", icon: "Target", desc: "Build a consistent pipeline of qualified leads" },
        ] },
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
      menu: "list",
      seeAll: "See all industries",
      children: [
        { label: "Banking and fintech", href: "/industries/banking-fintech", icon: "Landmark", desc: "Secure CX for financial services" },
        { label: "Ride hailing", href: "/industries/ride-hailing", icon: "Car", desc: "Real time support for mobility platforms" },
        { label: "E-commerce", href: "/industries/ecommerce", icon: "ShoppingCart", desc: "Scale support for high order volume retail" },
        { label: "Logistics", href: "/industries/logistics", icon: "Truck", desc: "Last mile and fleet customer operations" },
        { label: "Telecom", href: "/industries/telecom", icon: "RadioTower", desc: "Subscriber management at enterprise scale" },
        { label: "Healthcare", href: "/industries/healthcare", icon: "HeartPulse", desc: "Privacy-first patient and provider support" },
        { label: "SaaS", href: "/industries/saas", icon: "Cloud", desc: "Technical onboarding and retention support" },
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
          { label: "Banking and fintech", href: "/industries/banking-fintech" },
          { label: "Ride hailing", href: "/industries/ride-hailing" },
          { label: "E-commerce", href: "/industries/ecommerce" },
          { label: "Logistics", href: "/industries/logistics" },
          { label: "Telecom", href: "/industries/telecom" },
          { label: "Healthcare", href: "/industries/healthcare" },
          { label: "SaaS", href: "/industries/saas" },
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
