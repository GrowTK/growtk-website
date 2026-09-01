# CLAUDE.md — how to build in this repo

This is Growtk's public marketing site: a plain Next.js app, not a multi-tenant
factory. It started from a website-factory starter kit, which had a "factory" half
(dashboard, Supabase, multi-site provisioning) and a "template" half (the component
library, design tokens, content system). The factory half has been stripped out.
What remains below is the design law that half was built to enforce, which still
applies to every page on this site.

**Two sources of truth:**
- `brand.config.ts` — name, hue, corners, fonts, domain, socials, contact. UI and
  metadata import it; `npm run brand` syncs the build-time surfaces (package.json
  name, `app/globals.css` theme tokens, `lib/fonts.ts`). Never hardcode the name,
  brand color, or domain in a component.
- `content/*.ts` — **all page copy**, one typed file per page (`home.ts`, `about.ts`,
  ...) plus `site.ts` for nav and footer, typed against `content/types.ts`. A
  component with a hardcoded headline is a bug.

## Choosing sections

**Read `components/sections/catalog.tsx`, never the component directory.** That one
file is the index of every block in the library: a two sentence `label` (exact
visual layout, then a "Best for..." line naming what kind of business or content
shape it suits) plus the `file`/`component`/`props` needed to import it. Reading it
once tells you everything needed to decide what to use. Open an individual
component file only for the handful already decided on, to confirm the exact prop
shape before writing the import.

**The library is the floor, not the ceiling.** Composing entirely from stock blocks
is how a site ends up looking like every other site from this starter. Author at
least one section that exists only for this content: the thing this page needs that
nothing in the library covers (the bespoke industry pages under
`content/industries/` and `components/sections/services/` are a good example).
Put it in `components/sections/<category>/` with the rest.

`components/blocks/` is raw vendored third-party component code (magicui,
aceternity, reactbits, eldora...), source material for building new bespoke
sections, not meant to be used directly.

`content/demo.ts` ships on purpose: the whole section library imports its types
and placeholder defaults at compile time. Do not delete it even though nothing on
a real page renders it.

## The stack (don't fight it)

Next.js (App Router, RSC) · Tailwind v4 (CSS-first `@theme`, **no tailwind.config.js**,
tokens in `app/globals.css`) · shadcn/ui (`npm run ui -- <name>`) · `motion` for
animation · **`lucide-react` for every icon** · OpenAI for the optional FAQ widget.

**Dev and build run on Webpack, not Turbopack.** `npm run dev` and `npm run build`
pass `--webpack` with a 4GB heap cap. Turbopack leaks uncapped native memory on
M-series Macs (vercel/next.js#93896); the Webpack path peaks near 500MB.
`npm run dev:turbo` is the deliberate escape hatch, not the default.

---

## Design law — make it look designed, not generated

A visitor should ask "who made this?", never "which AI made this?". Average is invisible.
Have a point of view and commit to it.

### 0. Absolute bans (these come from real failures)
- **No em dashes or en dashes (— –) in any user-facing copy.** Use a period, comma, colon,
  or parentheses. Applies to headings, body, buttons, alt text, metadata, `knowledge.md`.
- **No text over a photo behind a dark gradient scrim.** Unreadable and cheap. Image in its
  own area, text BELOW on a solid surface. Use `components/magic/image-card.tsx` (`ImageCard`).
- **No unreadable contrast.** Body text clears ~4.5:1. Never dark text on a dark or saturated
  surface or a busy image. On a colored/photo panel, put text on `bg-card`/`bg-background`
  or invert to a light token.
- **The favicon is not the logo.** The logo is the branded mark in navbar and footer.
  The favicon is a tab icon only.
- **No grid-grid-grid.** Do not stack three `md:grid-cols-3` sections in a row.
- **No `AuroraBackground` or `GridPattern` in the hero, ever.** Biggest "AI made this" tell.
  Build hero atmosphere from a real image, a color block, a border or texture, or a custom
  shape. They are fine sparingly behind a mid-page CTA.
- **No full-capital-letter headings, sentences or subtitles.** No `uppercase` on `h1`/`h2`/`h3`,
  and no full sentence, subtitle or intro paragraph set in all caps either, a giveaway AI
  pattern. Reserve `uppercase tracking-[0.2em]` for short eyebrow labels only.
- **No divider border between stacked sections.** Do not put a `border-t`/`border-b` line at a
  section's top or bottom to separate it from its neighbor. Sections flow into each other
  through background color, spacing and imagery, never a ruled line.
- **Backgrounds alternate on purpose, never at random.** Across a page's stacked sections,
  pick one of two patterns and hold it for the whole page: every section the same background,
  or a strict alternation between exactly two tones. Never three or more tones, and never an
  unplanned sequence like white, gray, white, white. It reads as improvised.

### 1. Color
Drive everything from the semantic tokens (`bg-primary`, `text-foreground`,
`text-muted-foreground`, `bg-card`, `border-border`, `bg-accent`) so the site re-skins from
one OKLCH hue. **Gradients and gradient text are encouraged** (`text-gradient`, mesh
backgrounds, gradient borders) as punctuation, not as a coat of paint. Have one dominant
color and use it with conviction. Sites that whisper in grey read as templates.

### 2. Typography
Headings `--font-display`, body `--font-sans`, labels `font-mono`. Hero `text-6xl`–`text-8xl`,
`font-bold`, `tracking-tight`, `text-balance`, `leading-[0.95]`. Section heads `text-4xl`–`text-5xl`.
Body `text-base`–`text-lg` `leading-relaxed`. A small tracked mono eyebrow above section heads
is a good recurring motif. Never a flat 16px wall.

### 3. Structure
- 6+ distinct sections on home.
- **Build every inner page.** One real route each, with navbar, footer, metadata, real
  images, 2-4 sections, a CTA. Never ship a one-page site.
- **Vary the layout.** Grids where a grid is right, then break the rhythm:
  `AutoSlider` (`components/magic/auto-slider.tsx`), `Marquee`, `Carousel`, `Gallery` with
  lightbox, bento with varied cells, alternating image/text rows, sticky scroll.
- **A distinctive navbar**, not logo-left + centered-links + button-right.
- **Cards, authored not stock.** No row of identical `rounded-xl border p-6` boxes. Vary
  sizes, add a featured card, an image bleed, a number or eyebrow.

### 4. Icons
Every icon from `lucide-react`; brand glyphs in `components/icons.tsx`. No emoji-as-icons,
no stray SVGs. Icon-only buttons get `aria-label`.

### 5. Images — never empty, never colored boxes, never unbounded
- **A site without imagery is a bug.** Colored `<div>` placeholders are forbidden.
- Real photos only: `public/ingested/<slug>/` or verified Unsplash/Pexels URLs.
- Meaningful `alt` text in the brand voice.

#### Image performance — HARD RULES (breaking these crashes the build)
1. **<=10 images per page rendered with `next/image`.** Does not apply to images inside
   `Gallery` or `Carousel` (plain lazy `<img>`).
2. **Compress at the source.** Nothing over ~400KB in `public/`.
3. **`next/image` discipline** for those <=10: always set `sizes` and explicit
   `width`/`height` (or `fill` + a sized parent), `quality={70}`–`{80}`, and exactly **one**
   `priority` per page (the hero).
4. **Bulk imagery -> plain lazy `<img>`** (`loading="lazy" decoding="async"`) via
   `Gallery`/`Carousel`, never dozens of `next/image` tags.

### 6. Motion
Wrap entering content in `Reveal`/`RevealGroup`, stagger children 50-80ms, keep durations
300-500ms ease-out. **Banned:** everything fading up in unison, the same `whileInView` on
every block, 1s+ floaty fades, looping pulse on static content, gratuitous parallax. All
motion respects `prefers-reduced-motion` (the wrappers do, keep it that way).

### 7. Interaction
**Everything clickable shows `cursor-pointer`.** Disabled -> `cursor-not-allowed`. Every
interactive element gets a visible hover AND `focus-visible:ring`.

### 8. Copy
No "Welcome to our platform" or "Empower your workflow". Concrete outcomes, real verbs.
Copy goes in `content/*.ts`, never in JSX.

### 9. Widgets and contact
- **FAQ widget** (`components/widget/faq-widget.tsx`) is mounted globally, answers from
  `content/knowledge.md`. Works with or without `OPENAI_API_KEY` set (degrades gracefully).
- **WhatsApp widget** renders only when `brand.contact.whatsapp` is set.
- **Map / location**: only build it when `brand.contact.address`/`mapQuery` is set.

### 10. Accessibility
One `<h1>` per page. Real landmarks (`main`/`nav`/`footer`/`section`). Labeled icon buttons.
Decorative layers `aria-hidden`. Keep contrast (no `text-muted-foreground` on `bg-muted`).

---

## Conventions

- `"use client"` only for state, effects, or motion. Default to Server Components.
- Class merging: `cn()` from `@/lib/utils`. Named exports, PascalCase files in
  `components/{sections,ui,magic,widget}`.
- Design decisions can pull from the **`ui-ux-pro-max`** skill (local design DB: styles,
  palettes, font pairings, product types, UX rules, motion). Where it conflicts with the
  bans above, the bans win.
- Class names must be literal. `bg-primary` is scanned, `` `bg-${color}` `` is not and gets
  purged. Keep a lookup object of complete class strings instead.

## Security

- `npm run guard` runs a supply-chain and malware scan (new install scripts, secrets in
  tracked files, `eval`/`child_process`/obfuscated code, unsafe assets). Run it before
  shipping; a BLOCK finding should stop the deploy.
- `.npmrc` sets `min-release-age=1` — the unit is **days**, not minutes.
- Only state what is actually true of Growtk as a business (pricing, process,
  what is built today). Do not add certifications, client counts, or claims
  that have not been verified, especially on the healthcare industry page,
  which must never claim a HIPAA certification (no such certification exists
  for any vendor).
