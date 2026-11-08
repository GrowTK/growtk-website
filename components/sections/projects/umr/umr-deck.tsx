"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { umrDeck } from "@/content/umr";
import type { Project } from "@/content/types";
import type { DeckApi, DeckSlide } from "../project-slides";

type FromDeck = { source: "umr-deck"; type: "ready" | "interact" | "key"; key?: string };

/**
 * The UMR presentation, hosted in one iframe that stays mounted across its
 * slides (they share a group). The deck shell owns navigation and autoplay:
 * slide changes and the play state go in by postMessage, and the page reports
 * back when it is ready, when the viewer starts using a demo (pause), and
 * arrow keys or swipes pressed while focus is inside it.
 */
function UmrFrame({ slide, api }: { slide: string; api: DeckApi }) {
  const ref = React.useRef<HTMLIFrameElement>(null);
  // Load once on the slide we arrived at; later slides arrive by message, so the demos keep their state.
  const [src] = React.useState(() => `${umrDeck.embedSrc}?embed&slide=${slide}`);
  const latest = React.useRef({ slide, api });
  React.useEffect(() => {
    latest.current = { slide, api };
  });

  const send = React.useCallback(() => {
    const { slide, api } = latest.current;
    ref.current?.contentWindow?.postMessage({ target: "umr-deck", slide, autoplay: api.autoplay }, window.location.origin);
  }, []);

  React.useEffect(send, [slide, api.autoplay, send]);

  React.useEffect(() => {
    const onMessage = (e: MessageEvent<FromDeck>) => {
      if (e.origin !== window.location.origin || e.source !== ref.current?.contentWindow || e.data?.source !== "umr-deck") return;
      const { api } = latest.current;
      if (e.data.type === "ready") send();
      if (e.data.type === "interact") api.pause();
      if (e.data.type === "key") {
        if (e.data.key === "ArrowRight" || e.data.key === "PageDown") api.step(1);
        if (e.data.key === "ArrowLeft" || e.data.key === "PageUp") api.step(-1);
        if (e.data.key === "Home") api.step(-Infinity);
        if (e.data.key === "End") api.step(Infinity);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [send]);

  return <iframe ref={ref} src={src} title={umrDeck.embedTitle} className="absolute inset-0 size-full border-0 bg-[#F2F1EF]" />;
}

/** The widget's own product page, scrollable in its own frame. */
function DeskFrame() {
  return <iframe src={umrDeck.deskSrc} title={umrDeck.deskTitle} loading="lazy" className="absolute inset-0 size-full border-0 bg-[#F2F1EF]" />;
}

function ClosingSlide({ project }: { project: Project }) {
  const c = umrDeck.closing;
  return (
    <div className={cn("absolute inset-0 flex items-center justify-center overflow-y-auto p-6", project.thumbnailClassName)}>
      <div className="flex w-full max-w-2xl flex-col items-center text-center">
        <Image src={project.logo.src} alt={project.logo.alt} width={1183} height={326} sizes="(min-width: 640px) 18rem, 14rem" quality={80} className="mb-10 h-auto w-56 sm:w-72" />
        <div className="w-full rounded-3xl bg-background px-8 py-12 sm:px-14">
          <p className="eyebrow" style={{ color: project.accentHex }}>
            {c.eyebrow}
          </p>
          <h2 className="mt-4 font-display text-4xl leading-[1.02] font-bold tracking-tight text-balance sm:text-5xl">{c.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">{c.body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={c.primary.href}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-semibold text-background transition hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {c.primary.label}
              <ArrowRight aria-hidden className="size-4" />
            </Link>
            <Link
              href={c.secondary.href}
              className="inline-flex cursor-pointer items-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {c.secondary.label}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Every UMR slide after the cover. The presentation's slides share one mounted iframe (group "deck"). */
export function umrSlides(project: Project): DeckSlide[] {
  const s = umrDeck.slides;
  return [
    ...s.embedded.map(
      (slide): DeckSlide => ({
        ...slide,
        tone: "app",
        group: "deck",
        render: (api) => <UmrFrame slide={slide.id} api={api} />,
      }),
    ),
    { ...s.desk, tone: "app", render: () => <DeskFrame /> },
    { ...s.closing, tone: "brand", render: () => <ClosingSlide project={project} /> },
  ];
}

export function UmrProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export const umrCover = umrDeck.slides.cover;
