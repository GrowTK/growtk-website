# Knowledge base

The FAQ widget answers only from this file. Keep it factual, short, and specific.
Never invent features, certifications, prices, or customer numbers that are not below.

## About

Dentavanta is a pre-launch, early-access practice management platform for small
dental and cosmetology practices. It is built by two people: Jean Derisma (business)
and Muhammad Anique (engineering). The platform is not fully built yet. One real API
endpoint (a "whoami" check) proves the full authentication, tenant isolation, and
audit logging chain works end to end today, and the rest of the platform is being
built out on that same foundation with founding practices in early access.

Do not claim the product has dozens of live features. Do not invent a team size,
customer count, or usage statistic beyond what is written here.

## Security and compliance

- There is no official "HIPAA certified" status. No vendor can truthfully claim it,
  because no certifying body exists. Never say "HIPAA certified."
- Dentavanta is built for HIPAA compliance. AWS has accepted a Business Associate
  Addendum (BAA) at the account level, covering the infrastructure.
- Under HIPAA, the practice (dentist or cosmetologist) is the covered entity, and
  Dentavanta is the practice's business associate. Dentavanta signs a Business
  Associate Agreement (BAA) directly with every practice before storing patient data.
- Real infrastructure, all on AWS in the us-east-1 region:
  - AWS Cognito for tenant-scoped authentication (JWT-based, no shared logins).
  - API Gateway and Lambda for the application layer.
  - Aurora Postgres with row-level security (RLS): every practice's data is isolated
    at the database level, enforced by the database itself, not just application code.
  - RDS Proxy in front of Aurora for connection management.
  - Full audit logging: every access to patient data is written to an audit_log table.
  - AWS KMS-managed encryption, at rest and in transit.
- Dentavanta has not pursued SOC 2, HITRUST, ISO 27001, or any other formal
  certification or audit. Do not claim one. If asked, say honestly that these have
  not happened yet, and describe what infrastructure is real instead.
- No physical office address, support phone number, or WhatsApp number exists yet.
  Direct people to hello@getdentavanta.com or the Book a Demo page.

## Pricing

No public pricing has been set. Pricing is being shaped with founding practices
based on practice size and which modules a practice needs. Direct people to
book a demo for a real conversation about cost. Never state a specific dollar
amount or tier.

## Onboarding and timeline

Dentavanta is in early access. Founding practices are onboarded in step with what
is built. There is no fixed public launch date to quote. Encourage booking a demo
to get an honest, specific answer for that practice.

## Contact

- Email: hello@getdentavanta.com
- Phone: not available yet
- WhatsApp: not available yet
- Address: not available yet
- Best next step: Book a Demo at /book-demo

## FAQ

Q: Is Dentavanta HIPAA certified?
A: There is no official HIPAA certification body, so no vendor can truthfully make
that claim. Dentavanta is built for HIPAA compliance: we sign a Business Associate
Agreement with every practice, and AWS has accepted a Business Associate Addendum
covering our infrastructure.

Q: Who is the covered entity and who is the business associate?
A: Your practice is the HIPAA covered entity. Dentavanta is your business associate.
We sign a Business Associate Agreement with every practice before any patient data
is stored.

Q: Is my practice's data isolated from other practices?
A: Yes. Every table enforces row-level security in the database itself, so a query
scoped to one practice cannot return another practice's rows.

Q: Do you have SOC 2 or HITRUST?
A: Not yet. We are early in our build and have not pursued a formal third-party
audit. We will not claim one we do not have.

Q: What does Dentavanta cost?
A: No public pricing has been set yet. Early access pricing is being shaped with
founding practices. Book a demo for a real conversation about cost.

Q: Is the product fully built?
A: No. Dentavanta is in early access. One real API endpoint proves the full
authentication, tenant isolation, and audit logging chain today, and the rest of
the platform is being built out on that same foundation.

Q: How do I get in touch?
A: Email hello@getdentavanta.com or book a demo at /book-demo.
