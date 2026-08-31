import type { Img } from "@/content/types";

/**
 * Full bleed photo with an oversized word bled across it at low opacity, the
 * same "giant type as texture" move the footer's bleed wordmark uses. Pure
 * decoration, not a message to read, so it never fights the "no text over a
 * photo" rule the way a real headline in that position would.
 */
export function Spotlight06({ image, word }: { image: Img; word: string }) {
  return (
    <section className="relative isolate h-[64vh] min-h-96 w-full overflow-hidden bg-foreground">
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
      <div aria-hidden className="absolute inset-0 bg-foreground/35" />
      <p
        aria-hidden
        className="absolute inset-x-0 bottom-0 select-none whitespace-nowrap px-6 text-center font-display text-[16vw] font-bold leading-[0.75] tracking-tighter text-background/20"
        style={{ marginBottom: "-0.12em" }}
      >
        {word}
      </p>
    </section>
  );
}
