"use client";

import { usePathname } from "next/navigation";
import { SiteBanner } from "@/components/site-banner";
import { SiteNavbar } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { Groowt } from "@/components/mascot/groowt";
import { GroowtChat } from "@/components/mascot/groowt-chat";
import { GroowtGame } from "@/components/mascot/groowt-game";

/** Routes that render full screen with no shared chrome. */
const BARE_ROUTES = [/^\/work\//];

/** Wraps every page in the standard banner/navbar/footer, except bare routes. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
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
      <GroowtGame />
    </>
  );
}
