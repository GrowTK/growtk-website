import { Reveal } from "@/components/magic/reveal";

/**
 * Pure colour breather: one oversized number on a full bleed brand colour
 * band, nothing else. Drop it between two white content sections to hold
 * the "colour, then white, then colour" rhythm without needing a photo.
 */
export function Spotlight01({ value, label, sublabel }: { value: string; label: string; sublabel?: string }) {
  return (
    <section className="bg-primary py-24 text-primary-foreground lg:py-32">
      <Reveal className="mx-auto max-w-3xl px-6 text-center">
        <p className="font-display text-7xl font-bold tracking-tight sm:text-8xl lg:text-9xl">{value}</p>
        <p className="mt-4 text-lg font-semibold text-balance sm:text-xl">{label}</p>
        {sublabel ? <p className="mt-2 text-sm text-primary-foreground/75">{sublabel}</p> : null}
      </Reveal>
    </section>
  );
}
