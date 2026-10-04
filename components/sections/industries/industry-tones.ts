import type { CardGradient } from "@/components/sections/industries/trade-figure";

/**
 * One chalky pastel per trade, shared by the home carousel cards, the
 * Industries dropdown thumbnails, and each industry page's hero and CTA, so a
 * trade keeps one colour everywhere. Each stays within one hue: the colour,
 * fading to a lighter tint of itself, with a same-hue glow in one corner.
 * Never blend two hues on one surface. No violet.
 */
export type IndustryTone = CardGradient & { glow: string };

export const INDUSTRY_THEME: Record<string, { icon: string; tone: IndustryTone }> = {
  hvac: { icon: "Wind", tone: { angle: 150, from: "#FFBA7B", to: "#FFDDBC", glow: "#FFCB9C" } },
  plumbing: { icon: "Droplets", tone: { angle: 150, from: "#F2C4FF", to: "#F9E3FF", glow: "#F6D3FF" } },
  electrical: { icon: "Zap", tone: { angle: 150, from: "#FFDE59", to: "#FFF0AD", glow: "#FFE88A" } },
  roofing: { icon: "HardHat", tone: { angle: 150, from: "#FFA494", to: "#FFD6CE", glow: "#FFBDB1" } },
  "railing-fencing": { icon: "Fence", tone: { angle: 150, from: "#D6EE72", to: "#EEF8BD", glow: "#E3F396" } },
  landscaping: { icon: "Trees", tone: { angle: 150, from: "#9FE3B4", to: "#D4F4DE", glow: "#BAEBC9" } },
  "pest-control": { icon: "Bug", tone: { angle: 150, from: "#FFB3C7", to: "#FFDDE7", glow: "#FFC8D7" } },
  cleaning: { icon: "SprayCan", tone: { angle: 150, from: "#8EDFE0", to: "#CCF2F2", glow: "#ADE8E9" } },
  healthcare: { icon: "HeartPulse", tone: { angle: 150, from: "#A6D2FF", to: "#D7EAFF", glow: "#BFDEFF" } },
};

/** The industries hub: the signature yellow. */
export const HUB_TONE: IndustryTone = INDUSTRY_THEME.electrical.tone;

/** Theme for a slug or an href like `/industries/hvac`. */
export function themeFor(slugOrHref: string) {
  return INDUSTRY_THEME[slugOrHref.split("/").filter(Boolean).pop() ?? ""] ?? INDUSTRY_THEME.hvac;
}

export const toneGradient = (t: IndustryTone) => `linear-gradient(${t.angle}deg, ${t.from}, ${t.to})`;
export const toneGlow = (t: IndustryTone) =>
  `radial-gradient(120% 70% at 100% 0%, ${t.glow}b3 0%, transparent 60%), radial-gradient(90% 60% at 0% 100%, rgb(255 255 255 / 0.45) 0%, transparent 70%)`;
