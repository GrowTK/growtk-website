
# Go-to-Market & Sales Plan

How to actually sell an equivalent-to-Macro workspace product, built specifically for **agencies and client-services businesses** (confirmed wedge — see §4), launching first with **software/web development agencies and digital product studios** (the beachhead vertical — see §3). Builds on `README.md` (what Macro is) and `ARCHITECTURE.md` (how we'd build it) — read those first if you haven't.

---

## 1. The hard constraint this plan has to solve

**Macro's actual product is free.** It's AGPLv3, "not open-core," 4,100+ stars, and anyone can `git clone` and self-host it today at zero license cost. It's also 2 years dogfooded by ~15 engineers and backed by real funding ($9.3M+ raised in its earlier form).

That means "build the same features, charge $40/seat like they do" doesn't work on its own merits — we can't out-execute a funded 2-year head start, can't out-price "free," and can't win on "open source" when they already are it.

**What Macro sells is the hosted, zero-ops version, brand trust, and being first/biggest in the category** — not an opening for a newcomer building the identical thing. So this plan is not "clone Macro and undercut it." It's: use what we learned about *how* Macro built this to build a narrower, differentiated product for an audience Macro isn't optimized for, sold the way bootstrapped products actually win.

## 2. Market research: agencies and client-services businesses

### Market size

Estimates for "agency management software" vary a lot by definition and methodology — treat these as directional, not precise:

| Source estimate                              | Figure                                   |
| -------------------------------------------- | ---------------------------------------- |
| Verified Market Research                     | $3.4B (2024) → $6.1B (2032), ~7.5% CAGR |
| 360iResearch-class estimate                  | ~$4.6-4.9B (2025-2026), ~7.4% CAGR       |
| Broader "agency management software" framing | ~$7.8B (2026) → $17B (2035), ~9% CAGR   |

Whichever number you trust, the direction is consistent: **a multi-billion-dollar market growing ~7-10%/year**, driven by operational-efficiency demand and cloud adoption. [Verified Market Research](https://www.verifiedmarketresearch.com/product/agency-management-software-market/) · [360iResearch](https://www.360iresearch.com/library/intelligence/agency-management-software) · [Business Research Insights](https://www.businessresearchinsights.com/market-reports/agency-management-software-market-104181)

### Market structure — why this is a good bootstrap market, not just a big one

- **~40,000 digital marketing agencies in the US alone** by broad count (verified-directory counts run lower, ~10-35k depending on strictness), and that's before counting design studios, dev shops, PR firms, consultancies, and boutique creative agencies as a broader "client-services" category. [Source](https://inovixus.com/2026/05/16/how-many-digital-marketing-agencies-in-us/)
- **87-88% of agencies have fewer than 50 employees**, and a large share have fewer than 10 — the industry is overwhelmingly small/micro firms, not a market dominated by a handful of large buyers. [Source](https://www.hausadvisors.com/blog/marketing-agency-industry-statistics)
- This matters directly for GTM: a market of mostly-small, numerous buyers is a **PLG/self-serve market**, not an enterprise-sales market — which matches a bootstrapped, small-team capacity far better than trying to land large accounts.

### Buyer pain — this is the part that validates the wedge

- The average agency stack has **at least 3 tools handling planning and 2 handling reporting**, often with two overlapping PM tools left over from a mid-migration that never finished — "double data entry, split team attention, higher onboarding friction." This is Macro's own "not computable, chaotic" complaint, independently confirmed for agencies specifically. [Source](https://aismartventures.com/posts/owner-operated-agency-stack-audit-2026-drop-add-keep-for-ai-margins/)
- Industry-wide, **the average business runs 254 apps and only ~45% see regular use** — real, measurable software waste. [Productiv, via same source]
- Agencies "should" spend **5-15% of operating budget on software (~$300-800/mo for a small shop)**, but audits show many actually spend **$1,200-1,900/mo** — meaning **stack consolidation is a live, quantifiable pitch** ("replace $1,500/mo of overlapping tools with one $400-800/mo tool"), not just a vibe. [Source](https://agiled.app/statistics/agency-technology-statistics)
- The **#1 reported pain point for agency owners, year after year, is new business/pipeline** — i.e., they're underinvested in tracking and following up on relationships, which is exactly what a self-updating CRM-from-conversations addresses structurally rather than by adding another manual-entry tool.

### Competitive landscape (who we actually compete with — not Macro)

| Competitor                                              | Price                                                                    | What it's for                                                                                              | Gap vs. our wedge                                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GoHighLevel**                                   | $97-$497/mo flat per agency (unlimited client sub-accounts, white-label) | Marketing-automation-in-a-box that agencies resell to*their* clients (funnels, SMS, appointment booking) | Built for agencies reselling marketing automation, not for internal team collaboration — no real-time collaborative docs, no bidirectional entity graph                           |
| **HubSpot**                                       | Free CRM → $20/mo Starter → scales up                                  | Sales pipeline + marketing automation                                                                      | Explicitly**lacks contracts, invoicing, project management, and a client portal** per third-party reviews — exactly the gaps a workspace-native tool fills                  |
| **Dubsado**                                       | $35/mo (Starter) - $55/mo (Premier), flat per business                   | Client onboarding/workflow automation for solo service providers (photographers, coaches, consultants)     | Built for**solo freelancers**, not teams — no real-time multi-person collaboration or team chat                                                                             |
| **HoneyBook**                                     | $40/mo (Premier), flat per business                                      | Client management + payments, mobile-first                                                                 | Same solo/freelancer-first gap as Dubsado; not built for a team working together on client docs                                                                                    |
| **Scoro**                                         | $23.90-$59.90/user/mo                                                    | Time tracking, financial control, BI for professional services                                             | Real per-seat team tool, but analytics/ops-first — not docs/chat-native, no auto-updating CRM from conversations                                                                  |
| **Copper / Streak**                               | $12-69/user/mo (Copper), free-$49/user/mo (Streak)                       | Gmail-native CRM                                                                                           | CRM only — no docs, tasks, or chat; still requires a separate PM tool                                                                                                             |
| **ClickUp / Notion / Airtable + a bolted-on CRM** | $10-20/user/mo each, stacked                                             | Generic docs/PM, wired together with Zapier                                                                | This is literally the "not computable" fragmentation Macro's whole thesis (and our own §2 pain-point research above) describes — multiple tools, manual syncing, no shared graph |

**The real gap**: every dedicated "agency CRM" (GoHighLevel, Dubsado, HoneyBook) is solo/freelancer-first or marketing-automation-first, not team-collaboration-first. Every team-collaboration tool (ClickUp, Notion, Airtable) has no native CRM and requires manual Zapier-style stitching. **Nobody in this specific competitive set has Macro's core technical idea — a single bidirectional entity graph + real-time collaborative docs that make the CRM self-updating from actual client conversations.** That combination is our actual differentiator, and it's a genuine technical gap, not just a marketing angle — none of the above competitors are architected around it.

### AI trend — a real tailwind, not just hype to chase

2026 industry commentary is converging on **"agentic CRM"**: agents that act on stalled deals or unanswered messages autonomously, not just draft-and-wait copilots. Salesforce (Agentforce), HubSpot (Breeze), Zoho, and Pipedrive are all shipping agent features into their existing per-seat CRMs. [Source](https://www.bigin.com/articles/seven-crm-trends-that-will-define-2026-and-2027.html)

This validates `ARCHITECTURE.md`'s Phase 6 (Agents + memory) as a real differentiator worth investing in, but note the risk: **incumbents are moving here too**, so "we have AI" alone won't be enough by the time we ship Phase 6 — our AI story needs to be specifically "the agent knows what happened because it reads the same graph as the CRM, not because it's a chatbot bolted onto a static database" (see `features/agents/README.md`), which none of the listed competitors can claim structurally.

### TAM / SAM / SOM (rough, bottom-up — treat as planning inputs, not forecasts)

- **TAM**: ~$4-8B global agency-management-software spend today, growing to an estimated ~$12-17B by the early 2030s (per the range of estimates above).
- **SAM**: Realistically addressable = small/mid agencies and client-services firms (<50 employees) in English-speaking markets who'd pay for a team collaboration + CRM tool. Using the US alone (~40k digital agencies, plus a comparable-or-larger number of non-"digital-marketing" client-services firms — design, dev, PR, consulting, boutique creative), a conservative estimate is **150,000-300,000 target businesses in the US**, more including UK/Canada/Australia. At an average $3,000-6,000/year per customer, that's roughly **$0.5-2B/year SAM**.
- **SOM (realistic 3-year target for a small/bootstrapped team)**: capturing even 0.05-0.2% of SAM — **100-500 paying agency customers at ~$3,000-6,000/year average = $300K-$3M ARR**. Use the low end of this range as the actual planning target; treat anything above it as upside, not the base case.

## 3. Which vertical to launch with

"Agencies and client-services businesses" (§4) is the wedge *category* — but not all agency types are the same buyer, and spreading GTM effort across all of them at once is how a small team achieves nothing anywhere. This section researches the actual sub-verticals and picks one beachhead.

### Candidates compared

| Vertical                                                              | Est. size (US)                                                                                                                                                                                                                         | Dominant pain                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Existing tool lock-in                                                                                                                                   | Fit with our build order                                                                                                    |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Digital marketing agencies                                            | ~40,000 firms; agencies average 18 (small, 10-24 FTE) to 48 (large, 50+ FTE) concurrent retainer clients                                                                                                                               | Cares most about**CRM/lead-tracking** — many concurrent client relationships to juggle [source](https://prometheanresearch.com/client-retention-rate/)                                                                                                                                                                                                                                                                                                                  | **Heavy** — GoHighLevel is purpose-built for exactly this buyer (resell marketing automation to their own clients); HubSpot dominant too         | **Weak early fit** — the feature this buyer cares about most (CRM) doesn't ship until Phase 5 of `ARCHITECTURE.md` |
| **Software/web development agencies & digital product studios** | 200,000+ businesses in the broad "web design/development services" category (caveat: this figure includes many solo/freelance operations outside our team-focused target; the real team-sized-agency count is smaller but still large) | **Matches our Phase 2-3 pain almost exactly**: professional-services delivery teams commonly run 3-5 separate tools just for tasks/time-tracking/budget spreadsheets/Slack; client-approval bottlenecks; retainers, one-off builds, sprints, and subcontractors all mixed together with nothing tying them to the client conversation that spawned them [source](https://aismartventures.com/posts/owner-operated-agency-stack-audit-2026-drop-add-keep-for-ai-margins/) | **Light** — generic tools (Linear/Jira/ClickUp + Notion + email/spreadsheets), no dominant agency-specific incumbent forcing a hard displacement | **Strong** — the docs+tasks+chat loop (Phases 2-3, before CRM even exists) already addresses their most-cited pain   |
| Creative/design studios                                               | ~28,600 "registered design agencies" in the US, plus many smaller/solo studios                                                                                                                                                         | Project-based, visual-first work; canvas/asset-heavy                                                                                                                                                                                                                                                                                                                                                                                                                          | Moderate — generic PM tools + HoneyBook/Dubsado for invoicing are common here                                                                          | **Weak** — Canvas is Phase 7, our last-built block                                                                   |
| PR / communications firms                                             | Smaller, specialized niche                                                                                                                                                                                                             | Needs a*media-contact* CRM (journalists/outlets) — a fundamentally different data model than a client/deal CRM                                                                                                                                                                                                                                                                                                                                                             | **Very heavy** — Muck Rack, Cision, Prezly are purpose-built for exactly this and dominate the category                                          | **Weak** — our entity graph isn't modeled around media relations                                                     |
| Boutique consulting firms                                             | Smaller in count than agencies broadly; higher per-seat willingness to pay ($15-50/seat/mo is their stated norm)                                                                                                                       | Needs the full deal→scope→staff→bill→profitability lifecycle (PSA-grade time/billing depth)                                                                                                                                                                                                                                                                                                                                                                               | **Heavy** — Scoro, Accelo, Productive.io already serve this well with financial/billing depth we're not building early                           | **Weak-to-moderate** — our roadmap doesn't prioritize time-billing/financial features                                |

### Recommendation: start with software/web development agencies & digital product studios

Three reasons this beats defaulting to "marketing agencies" (the largest-sounding, most obvious option):

1. **It matches what we can actually ship first.** Their most-cited pain — fragmented tools for tasks, time, approvals, and client communication — is precisely Phases 2-3 of `ARCHITECTURE.md` (Docs+Tasks+Chat with bidirectional mentions), not Phase 5 (CRM). We can deliver real value to this buyer *before* the CRM block even exists. Marketing agencies, by contrast, care most about the CRM/lead-tracking piece specifically — the last thing we build.
2. **Much lower competitive lock-in.** GoHighLevel was purpose-built to be a marketing agency's tool of choice (it literally lets them resell automation to their own clients) — going after marketing agencies first means fighting a tool designed for exactly that buyer from day one. Dev/software agencies have no equivalent dominant incumbent; they're stitching together generic tools, which is a far more winnable displacement.
3. **Best product-channel-founder fit.** Dev/software agency owners are a technical audience who will actually understand and value the real differentiator (a real-time collaborative, CRDT-backed doc system with a bidirectional entity graph) rather than take it on faith — which lines up with the "build in public" technical content motion (§7) far better than a generalist agency-owner audience would.


This refines — not replaces — the broader wedge in §4: "agencies and client-services businesses" is still the category and the long-run market; early GTM effort just concentrates on this one sub-vertical instead of spreading thin across all of them.

## 4. The wedge (confirmed)

**Agencies and client-services businesses** — dev shops, marketing/creative agencies, consultancies, PR firms, boutique studios — who manage many external client relationships and currently duct-tape a CRM + a PM tool + Slack + a docs tool together. **Launching specifically with software/web development agencies & digital product studios first** (§3).

Why the category holds up after research, not just as a theoretical pick:

1. **The pain is real and quantified** (§2): 3+ overlapping planning tools, $1,200-1,900/mo actual spend vs. $300-800/mo "should," #1 owner pain point is exactly what a self-updating relationship graph addresses.
2. **The market is bottom-up-shaped** (§2): tens of thousands of small firms, not a handful of enterprise accounts — matches a PLG motion a small team can actually execute.
3. **The competitive gap is structural, not cosmetic** (§2): nobody selling into this exact buyer has Macro's bidirectional-graph architecture; the incumbents are split between solo-freelancer tools and team-collab tools with no native CRM.
4. **It doesn't require the full build to be useful**: Phase 1-3 of `ARCHITECTURE.md` (Docs+Tasks+Chat) is already a usable MVP for a dev/software agency managing client work, before Email/CRM (Phase 4-5) exist.

## 5. Positioning

Don't position against Macro (a 4,100-star open-source project isn't a compelling "competitor" to cite when pitching a niche product — it makes us look small). Position against what the beachhead buyer (§3) is actually switching from:

- **Headline (dev/software agencies, our launch audience)**: "One shared workspace per client — docs, tasks, and approvals tied to the conversation that created them — instead of Linear/Jira + Notion + a spreadsheet + Slack."
- **Headline (broader agency category, for later expansion)**: "...instead of ClickUp/Notion + Airtable/HubSpot + Slack, held together by Zapier."
- **Vs. Linear/Jira + Notion (what dev agencies actually use today)**: "Great tools individually, but a task, its doc, and the client thread that spawned it are three disconnected places to look. We make them one."
- **Vs. GoHighLevel** (relevant once we expand to marketing agencies, §3): "GoHighLevel is marketing automation you resell to clients. We're the internal workspace your team actually works in with those clients."
- **Vs. HubSpot**: "HubSpot tracks the deal. We also hold the docs, the tasks, and the conversation that got you there — no separate PM tool."
- **Vs. Dubsado/HoneyBook**: "Built for teams, not solo freelancers — real-time collaboration, not just client-facing forms and invoices."
- **Category framing**: "client operations for agencies" (or "for dev shops," for the launch vertical specifically), not "open-source workspace alternative" (that's Macro's exact line from `/posts/linear-alternative` — don't reuse it).

## 6. Pricing

Competitor pricing research (§2) shows a real split: solo/freelancer tools (Dubsado, HoneyBook) price **flat per business** ($35-55/mo), while team tools (Scoro, Copper, Streak) price **per seat** ($12-69/user/mo). We're a team tool, so per-seat is the right model — but priced to make the "replace $1,200-1,900/mo of overlapping tools" pitch obviously true. This also matches how our launch vertical already buys software: dev/software agencies are very used to per-seat pricing (Linear, GitHub, Jira are all per-seat), so it's a familiar model, not a new one to justify.

| Tier         | Price                                     | Notes                                                                                                                                                                                                        |
| ------------ | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Free         | $0 — 1 workspace, up to 3 active clients | Land-grab tier, matches HubSpot/Streak's proven free-tier-driven top of funnel                                                                                                                               |
| Team         | **$20-25/seat/mo**                  | Undercuts Scoro's Growth tier ($38.90) and Copper's Professional tier ($69) while including docs+chat+tasks+CRM natively, which neither offers                                                               |
| Agency/Scale | **$40-50/seat/mo**                  | White-label client portals, custom fields per client type, priority support — positioned near GoHighLevel's Unlimited tier ($297/mo flat) as the "we also don't nickel-and-dime you on client count" option |

A 10-person agency on the Team tier ($20-25/seat) pays ~$200-250/mo — well inside the "$300-800/mo software budget" agencies say they *should* spend (§2), and well below the $1,200-1,900/mo they're often actually spending across a fragmented stack. Lead with that math in sales/marketing, not with "cheaper than Macro" (irrelevant to this buyer, who's never heard of Macro).

## 7. Go-to-market motion

Bootstrapped/small-team reality (per your Supabase/cost-conscious steer in `ARCHITECTURE.md`) means **product-led growth + founder-led sales for the first customers, not a sales team** — also, not coincidentally, how Macro itself grew.

1. **Dogfood first.** Don't sell anything until we (or one design-partner agency) use it for real client work through Phase 1-3. A workspace tool nobody has actually lived in will have obviously wrong defaults.
2. **Design partners (0 → 5 customers), specifically dev/software shops.** Recruit 3-5 small software/web development agencies or digital product studios once Phase 3 (Chat) is done — warm network, direct outreach, or the communities this buyer actually reads: Indie Hackers, Hacker News ("Show HN"), r/webdev and r/agency, freelance/agency dev Discord and Slack communities, and dev-agency-owner newsletters. Goal: validate the loop, not revenue.
3. **Build in public, aimed at the right audience — which for this vertical is the same audience.** Unlike a generic agency-owner buyer, dev/software agency owners *are* the technical audience, so the CRDT/bidirectional-graph architecture story genuinely works as both credibility-building content (X/Indie Hackers/Hacker News) and buyer-facing pitch at the same time — a rare alignment worth exploiting while we're in this vertical.
4. **Public launch at Phase 4-5** (Email + CRM done — when "self-updating CRM" is actually true, and also the point of expansion to marketing agencies per §3). Target: Product Hunt, Hacker News, dev-agency communities (§7.2), and listings on G2/Capterra/Software Advice under "agency project management" and "CRM for agencies" categories — plus, once expanding to marketing agencies, their specific channels (agency-owner Facebook/LinkedIn groups, r/agency and adjacent subreddits).
5. **SEO/content on the real search terms.** For the launch vertical: "project management for software agencies," "client management for dev shops," "[Linear/ClickUp] alternative for agencies." For the marketing-agency expansion later: "best CRM for agencies," "client management software for agencies," "[GoHighLevel/HubSpot] alternative."
6. **Paid acquisition later, not first.** Only after organic/PLG signal (signups, activation, retention) confirms the wedge.

## 8. GTM phased against the build roadmap

Ties directly to `ARCHITECTURE.md` §6 — don't get ahead of what the product can actually deliver. Vertical column reflects the sequencing recommendation from §3.

| Build phase                | What's real                           | Vertical focus                                                    | GTM motion                                                                                                                  |
| -------------------------- | ------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| 1. Foundations             | Nothing user-facing yet               | —                                                                | Internal only                                                                                                               |
| 2. Docs + Tasks            | Usable for one team's internal work   | Dev/software agencies                                             | Dogfood with our own work                                                                                                   |
| 3. Chat                    | Full internal loop works              | Dev/software agencies                                             | Recruit 3-5 design-partner dev/software shops, free, direct outreach                                                        |
| 4. Email                   | Unified inbox + task-from-email works | Dev/software agencies                                             | Expand design partners to ~15-20; start buyer-facing content (dev-agency-specific pain, §7)                                |
| 5. CRM                     | "Self-updating CRM" claim is now true | Dev/software agencies**+ begin marketing-agency expansion** | **Public launch**: Product Hunt, Hacker News, dev-agency communities, G2/Capterra listings, first paid tier turned on |
| 6. Agents + memory         | AI differentiation story is real      | Both verticals                                                    | Lean into "agentic, graph-native AI" framing — differentiate explicitly from incumbents' bolted-on copilots (§2)          |
| 7. Calls + Canvas + polish | Full parity with the wedge's needs    | Both verticals, evaluate creative/consulting as#3                 | Scale paid acquisition and SEO; consider further vertical expansion (§3's lower-ranked candidates)                         |

Do not use "self-updating CRM" language publicly before Phase 5 genuinely works, and don't start marketing-agency-specific spend before that point either — the CRM is the entire reason that vertical becomes winnable (§3).

## 9. Metrics to track per phase

- **Phases 3-4 (design partners)**: weekly active usage per partner, whether they'd be upset if it disappeared (PMF signal), qualitative feedback on the docs/tasks/chat loop.
- **Phase 5+ (public)**: signup → activation (created a client/project + invited a teammate within 7 days), week-4 retention, free→paid conversion, MRR, CAC if any paid channel is tested, and specifically **software-consolidation stories** (how many tools a new customer says they dropped — this is the core pitch, track whether it's actually happening).
- **Ongoing**: churn reasons (exit survey), NPS from paying agencies specifically, win/loss reasons vs. the named competitors in §2 (not vs. Macro — customers won't be comparing us to Macro). Once marketing-agency expansion starts (Phase 5+), track the two verticals' funnel metrics separately — don't let one vertical's numbers mask the other's underperformance.

## 10. Licensing note (don't skip)

If any actual code from the cloned `macro-inc/macro` repo (`./macro`) is reused rather than studied for architecture ideas, **AGPLv3's copyleft terms apply**: a derivative must also be released under AGPLv3, including for SaaS/network use. That's incompatible with a closed-source business on their code without a commercial license (`licensing@macro.com` per their README).

This plan assumes we write our own implementation per `ARCHITECTURE.md`'s from-scratch stack (Next.js/Supabase/Yjs), using their repo only as an architecture reference — which avoids this issue entirely.

## 11. Risks

- **Beachhead vertical is wrong**: if dev/software agency design partners don't respond, the fallback candidates from §3 are creative/design studios (similar tool-fragmentation profile) before defaulting to marketing agencies (harder, due to GoHighLevel/HubSpot lock-in) — don't skip straight to competing with Macro head-on either.
- **Dev/software agencies may already be "good enough" satisfied**: Linear+Notion+Slack is a genuinely competent stack many dev shops already like individually — the switching cost isn't zero even with fragmentation pain, so the pitch needs to be "connect what you have's data" credibly, not just "throw it all out."
- **Underestimating build time**: a stalled Phase 4 (Email — the highest-friction OAuth/ingestion work) delays the whole public launch and the marketing-agency expansion that depends on Phase 5.
- **Incumbents ship agentic AI first**: HubSpot/Salesforce/Zoho are all moving into agentic CRM now (§2) — our differentiation has to be the graph architecture specifically, not "we have AI too," or we lose that argument to better-funded incumbents by Phase 6.
- **Market fragmentation cuts both ways**: many small buyers means low individual deal risk, but also means no single channel dominates — expect to need 2-3 working channels (content/SEO + communities + Product Hunt/launch) rather than one silver bullet.
