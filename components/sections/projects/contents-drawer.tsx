"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/types";

export type ContentsItem = { id: string; title: string; summary?: string; thumb?: string };

/**
 * The deck's table of contents: a floating drawer with one row per slide
 * (thumbnail, number, title, one line summary). Clicking a row jumps there.
 * Serves desktop (from the chrome row's Contents button) and phones (from
 * the menu button), so there is one menu, not two.
 */
export function ContentsDrawer({
  open,
  onClose,
  items,
  index,
  onSelect,
  project,
}: {
  open: boolean;
  onClose: () => void;
  items: ContentsItem[];
  index: number;
  onSelect: (i: number) => void;
  project: Project;
}) {
  const reduce = useReducedMotion();
  const activeRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (!open) return;
    // Land on the current slide's row, keyboard focus included.
    activeRef.current?.scrollIntoView({ block: "center" });
    activeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="contents-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.aside
            key="contents-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Slides"
            initial={{ x: reduce ? 0 : 32, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduce ? 0 : 32, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-2 right-2 z-[110] flex w-[calc(100%-1rem)] max-w-sm flex-col overflow-hidden rounded-3xl bg-background shadow-[0_24px_64px_rgba(0,0,0,.22)] sm:inset-y-3 sm:right-3"
          >
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4">
              <div className="min-w-0">
                <p className="eyebrow" style={{ color: project.accentHex }}>
                  Contents
                </p>
                <p className="mt-1 truncate font-display text-xl font-bold tracking-tight text-foreground">{project.name}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contents"
                className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-muted text-foreground transition hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X aria-hidden className="size-4" />
              </button>
            </div>

            {/* Progress through the deck */}
            <div className="mx-5 mb-3 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full transition-[width] duration-300" style={{ width: `${((index + 1) / items.length) * 100}%`, backgroundColor: project.accentHex }} />
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                {index + 1} of {items.length}
              </span>
            </div>

            <ol className="min-h-0 flex-1 overflow-y-auto px-3 pb-3">
              {items.map((item, i) => {
                const active = i === index;
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, y: reduce ? 0 : 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: reduce ? 0 : Math.min(i, 10) * 0.035, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <button
                      ref={active ? activeRef : undefined}
                      type="button"
                      onClick={() => {
                        onSelect(i);
                        onClose();
                      }}
                      aria-current={active ? "step" : undefined}
                      className={cn(
                        "group flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/15",
                        active ? "bg-muted" : "hover:bg-muted/60",
                      )}
                    >
                      <span
                        className={cn(
                          "relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-md bg-muted ring-1 ring-black/5 transition-shadow",
                          active && "ring-2",
                        )}
                        style={active ? ({ "--tw-ring-color": project.accentHex } as React.CSSProperties) : undefined}
                      >
                        {item.thumb ? (
                          // eslint-disable-next-line @next/next/no-img-element -- small lazy thumbnails, kept out of next/image's per-page budget
                          <img src={item.thumb} alt="" loading="lazy" decoding="async" className="size-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.04]" />
                        ) : (
                          <span className={cn("flex size-full items-center justify-center", project.thumbnailClassName)}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={project.logo.src} alt="" className={cn("object-contain", project.logoShape === "square" ? "h-3/5 w-auto" : "w-1/2")} />
                          </span>
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-baseline gap-2">
                          <span className="text-xs text-muted-foreground tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                          <span className="truncate text-sm font-semibold text-foreground">{item.title}</span>
                        </span>
                        {item.summary && <span className="mt-0.5 line-clamp-2 block text-xs leading-snug text-muted-foreground">{item.summary}</span>}
                      </span>
                      {active && <span aria-hidden className="mr-1 size-2 shrink-0 rounded-full" style={{ backgroundColor: project.accentHex }} />}
                    </button>
                  </motion.li>
                );
              })}
            </ol>

            <div className="flex items-center justify-between border-t border-border px-5 py-3.5">
              <Link href="/#work" className="inline-flex cursor-pointer items-center gap-2 rounded-full text-sm font-medium text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <ArrowLeft aria-hidden className="size-4" />
                Back to all work
              </Link>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/brand/logo-black.png" alt="Growtk" className="h-4 w-auto" />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
