/**
 * Security and Compliance page copy. The most important page on this site.
 * Only real, verifiable claims. No certifications we do not have.
 */
import type { PageContent, Cta, Img, SectionHeading, FaqItem } from "./types";
import type { SecurityLayer } from "@/components/sections/security/security-architecture";

export const security = {
  meta: {
    title: "Security and compliance",
    description:
      "How Dentavanta protects patient data: row-level tenant isolation, Cognito authentication, AWS KMS encryption, full audit logging, and a signed Business Associate Agreement with every practice.",
    path: "/security",
  },

  hero: {
    eyebrow: "Security and compliance",
    title: "Built for HIPAA compliance, from the database up",
    body: "Your practice is the HIPAA covered entity. Dentavanta is your business associate. Below is exactly how we protect patient data today, in plain terms, with no claims we cannot back up.",
    image: {
      src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1600&q=80",
      alt: "Server racks with illuminated network cables in a data center",
    } as Img,
  },

  /** Bespoke architecture walkthrough. */
  architecture: {
    heading: {
      eyebrow: "How a request is protected",
      title: "Six layers, every one of them real",
      body: "This is the actual path a request takes today, from sign in to the audit log, not a diagram of something planned.",
    } as SectionHeading,
    layers: [
      {
        icon: "Fingerprint",
        title: "Identity: AWS Cognito",
        body: "Every user signs in through a tenant-scoped Cognito user pool. Passwords never touch our own servers, and every request carries a short-lived, signed JSON web token.",
      },
      {
        icon: "Workflow",
        title: "Application: API Gateway and Lambda",
        body: "Requests hit API Gateway and run through Lambda functions that verify the caller's identity and practice before any data is touched.",
      },
      {
        icon: "Cable",
        title: "Connection: RDS Proxy",
        body: "The application never opens a direct connection to the database. Connections are pooled and managed through RDS Proxy, reducing the surface for a leaked or exhausted connection to become a problem.",
      },
      {
        icon: "Database",
        title: "Data: Aurora Postgres with row-level security",
        body: "Row-level security policies are enforced by the database itself. A query scoped to one practice cannot return another practice's rows, even if application code had a bug.",
      },
      {
        icon: "KeyRound",
        title: "Encryption: AWS KMS",
        body: "Data is encrypted at rest with keys managed through AWS Key Management Service, and encrypted in transit between every service in the chain.",
      },
      {
        icon: "ClipboardList",
        title: "Accountability: the audit log",
        body: "Every access to patient data is written to an audit log a practice can review, so questions about who accessed what have a real answer.",
      },
    ] as SecurityLayer[],
    note: {
      title: "What this means for the BAA",
      body: "AWS accepted a Business Associate Addendum for our account, covering the infrastructure above. We sign a separate Business Associate Agreement directly with every practice, because your practice is the covered entity and we are your business associate, not the other way around.",
    },
    honesty: {
      title: "Live today, and what is not",
      live: [
        "Cognito authentication on every request",
        "Row-level tenant isolation in the database",
        "Full audit logging of data access",
        "AWS KMS encryption at rest and in transit",
        "One production endpoint proving the full chain end to end",
      ],
      notYet: [
        "A formal third-party audit such as SOC 2 or HITRUST",
        "The full set of scheduling, billing and records endpoints",
        "A public status page and uptime history",
      ],
    },
  },

  /** Detailed, honest FAQ: Faq03. */
  faq: {
    heading: {
      eyebrow: "Questions we get on every call",
      title: "Ask us the hard questions. Here are honest answers.",
    } as SectionHeading,
    items: [
      {
        q: "Are you HIPAA certified?",
        a: "There is no official HIPAA certification body, so no software vendor can truthfully claim to be HIPAA certified. What we can tell you exactly: we sign a Business Associate Agreement with every practice, we run on AWS services under an accepted Business Associate Addendum, and every practice's data is isolated with row-level security in the database.",
      },
      {
        q: "Who is the covered entity, and who is the business associate?",
        a: "Your practice is the HIPAA covered entity. Dentavanta is your business associate. We sign a Business Associate Agreement with every practice before any patient data is stored, consistent with the AWS Business Associate Addendum already in place at the infrastructure layer.",
      },
      {
        q: "Is my practice's data mixed with other practices' data?",
        a: "No. Every table in the database enforces row-level security, so a query scoped to your practice can never return another practice's rows, even if application code had a bug. This is enforced by the database itself, not just by our application.",
      },
      {
        q: "Do you have SOC 2 or HITRUST certification?",
        a: "Not yet. We are early in our build and have not pursued a formal third-party audit like SOC 2 or HITRUST, and we will not claim one we do not have. What is real today is a signed AWS Business Associate Addendum, Cognito-backed authentication, row-level tenant isolation, KMS encryption, and full audit logging, all described above.",
      },
      {
        q: "What happens if there is a security incident?",
        a: "Every access to patient data is written to an audit log, so we can trace exactly what happened and when. Our Business Associate Agreement sets out the notification process and timelines we commit to for your practice.",
      },
      {
        q: "Where is the data actually hosted?",
        a: "On Amazon Web Services, in the us-east-1 region, on an Aurora Postgres cluster reached through RDS Proxy. There is no direct network path to the database from outside AWS.",
      },
      {
        q: "Can I get a copy of the BAA before committing to anything?",
        a: "Yes. Book a demo and we will walk through the Business Associate Agreement with you directly. It is a real, counsel-reviewed contract negotiated with your practice, not boilerplate we publish on the marketing site.",
      },
    ] as FaqItem[],
    cta: { label: "Book a demo to discuss your BAA", href: "/book-demo" } as Cta,
  },

  cta: {
    heading: {
      eyebrow: "Talk to an actual engineer",
      title: "Ask every security question you have, on one call",
      body: "No sales script. You will talk to the person who built the infrastructure above.",
    } as SectionHeading,
    primary: { label: "Book a demo", href: "/book-demo" } as Cta,
    secondary: { label: "Read our privacy policy", href: "/privacy" } as Cta,
  },
} satisfies PageContent & Record<string, unknown>;

export default security;
