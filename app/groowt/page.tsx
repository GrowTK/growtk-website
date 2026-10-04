import type { Metadata } from "next";
import { Groowt } from "@/components/mascot/groowt";
import { GroowtOpenButton } from "@/components/mascot/groowt-open-button";
import { GroowtPlayButton } from "@/components/mascot/groowt-game";
import { groowt } from "@/content/groowt";

export const metadata: Metadata = { title: groowt.page.meta.title, description: groowt.page.meta.description };

/**
 * Groowt's own page. A starting point: big Groowt centre stage (same drawing
 * and behaviour as the corner bird, components/mascot/groowt.tsx). Tapping him
 * or the button opens the chat.
 */
export default function GroowtPage() {
  return (
    <main className="bg-background">
      <section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center gap-10 px-6 py-24 text-center">
        <Groowt variant="stage" size={320} className="max-w-full" />
        <div className="max-w-xl">
          <p className="eyebrow text-primary">{groowt.page.eyebrow}</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.95] font-bold tracking-tight text-balance text-foreground sm:text-7xl">{groowt.page.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{groowt.page.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <GroowtOpenButton label={groowt.page.cta} />
            <GroowtPlayButton className="px-5 py-3" />
          </div>
        </div>
      </section>
    </main>
  );
}
