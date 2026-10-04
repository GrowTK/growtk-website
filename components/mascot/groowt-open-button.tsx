"use client";

import { MessageCircle } from "lucide-react";
import { groowtStore } from "@/components/mascot/groowt-store";

/** Opens the Groowt chat from anywhere on a page. */
export function GroowtOpenButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => groowtStore.open()}
      className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-[4px_4px_0_0_#FFDE59] transition duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_#FFDE59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <MessageCircle aria-hidden className="size-4" />
      {label}
    </button>
  );
}
