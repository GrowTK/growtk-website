"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/brand.config";

const NAV_ITEMS = [
  { label: "Platform", href: "/" },
  { label: "Security", href: "/security" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

/**
 * Sticky navbar, always transparent, only a frosted blur once the page
 * scrolls. Text and logo colour adapt to whatever section currently sits
 * behind the bar: white over anything marked `data-nav-theme="dark"`
 * (hero, primary-colour panels, dark photo sections, the footer), black
 * over plain white-background sections. Detected by probing the point just
 * below the bar's own bottom edge on every scroll, so it works on any page
 * without each one having to register its sections manually.
 *
 * The hero is a special case: black text at the very top (unscrolled), even
 * though it's marked dark, so it reads black the instant the page loads.
 * The moment the page scrolls at all it flips to white and normal detection
 * takes over from there, including while still inside the (now full height)
 * hero.
 */
export function SiteNavbar() {
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [sectionDark, setSectionDark] = useState(true);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      setScrolled(window.scrollY > 8);
      const bottom = headerRef.current?.getBoundingClientRect().bottom ?? 0;
      const el = document.elementFromPoint(window.innerWidth / 2, bottom + 2);
      const theme = el?.closest("[data-nav-theme]")?.getAttribute("data-nav-theme");
      setSectionDark(theme === "dark");
    };
    update();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Black at the very top of the page regardless of what's marked there, so the hero
  // reads black on first paint; once scrolled, the detected section theme takes over.
  const dark = scrolled && sectionDark;

  return (
    <header
      ref={headerRef}
      className={cn("sticky top-0 z-50 transition-[backdrop-filter] duration-300 ease-out", scrolled && "backdrop-blur-xl")}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 sm:px-10">
        <Link href="/">
          <img
            src="/brand/logo-black.png"
            alt={brand.name}
            className={cn("h-7 w-auto transition-[filter] duration-300", dark && "brightness-0 invert")}
          />
        </Link>
        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "cursor-pointer text-sm font-medium tracking-wide underline-offset-4 transition-colors duration-300 hover:underline",
                  dark ? "text-white" : "text-foreground",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/book-demo"
          className={cn(
            "group ml-auto flex cursor-pointer items-center gap-2 text-sm font-medium transition-colors duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:ml-0",
            dark ? "text-white" : "text-foreground",
          )}
        >
          Contact us
          <span
            className={cn(
              "grid size-8 place-items-center rounded-full border transition-colors duration-300",
              dark ? "border-white/30 group-hover:bg-white/10" : "border-border group-hover:bg-accent",
            )}
          >
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </Link>
      </nav>
    </header>
  );
}
