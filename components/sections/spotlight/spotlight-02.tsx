import type { Img } from "@/content/types";

/**
 * Pure photo breather: one full bleed image, zero text, zero overlay. The
 * quietest possible way to hold the "image, then white" rhythm, a full stop
 * between two dense sections rather than another thing to read.
 */
export function Spotlight02({ image, height = "h-[60vh]" }: { image: Img; height?: string }) {
  return (
    <section className={`relative isolate overflow-hidden bg-muted ${height}`}>
      <img src={image.src} alt={image.alt} loading="lazy" decoding="async" className="absolute inset-0 size-full object-cover" />
    </section>
  );
}
