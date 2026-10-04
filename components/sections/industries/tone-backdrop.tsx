import { NoiseTexture } from "@/components/blocks/magicui/noise-texture";
import { toneGlow, type IndustryTone } from "@/components/sections/industries/industry-tones";

/** The glow and grain that sit on a tone's gradient. The parent paints the gradient itself and must be `relative isolate`. */
export function ToneBackdrop({ tone }: { tone: IndustryTone }) {
  return (
    <>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10" style={{ backgroundImage: toneGlow(tone) }} />
      <NoiseTexture frequency={0.75} octaves={4} slope={0.12} noiseOpacity={0.5} className="-z-10 opacity-25" />
    </>
  );
}
