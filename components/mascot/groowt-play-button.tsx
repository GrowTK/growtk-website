"use client";

import { motion } from "motion/react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { groowt } from "@/content/groowt";
import { groowtStore, useGroowt } from "@/components/mascot/groowt-store";

/**
 * A Play button that opens Groowt Flies, for pages. Kept apart from the game
 * itself so a page with this button doesn't download the game until it's played.
 */
export function GroowtPlayButton({ className }: { className?: string }) {
  const { open, game } = useGroowt();
  if (open || game) return null;
  return (
    <motion.button
      type="button"
      onClick={() => groowtStore.play()}
      onPointerEnter={() => void import("@/components/mascot/groowt-game")}
      aria-label={groowt.game.playLabel}
      whileHover={{ y: -2, rotate: -2 }}
      whileTap={{ scale: 0.94 }}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-md border-2 border-[#2a2a2e] bg-white px-3 py-1.5 text-sm font-bold text-[#2a2a2e] shadow-[3px_3px_0_0_#FFDE59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2a2a2e]/40 focus-visible:ring-offset-2",
        className,
      )}
    >
      <Play className="size-3.5 fill-current" />
      {groowt.game.play}
    </motion.button>
  );
}
