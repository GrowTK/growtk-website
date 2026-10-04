# Growtk. business model

Internal planning document. This is the source of truth for what Growtk actually
is and does, written up before turning it into website copy, SEO content or
sales material. Keep this updated as the business changes; treat the live site
(`content/*.ts`) as downstream of this doc, not the other way around.

No em dashes or en dashes, so anything copied straight into `content/*.ts`
already passes that rule.

## 1. Who is behind it

- **Muhammad Anique** and **Asad Ali**, both software engineers.
- Run as a for-profit operating business, not a side project or portfolio piece.
  The purpose is revenue: sell real, delivered work to real businesses.
- The core technical advantage over a typical web or marketing agency: both
  founders can actually build automation, AI agents and integrations
  themselves, in house, rather than reselling a no-code tool or subcontracting
  the technical work out. That is the wedge this whole business model leans on.
- Longer term, the team is also building its own CRM product. It is early and
  slow right now, so it is **not** a service Growtk sells today. Until it is
  ready, Growtk builds on top of the CRMs clients already run (GoHighLevel,
  Jobber, ServiceTitan, HubSpot, Salesforce and others), the same positioning
  already live on the site (see `components/sections/logos/logo-marquee-band.tsx`
  and `content/services.ts`). Treat the in-house CRM as a roadmap item, a
  future upsell path once it is real, never as a current claim.

## 2. Who we sell to

Small and mid-size trade and service businesses that make money by getting the
phone to ring and a job booked: currently HVAC, roofing, railing and fencing,
cleaning, and healthcare front offices (the industries already live in
`content/home.ts` and `content/industries/`). The pattern across all of them:
an outdated or DIY website, no real automation behind it, and leads going cold
because nobody, and nothing, follows up fast enough.

## 3. What we actually sell today

The founders listed six services. Below is the same six, tightened up and
matched to what is realistic to promise and deliver, plus what is already live
in `content/services.ts` and `content/pricing.ts` versus what still needs to be
written.

### 3.1 Website redesign
Modern, fast, mobile-first redesigns for businesses running an outdated or
DIY site. Already the best-covered service on the current site (`Launch` tier,
starting at $3,500 one-time). No change needed to the positioning, just keep
it as the entry point most clients start with.

### 3.2 SEO and content
Framed by the founders as "get your website on top" with "detailed content."
This is the biggest gap between what was asked for and what the current site
says: `content/services.ts` and `content/pricing.ts` do not mention SEO as its
own line item today. Given how much weight this is meant to carry, it should
become its own numbered service, not a footnote inside website redesign. What
"extremely high level SEO" actually has to include to be a credible claim:

- **Technical SEO**: Core Web Vitals, crawlability, structured data
  (LocalBusiness, Service, FAQ, Review schema), clean URL and sitemap
  structure. This site already ships fast (see the Webpack build discipline
  and image rules in `CLAUDE.md`), which is a real, provable technical SEO
  advantage over most small-business sites, worth stating as a genuine fact,
  not a stat.
- **Local SEO**: Google Business Profile optimization, citation consistency,
  service-area pages per city/region, review volume and response, the actual
  ranking factors that get a trade business into the map pack.
- **Content SEO**: service and location pages written to rank, not just a
  generic "detailed content" blob. This is where the "our own CRM" and
  automation expertise can double as a differentiator: automated content
  refresh pipelines, not a one-time blog post.
- **Conversion, not just traffic**: SEO that ranks but does not convert is a
  wasted service. Tie every SEO engagement back to the widgets and automation
  below, since a ranked page that does not capture and route the lead is only
  half the job.

### 3.3 The chat widget ("Power Agent")
The founders' own name for it, and it deserves the name: this is not a
generic FAQ bot. Confirmed capabilities to build the offer around:

- Handles images and video in conversation (showing a job photo, a product
  shot, a how-it-works clip).
- Internal website redirection (sends a visitor straight to the right page,
  service, or booking flow instead of making them navigate).
- Sends email inquiries on the visitor's behalf.
- Reports live project or job status back to a customer who asks.
- Generates QR codes for specific use cases (a quote link, a warranty
  registration, a review request, a job-specific document).

This is a clear upgrade path from the FAQ widget already live at
`components/widget/faq-widget.tsx`, which today only answers from
`content/knowledge.md` and degrades gracefully without an API key. Power Agent
is the productized, sold version of that same capability, with real actions
attached, not just answers. Worth keeping both: the FAQ widget as the
always-on baseline every site ships with, Power Agent as the paid upgrade with
the action layer (email, redirects, QR, status lookups) on top.

### 3.4 AI readiness and automation
An assessment-led service: look at a business's actual workflow, find the
repetitive and manual tasks, and introduce automation and AI where it
measurably removes work. This is the consulting entry point into the
`Automate` tier already on the pricing page. Keep it framed as diagnosis
first, build second, the same "audit before we build anything" process
already established in `content/services.ts` and `content/pricing.ts`.

### 3.5 Voice agents
Inbound and outbound AI voice agents wired into a real-time booking workflow,
with human escalation and call forwarding when the agent should not (or
cannot) handle something itself. Already live in `content/services.ts` under
`voice-agents`. The human escalation and call-forwarding detail is not yet
explicit in the current copy and should be added: it is what makes a voice
agent trustworthy to a business owner who is afraid of losing a customer to a
bot, not just a feature.

### 3.6 Automation of sheets, docs, alerts and follow-up
Google Sheets and Docs automation, real-time alerts, SMS follow-up campaigns,
and CRM work across GoHighLevel and other platforms. This overlaps with the
existing `integrations` and `automation` service entries in
`content/services.ts`. The SMS follow-up campaign angle (drip campaigns after
a missed call or a cold quote) is the one piece worth pulling out and naming
explicitly, since it is a concrete, easy-to-sell feature on its own.

## 4. Suggested additions

Services that were not listed but follow directly from the same skill set and
the same customer base, worth writing into the site once prioritized. Ordered
roughly by how fast they could be sold and delivered.

**Near-term, easy to attach to what already exists:**

1. **Missed-call text-back.** The instant a call is missed, an automatic SMS
   goes out. Cheap to build on top of the voice agent and automation stack
   already sold, and one of the single easiest things to demo and sell to a
   trade business owner who loses jobs to voicemail.
2. **Review and reputation automation.** Automatic review requests after a job
   is marked complete, plus monitoring and templated responses. A natural
   extension of the SMS follow-up and CRM automation work already planned.
3. **CRM migration and cleanup.** Businesses switching into GoHighLevel or
   consolidating from spreadsheets and multiple tools need someone to
   actually move and dedupe the data. Direct use of the GHL and CRM expertise
   already claimed.
4. **Reporting dashboards.** A weekly automated owner report (leads in, calls
   answered, jobs booked, review requests sent) built from the same
   automation pipes already being wired for a client. Low extra effort, high
   perceived value, since owners want to see the automation is working
   without asking.

**Medium-term, needs its own small build:**

5. **Local SEO and Google Business Profile management** as a standalone,
   recurring line item rather than folded into the general SEO service,
   since it is sold and billed differently (ongoing, not a one-time
   optimization pass).
6. **Paid lead ads with call tracking.** Google and Meta lead ad campaigns
   feeding directly into the same widgets, automation and voice agents
   already built for the client, with call tracking numbers so the client
   can see exactly what an ad spend produced.
7. **QR-to-action campaigns.** Physical-world QR codes (truck decals, yard
   signs, invoices, job-site signage) that trigger a specific Power Agent
   flow: instant quote, review request, warranty registration. Reuses the QR
   capability already built for the chat widget instead of a one-off.
8. **Maintenance and care plans.** A lower-cost monthly plan (uptime,
   security patching, backups, small content edits) for `Launch` clients who
   are not ready for the `Automate` retainer, so there is a step between a
   one-time build and full automation, instead of losing the relationship
   after launch.

**Longer-term, strategic:**

9. **Vertical starter kits.** Pre-built site and automation templates per
   industry (a roofing kit, an HVAC kit) to cut build time and improve
   margin on repeat industries, without it looking templated to the client
   (see the "one bespoke section per page" rule already in `CLAUDE.md`, that
   discipline still applies even when reusing an internal starting point).
10. **The in-house CRM, once it is ready.** Not sellable yet, but the
    long-term differentiator: every automation and integration built for a
    client today on top of GoHighLevel or another CRM is also a rehearsal for
    what the in-house product needs to do. Track this gap deliberately
    instead of building the CRM in a vacuum.

## 5. Positioning line for content and SEO work

Two software engineers who build the automation and AI most agencies only
resell. Every service on this list is either something already shipped on
this exact site (the FAQ widget, the section library, the build pipeline) or
a direct extension of the same automation and integration skill set, not a
generic marketing-agency service list with AI vocabulary bolted on. That
"we built this the same way we are selling it" angle is the single strongest,
most differentiated thing to lead content and SEO with, and it is true today,
not aspirational.
