# Project decks: how to add a project to "Projects we can show you running"

The homepage `#work` section promises: **"Not mockups. Real systems built the same
way we build yours."** Every project on it has to earn that line. A project is a
card on the homepage that morphs into a full screen deck at `/work/<slug>`, and the
middle of that deck is a **working replica of the real product's UI**, running on
a shared demo dataset the visitor can click through and change.

Corvinn (`/work/corvinn`) was the first. Yetti (`/work/yetti`) follows the same
pattern. This file is the recipe, so the third project looks like the first two.

---

## 1. The moving parts

| Piece | File | What it holds |
| --- | --- | --- |
| Registry | `content/projects.ts` | One `Project` entry per project: slug, name, tagline, description, logo, brand color. Drives the homepage card and the `/work/[slug]` route. |
| Deck copy + demo data | `content/<slug>.ts` | Slide titles, hints and summaries, overview facts and stack, platform modules, closing CTA, walkthrough modal copy, and the demo database the live screens run on. **All copy lives here, never in JSX.** |
| Deck wiring | `components/sections/projects/<slug>/<slug>-deck.tsx` | Exports `<slug>Slides(project)`, `<Slug>Provider`, `<slug>Cover`. Builds the brand slides (overview, platform, closing) and maps the app screens into `DeckSlide`s. |
| Demo store | `components/sections/projects/<slug>/store.tsx` | One React context holding the demo database and its actions. Every screen reads it, so a change on one slide shows up on the others. |
| App frame | `components/sections/projects/<slug>/app-frame.tsx` | The product's own shell (sidebar, mobile nav, content panel, toaster, walkthrough modal), with the product's design tokens scoped to it. |
| UI kit | `components/sections/projects/<slug>/ui.tsx` | The product's primitives (buttons, pills, page header, tabs, table, sheet, dialog), copied from the real app's look. |
| Screens | `components/sections/projects/<slug>/screen-*.tsx` | One file per live screen. |
| Bespoke visual | `components/sections/projects/<slug>/*.tsx` | One interactive illustration for the overview slide that exists only for this product (Corvinn: the HVAC hairline drawing; Yetti: the channel orbit). |
| Fonts | `lib/project-fonts.ts` | The product's own face via `next/font`, `preload: false`. Never in `lib/fonts.ts` (that file is rewritten by `npm run brand`). |
| Assets | `public/ingested/<slug>/` | Logo, mascot or photos, and `slides/*.jpg` thumbnails for the contents drawer. |
| Register | `components/sections/projects/project-slides.tsx` | Add the project to the `DECKS` map. |

The route `app/work/[slug]/page.tsx` and the homepage `ProjectsShowcase` are
generic: adding to `content/projects.ts` is enough for them.

## 2. Slide order (hold it for every project)

1. **Cover**: generic, rendered by `project-slides.tsx`. The logo on the brand color.
2. **Overview** (`tone: "brand"`): a floating white copy card (eyebrow, title, body,
   four facts, stack chips) on the brand color, with the bespoke interactive visual
   and one framed photo on the other side.
3. **App screens** (`tone: "app"`, `group: "app"`): 4 to 6 live screens sharing one
   mounted `AppFrame`, so the sidebar and store state persist between them. Every
   slide gets a `hint`: one line telling the visitor what to try.
4. **Platform** (`tone: "brand"`, `surface: "light"`): a bento of the modules the
   demo does not cover, with one featured card on the brand color.
5. **Closing** (`tone: "brand"`): logo plus a white card with the CTA to `/contact`
   and a link back to `/#work`.

## 3. Rules for the live screens

- **Copy the real app, not a screenshot of it.** Open the product's source (shell,
  page headers, tables, colors, font) and reproduce its layout, spacing and tokens.
  When the product's UI changes, update the replica from source.
- **One shared store.** If the product's screens share tables, the demo shares
  state. The best moment in a deck is a change on one slide appearing on another
  (Corvinn: move a job, the dashboard counts move; Yetti: the AI books a trip in the
  inbox, it lands on the booking calendar, the CRM and the check-in desk).
- **Dates are offsets.** Store "days from today" and minutes from midnight, turn
  them into dates in the browser, so the demo always has today in it.
- **Anything not in the demo opens the walkthrough modal** (`askWalkthrough(label)`),
  never a dead click and never a fake page.
- **Product tokens are scoped to the frame** (`frameTokens()` in `app-frame.tsx`), so
  `bg-primary` inside the replica is the product's color, not Growtk's.
- No `next/image` inside screens beyond what the 10 per page budget allows; use plain
  `<img>` for avatars and channel icons.
- The site bans still apply inside the replica: no em or en dashes in any string, no
  all caps labels (the site sets `--accent-transform: none`), visible focus rings,
  `cursor-pointer` on everything clickable, `aria-label` on icon buttons.

## 4. Truthfulness

`CLAUDE.md` says only state what is true. For a deck that means:

- Facts and stack chips come from the product's `package.json`, README and git log.
- A feature shown working in the demo must exist in the real product. Anything still
  being built is labelled "in development" (Corvinn's AI phone agent).
- "Our role" says what Growtk actually did on the project. Confirm it with the owner.
- Demo customers, staff and businesses are fictional, never real clients.

## 5. Checklist for a new project

1. Find the product's repo. Pull its brand color, font, logo and UI source.
2. Copy compressed assets to `public/ingested/<slug>/` (nothing over ~400KB).
3. Add the `Project` entry to `content/projects.ts`.
4. Write `content/<slug>.ts` (copy + demo data), typed in the same file.
5. Add the product font to `lib/project-fonts.ts`.
6. Build `store.tsx`, `ui.tsx`, `app-frame.tsx`, the screens, the bespoke overview
   visual, and `<slug>-deck.tsx`.
7. Register it in `DECKS` in `project-slides.tsx`.
8. `npm run build`, then click through `/work/<slug>` on desktop and phone width.
9. Screenshot each slide into `public/ingested/<slug>/slides/<id>.jpg` (about 480px
   wide) and point each slide's `thumb` at it for the contents drawer.
