"use client";

/**
 * Renders picked catalog entries as a real page, in order. Shared by the
 * section picker's Preview view and the template composer, so "what does
 * this composition actually look like" is one implementation, not two.
 */
import { PanelRightClose } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CatalogEntry } from "@/components/sections/catalog";

/** Cancel sticky positioning so nav chrome does not float inside a scrolling column. */
function Unstick({ on, children }: { on?: boolean; children: React.ReactNode }) {
  return on ? <div className="[&_.sticky]:static [&_.sticky]:top-auto">{children}</div> : <>{children}</>;
}

export function LivePreview({
  entries,
  cancelSticky = false,
  emptyState,
}: {
  entries: CatalogEntry[];
  /** Split/columned layouts cancel sticky nav chrome so it doesn't float inside a scrolling pane. */
  cancelSticky?: boolean;
  emptyState?: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      {entries.length ? (
        entries.map((e, i) => {
          /*
           * An overlay nav consumes no height, so whatever follows has to
           * make room. A section opening with a full-bleed photo is the
           * exception: padding it would insert a blank strip for the bar
           * to float over instead of the image.
           */
          const prev = entries[i - 1];
          const needsClearance = Boolean(prev?.overlay) && !e.leadsWithMedia;
          return (
            <Unstick key={e.code} on={cancelSticky && e.sticky}>
              <div id={e.code} className={cn("scroll-mt-20", needsClearance && "[&>section]:pt-28")}>
                {e.node}
              </div>
            </Unstick>
          );
        })
      ) : (
        (emptyState ?? (
          <div className="grid min-h-[70vh] place-items-center p-10 text-center">
            <div>
              <PanelRightClose aria-hidden className="mx-auto size-8 text-zinc-400" />
              <p className="mt-4 font-display text-lg font-semibold text-zinc-700">Nothing picked yet</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
