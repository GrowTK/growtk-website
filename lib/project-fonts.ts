/**
 * Faces used only inside project case-study slides, where we reproduce a
 * client product's own UI. Kept out of lib/fonts.ts on purpose: that file is
 * rewritten by `npm run brand`, and these are not Growtk's fonts.
 */
import { Geist, Lato, Plus_Jakarta_Sans } from "next/font/google";

/** Corvinn's dashboard face (its next/font Lato, 300/400/700/900). */
export const corvinnLato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  variable: "--font-corvinn",
  display: "swap",
  // Only used once someone pages past the cover, so don't preload it on load.
  preload: false,
});

/** Yetti's app face (its next/font Geist). */
export const yettiGeist = Geist({
  subsets: ["latin"],
  variable: "--font-yetti",
  display: "swap",
  preload: false,
});

/** Jerry's POS display face (its next/font Plus Jakarta Sans, used by `.display` headers). */
export const jerrysJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jerrys",
  display: "swap",
  preload: false,
});
