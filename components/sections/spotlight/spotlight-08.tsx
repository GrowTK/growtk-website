import type { Img } from "@/content/types";

/**
 * Full bleed, muted, looping video with zero text and zero controls: the
 * motion sibling of Spotlight02's still photo breather. Reach for it when
 * there is real ambient footage (the work happening, the place itself)
 * worth a quiet pause on, not as a hero.
 */
export function Spotlight08({ videoSrc, poster, height = "h-[60vh]" }: { videoSrc: string; poster?: Img; height?: string }) {
  return (
    <section className={`relative isolate overflow-hidden bg-foreground ${height}`}>
      <video autoPlay muted loop playsInline poster={poster?.src} className="absolute inset-0 size-full object-cover">
        <source src={videoSrc} type="video/mp4" />
      </video>
    </section>
  );
}
