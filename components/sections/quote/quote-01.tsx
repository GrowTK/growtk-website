import { Quote as QuoteMark } from "lucide-react";
import { Reveal } from "@/components/magic/reveal";
import type { Quote as QuoteData } from "@/content/demo";

/**
 * A full bleed band holding one oversized line and a whisper of attribution.
 * The voice-agent demo loop plays behind it under a slight peach tint for
 * contrast. Nothing else competes with it, so it works as a breath between
 * two dense sections.
 */
export function Quote01({ quote }: { quote: QuoteData }) {
  return (
    <section data-nav-theme="dark" className="relative overflow-hidden text-white">
      <video
        src="/brand/blob-animation.mp4"
        poster="/brand/blob-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden
        className="absolute inset-0 size-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 bg-orange-300/50" />
      <div className="relative mx-auto max-w-5xl px-6 py-24 lg:py-32">
        <Reveal>
          <QuoteMark aria-hidden className="size-9 opacity-60" />
          <blockquote className="mt-8">
            <p className="font-display text-3xl leading-[1.1] font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              {quote.text}
            </p>
          </blockquote>
          <p className="mt-10 font-mono text-xs tracking-wide opacity-90">
            {quote.author}
            {quote.role ? `, ${quote.role}` : ""}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
