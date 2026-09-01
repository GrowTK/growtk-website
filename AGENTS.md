<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Project conventions

**Read [`CLAUDE.md`](./CLAUDE.md) before writing any UI.** This is Growtk's marketing
site, built from a website-factory starter kit whose dashboard/Supabase half has been
stripped out. What's left: the Next.js app, the component library in `components/sections`,
and typed content in `content/*.ts`. Helper commands in `.claude/skills/`:

- **`/check`** preflight · **`/update`** latest deps + green build · the repo's own **`run`**
  skill fixes every build/runtime error and starts the dev server.

Two sources of truth: `brand.config.ts` (identity, theme, contact) and `content/*.ts` (all
page copy, one typed file per page). Never hardcode copy, the brand name, or the hue in a
component.

Design law lives in CLAUDE.md. Short version: unique layouts, real images (never colored
boxes), lucide icons only, `ImageCard` for image+text (never a text-over-photo scrim), no em
or en dashes in copy, <=10 `next/image` per page.
