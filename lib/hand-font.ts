/**
 * The handwriting face for the home page's sticky notes. Kept out of
 * lib/fonts.ts, which `npm run brand` rewrites; this is a one-section accent,
 * not a brand font.
 */
import { Caveat } from "next/font/google";

export const handFont = Caveat({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-hand",
  display: "swap",
});
