/**
 * Home page copy. Real content for Dentavanta, a pre-launch, early-access
 * practice management platform for small dental and cosmetology practices.
 *
 * Keep every string free of em dashes and en dashes.
 */
import type { PageContent, Cta, Img, SectionHeading, Stat, FaqItem } from "./types";
import type { TabItem } from "@/components/sections/features/feature-05";

export const home = {
  meta: {
    title: "Dentavanta: HIPAA-grade practice software for small healthcare teams",
    description:
      "Dentavanta is early-access practice management software for small dental and cosmetology practices, built on tenant-isolated, audited AWS infrastructure with a signed Business Associate Agreement for every practice.",
    path: "/",
  },

  hero: {
    eyebrow: "Early access, now open",
    title: "Practice software built like it actually handles patient data",
    accent: "patient data",
    body: "Dentavanta gives small dental and cosmetology practices scheduling, records and communication on the same tenant-isolated, audited AWS foundation that larger health systems pay far more for. We are early. Here is exactly what is real today.",
    badge: {
      icon: "ShieldCheck",
      label: "Signed AWS BAA",
      sublabel: "Audited infrastructure, us-east-1",
    },
    bullets: [
      "Row-level security isolates every practice's data in the database itself",
      "Cognito-backed authentication, no shared logins or shared passwords",
      "Every access to patient data is written to an audit log",
      "A signed Business Associate Agreement with every practice",
    ],
    ctas: [
      { label: "Book a demo", href: "/book-demo", variant: "primary" },
      { label: "See our security model", href: "/security", variant: "secondary" },
    ] as Cta[],
    image: {
      src: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1600&q=80",
      alt: "Empty, modern dental treatment room with clean white cabinetry and chairside equipment",
    } as Img,
  },

  /** Tabbed capabilities: Feature05. */
  capabilities: {
    heading: {
      eyebrow: "How it is built",
      title: "Security is not a feature we bolted on",
      body: "Every layer of the platform was designed around one rule: a practice's data belongs to that practice, and nothing else can touch it.",
    } as SectionHeading,
    items: [
      {
        icon: "Database",
        tab: "Tenant isolation",
        title: "Row-level security on every table",
        meta: "Aurora Postgres, RLS",
        body: "Every query is scoped to a practice by the database itself, using Postgres row-level security policies, not application code that a bug could bypass.",
        image: {
          src: "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
          alt: "Dentist and patient looking at a scan together beside the treatment chair",
        },
        bullets: [
          "Enforced at the database, not just the API",
          "A practice can never see another practice's rows",
          "Policies tested as part of every schema change",
        ],
        cta: { label: "Read the full security model", href: "/security" },
      },
      {
        icon: "Fingerprint",
        tab: "Authentication",
        title: "Cognito-backed identity, JWT authenticated",
        meta: "AWS Cognito",
        body: "Every request carries a signed JWT issued by AWS Cognito. There are no shared logins and no plaintext passwords stored by Dentavanta itself.",
        image: {
          src: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
          alt: "Close view of a clinician's hands holding a phone, a stethoscope visible at the collar",
        },
        bullets: [
          "Tenant-scoped user pools",
          "Short-lived, signed tokens on every request",
          "No plaintext credentials ever touch our servers",
        ],
        cta: { label: "Book a demo", href: "/book-demo" },
      },
      {
        icon: "ClipboardList",
        tab: "Audit logging",
        title: "Every access to patient data is recorded",
        meta: "audit_log table",
        body: "A dedicated audit log records who accessed what, and when, so a practice can answer exactly that question if it is ever asked.",
        image: {
          src: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
          alt: "A clinician holding printed scan films up to a lightbox",
        },
        bullets: [
          "Access is logged, not just errors",
          "Built for HIPAA-style accountability from day one",
          "Available to a practice on request",
        ],
        cta: { label: "See what is live today", href: "/security" },
      },
      {
        icon: "KeyRound",
        tab: "Encryption",
        title: "Encrypted with AWS KMS, in transit and at rest",
        meta: "AWS KMS",
        body: "Data is encrypted at rest with keys managed through AWS Key Management Service, and encrypted in transit between every service in the chain.",
        image: {
          src: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
          alt: "Macro photograph of an illuminated circuit board",
        },
        bullets: [
          "Managed keys, not custom cryptography",
          "Applies to the database, backups and storage",
          "Consistent with AWS's HIPAA-eligible services",
        ],
        cta: { label: "Read our security page", href: "/security" },
      },
      {
        icon: "Workflow",
        tab: "API-first",
        title: "One real endpoint today, built to the same standard as every one after it",
        meta: "API Gateway and Lambda",
        body: "The platform is built endpoint by endpoint on API Gateway and Lambda behind an RDS Proxy, so every new feature inherits the same auth, isolation and logging from day one.",
        image: {
          src: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
          alt: "Two people in conversation beside an open laptop on a desk",
        },
        bullets: [
          "Authentication and RLS enforced identically on every route",
          "New endpoints extend the platform, they do not bypass it",
          "Built in the open with practices in early access",
        ],
        cta: { label: "Book a demo", href: "/book-demo" },
      },
    ] as TabItem[],
  },

  /** Honest, real numbers only: Spotlight07. */
  stats: [
    { value: "100%", label: "Patient data isolated at the database with row-level security" },
    { value: "1", label: "AWS Business Associate Addendum signed at the infrastructure level" },
    { value: "us-east-1", label: "The AWS region running every practice's data today" },
    { value: "Zero", label: "Shortcuts. Every access is authenticated, scoped and logged" },
  ] as Stat[],

  /** Security and compliance teaser, linking to the full page: Cta03. */
  securityTeaser: {
    heading: {
      eyebrow: "Security and compliance",
      title: "We are the business associate. Your practice stays the covered entity.",
      body: "Under HIPAA, your practice is the covered entity and Dentavanta is your business associate. We sign a Business Associate Agreement with every practice, consistent with the AWS Business Associate Addendum already accepted at the infrastructure layer.",
    } as SectionHeading,
    points: [
      "AWS Business Associate Addendum accepted at the account level",
      "A signed BAA with every practice, before a single record is stored",
      "Full detail on our security page, not just marketing language",
    ],
    primary: { label: "See our security model", href: "/security" } as Cta,
    secondary: { label: "Book a demo", href: "/book-demo" } as Cta,
    image: {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      alt: "Two open laptops and a handwritten notes page on a shared desk",
    } as Img,
  },

  /** FAQ, Faq08 (photo plus accordion). */
  faq: {
    heading: {
      eyebrow: "Before you book",
      title: "What practice owners ask us first",
      body: "Honest answers, including where we are still early.",
    } as SectionHeading,
    items: [
      {
        q: "Is Dentavanta finished software?",
        a: "No, and we would rather tell you that up front. We are in early access. One real API endpoint proves the full authentication, isolation and audit chain today, and we are building out the rest of the platform on that same foundation with founding practices.",
      },
      {
        q: "Are you HIPAA certified?",
        a: "There is no official HIPAA certification body, so no vendor can truthfully claim to be HIPAA certified. What is real: a signed Business Associate Agreement with every practice, an AWS Business Associate Addendum accepted at the account level, and infrastructure built for HIPAA compliance from the start.",
      },
      {
        q: "How is my practice's data kept separate from other practices?",
        a: "Every table enforces row-level security in the database itself. A query scoped to your practice cannot return another practice's rows, even if application code had a bug.",
      },
      {
        q: "What does it cost?",
        a: "We have not set public pricing yet. Early access pricing is being shaped with founding practices based on practice size and the modules you need. Book a demo and we will talk numbers honestly.",
      },
      {
        q: "When can my practice actually start using it?",
        a: "We are onboarding founding practices in early access now, in step with what is built. Book a demo and we will tell you plainly what is ready for your practice today and what is coming next.",
      },
    ] as FaqItem[],
    image: {
      src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      alt: "A laptop open on a clean desk beside tall windows overlooking a city",
    } as Img,
    caption: "We answer the security and pricing questions honestly, including what is not built yet.",
    cta: { label: "Ask us anything", href: "/book-demo" } as Cta,
  },

  /** Closing CTA, Cta11 (split panel on a photo backdrop). */
  cta: {
    heading: {
      eyebrow: "Ready when you are",
      title: "See the platform, the infrastructure and the BAA in one call",
      body: "Thirty minutes. We will show you what is live today, what is next, and answer every security question directly.",
    } as SectionHeading,
    points: [
      "A real walkthrough, not a slide deck",
      "Straight answers on pricing and timeline",
      "No obligation to sign anything on the call",
    ],
    primary: { label: "Book a demo", href: "/book-demo" } as Cta,
    secondary: { label: "Read our security page", href: "/security" } as Cta,
    backdrop: {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1920&q=80",
      alt: "Two people working at laptops in a modern office, photographed in black and white",
    } as Img,
    footnote: "We reply to every demo request within one business day.",
  },
} satisfies PageContent & Record<string, unknown>;

export default home;
