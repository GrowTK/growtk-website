# Growtk

Public marketing site for Growtk, a studio that redesigns websites and builds
widgets, workflow automation, voice agents and integrations for trade and
service businesses (roofing, railing and fencing, healthcare, and more).

Next.js (App Router) · Tailwind v4 · shadcn/ui · `motion` · `lucide-react`.
Built on a section-library starter (see `CLAUDE.md` for the full design law);
the factory/dashboard half of that starter has been stripped out, this repo
is just the site.

## One-time setup after cloning

```bash
git config core.hooksPath .githooks
npm install
cp .env.example .env   # optional: add OPENAI_API_KEY to enable the FAQ widget
```

`.githooks/pre-commit` scans for accidentally-committed secrets (gitleaks).

## Commands

- `npm run dev` — start the dev server (Webpack, not Turbopack, capped at 4GB)
- `npm run build` — production build
- `npm run brand` — resync theme/fonts from `brand.config.ts` after editing it
- `npm run check` — sub-second preflight (deps, brand sync, content, image weight)
- `npm run guard` — supply-chain / malware scan, same posture as the org's other repos
- `npm run ui -- <name>` — add a shadcn component

## Layout

```
brand.config.ts   name, theme hue, fonts, domain, contact — never hardcode these in a component
content/          all page copy, typed against content/types.ts — never in JSX
app/              layout.tsx, page.tsx, api/chat (FAQ widget)
components/       sections/ (page sections) · magic/ (Reveal, Gallery, Carousel...) ·
                  ui/ (shadcn) · widget/ (faq, whatsapp) · blocks/ (raw vendored
                  components used as source material for new bespoke sections)
public/ingested/  real images used across the site
```

See [`CLAUDE.md`](./CLAUDE.md) for the full design system rules (color, type,
motion, image limits, accessibility) that this site follows.
