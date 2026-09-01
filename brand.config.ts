/**
 * BRAND CONFIG — the single source of truth for this site.
 *
 * Edit values here, then run `npm run brand` to propagate the build-time-only
 * surfaces (package.json name, globals.css theme, lib/fonts.ts, README title).
 * Everything else (UI text, <title>, OG tags, footer) imports this file directly.
 *
 * Colors are OKLCH. Change the hue (0-360) to re-skin the whole site:
 *   265 violet · 230 blue · 160 emerald · 25 red · 70 amber
 *
 * Copy does NOT live here. Page copy lives in content/*.ts (see content/types.ts).
 */

export const brand = {
  /** Company name. Nav, hero, footer, <title>, OG tags. `/build` sets it. */
  name: "Growtk",

  /** One-line value prop. Hero sub-headline + meta description. `/build` sets it. */
  tagline: "Websites, widgets and automation for trades and service businesses",

  /** Longer SEO / Open Graph description, ~150 chars. `/build` sets it. */
  description:
    "Growtk redesigns websites and builds automation, custom widgets and voice agents for roofing, railing, healthcare and other service businesses, integrated with the tools you already run.",

  /** Production domain, no protocol. Only used for metadataBase + canonical URLs. */
  domain: "growtk.com",

  /** Theme. Run `npm run brand` after editing. */
  theme: {
    /** Brand hue in OKLCH degrees (0-360). This one number re-skins the site. */
    hue: 278,
    /** Corner style. "sharp" = editorial, "rounded" = friendly, "pill" = playful. */
    corners: "rounded" as "sharp" | "rounded" | "pill",
    /** Light only. Dark mode is not supported. */
    defaultScheme: "light" as const,
  },

  /** Any Google Font name works. Run `npm run brand` after editing. */
  fonts: {
    /**
     * Headlines. Not actually used right now: `--font-display` is hardcoded to
     * a Helvetica system stack in app/globals.css (Helvetica isn't on Google
     * Fonts, so it can't come from this pipeline). This value stays here so
     * `npm run brand` has something valid to codegen from lib/fonts.ts if that
     * override is ever removed; edit the globals.css line to change the real
     * rendered heading font.
     */
    display: "Space Grotesk",
    /** Body / UI. Clean and readable. */
    sans: "Geist",
    /** Code / labels / eyebrows. */
    mono: "JetBrains Mono",
  },

  /** Footer links. Empty strings are skipped. */
  social: {
    instagram: "",
    facebook: "",
    linkedin: "",
    x: "",
    github: "",
    email: "",
  },

  /**
   * Contact. `npm run clone` fills these from the scraped site.
   * - whatsapp: digits only, country code first, no "+". Set it and the click-to-chat
   *   widget appears (components/widget/whatsapp-widget.tsx).
   * - address + mapQuery: set them and a map section can render a pin + embed.
   */
  contact: {
    whatsapp: "",
    phone: "",
    email: "hello@growtk.com",
    address: "",
    mapQuery: "",
  },
} as const;

export type Brand = typeof brand;
export default brand;
