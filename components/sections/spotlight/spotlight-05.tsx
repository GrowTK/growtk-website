import { Marquee } from "@/components/magic/marquee";
import { cn } from "@/lib/utils";

/**
 * A colour band carrying a scrolling ticker of short phrases (not logos),
 * dot separated, pausing on hover. A motion driven, typographic breather
 * between two static content sections.
 */
export function Spotlight05({ words, tone = "primary" }: { words: string[]; tone?: "primary" | "foreground" }) {
  if (words.length === 0) return null;
  return (
    <section className={cn("overflow-hidden py-10", tone === "primary" ? "bg-primary text-primary-foreground" : "bg-foreground text-background")}>
      <Marquee pauseOnHover className="[--marquee-duration:26s] [--marquee-gap:2.5rem] motion-reduce:[&_*]:animate-none">
        {words.map((w, i) => (
          <span key={w + i} className="flex items-center gap-10 whitespace-nowrap">
            <span className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{w}</span>
            <span aria-hidden className="text-2xl opacity-40 sm:text-3xl">&middot;</span>
          </span>
        ))}
      </Marquee>
    </section>
  );
}
