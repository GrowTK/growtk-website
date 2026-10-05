"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { SiteBanner } from "@/components/site-banner";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Groowt } from "@/components/mascot/groowt";
import { GroowtChat } from "@/components/mascot/groowt-chat";
import { useGroowt } from "@/components/mascot/groowt-store";

// The game is its own chunk: downloaded the first time someone presses Play, never before.
const GroowtGame = dynamic(() => import("@/components/mascot/groowt-game").then((m) => m.GroowtGame), { ssr: false });

/** Routes that render full screen with no shared chrome. */
const BARE_ROUTES = [/^\/work\//];

/** Wraps every page in the standard banner/navbar/footer, except bare routes. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { game } = useGroowt();
  const [gameLoaded, setGameLoaded] = useState(false);
  useEffect(() => {
    if (game) setGameLoaded(true);
  }, [game]);
  const bare = BARE_ROUTES.some((pattern) => pattern.test(pathname));

  if (bare) return <>{children}</>;

  return (
    <>
      <SiteBanner />
      <SiteNavbar />
      {children}
      <SiteFooter />
      {/* Mascot, his chat and his game (content/groowt.ts). Delete these three lines to remove him. /groowt has its own big one. */}
      {pathname !== "/groowt" && <Groowt />}
      <GroowtChat />
      {gameLoaded && <GroowtGame />}
    </>
  );
}
