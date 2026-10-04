"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { brand } from "@/brand.config";
import { site } from "@/content/site";
import { Icon } from "@/components/sections/icon";
import { IndustryThumb } from "@/components/sections/industries/industry-thumb";
import { themeFor, toneGradient } from "@/components/sections/industries/industry-tones";

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
  const [open, setOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  // Which desktop dropdown is showing: its thumbnails' figures only run while it is.
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

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
  // Forced back to light/solid whenever the mobile menu is open, so the panel beneath
  // it always reads on a plain card regardless of what section sits behind the header.
  const dark = scrolled && sectionDark && !open;

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-50 transition-[backdrop-filter,background-color] duration-300 ease-out",
        scrolled && "backdrop-blur-xl",
        open && "bg-background shadow-sm",
      )}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-7xl items-center gap-8 px-6 sm:px-10">
        <Link href="/" onClick={() => setOpen(false)}>
          <img
            src={dark ? "/brand/logo-white.png" : "/brand/logo-black.png"}
            alt={brand.name}
            className="h-7 w-auto"
          />
        </Link>
        <ul className="ml-auto hidden items-center gap-8 md:flex">
          {site.nav.map((item) =>
            item.children?.length ? (
              <li
                key={item.label}
                className="group/nav relative"
                onPointerEnter={() => setMenu(item.label)}
                onPointerLeave={() => setMenu(null)}
                onFocus={() => setMenu(item.label)}
                onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null); }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "flex cursor-pointer items-center gap-1 text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline",
                    dark ? "text-white" : "text-foreground",
                  )}
                >
                  {item.label}
                  <ChevronDown aria-hidden className="size-3.5 transition-transform duration-200 group-hover/nav:rotate-180" />
                </Link>
                <div
                  className="invisible absolute top-full left-1/2 z-50 w-[40rem] -translate-x-1/2 pt-3 opacity-0 transition-[opacity,visibility] duration-200 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100"
                >
                  <div className="rounded-2xl border border-black/6 bg-card p-4 shadow-xl">
                    <ul className="grid grid-cols-3 gap-2">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            className="group/item flex cursor-pointer flex-col items-start gap-2 rounded-xl p-2 text-sm font-medium text-foreground transition-colors duration-150 hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            <IndustryThumb
                              href={child.href}
                              live={menu === item.label}
                              className="transition-transform duration-200 ease-out group-hover/item:scale-[1.03]"
                            />
                            <span className="px-1">{child.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={item.href}
                      className="mt-2 flex cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-foreground transition-colors duration-150 hover:bg-accent"
                    >
                      See all industries
                      <ArrowRight aria-hidden className="size-4" />
                    </Link>
                  </div>
                </div>
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "cursor-pointer text-sm font-medium underline-offset-4 transition-colors duration-300 hover:underline",
                    dark ? "text-white" : "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <Link
          href={site.navCta?.href ?? "/contact"}
          className={cn(
            "group ml-auto hidden cursor-pointer items-center gap-2 text-sm font-medium transition-colors duration-300 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:ml-0 md:flex",
            dark ? "text-white" : "text-foreground",
          )}
        >
          {site.navCta?.label ?? "Get started"}
          <span
            className={cn(
              "grid size-8 place-items-center rounded-full border transition-colors duration-300",
              dark ? "border-white/30 group-hover:bg-white/10" : "border-border group-hover:bg-accent",
            )}
          >
            <ArrowRight aria-hidden className="size-4" />
          </span>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className={cn(
            "ml-auto grid size-9 cursor-pointer place-items-center rounded-lg transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden",
            dark ? "text-white hover:bg-white/10" : "text-foreground hover:bg-accent",
          )}
        >
          {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-border bg-background px-6 pb-6 md:hidden">
          <ul className="flex flex-col divide-y divide-border">
            {site.nav.map((item) =>
              item.children?.length ? (
                <li key={item.label}>
                  <div className="flex items-center justify-between py-1">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="block cursor-pointer py-2.5 text-base font-medium text-foreground"
                    >
                      {item.label}
                    </Link>
                    <button
                      type="button"
                      onClick={() => setMobileExpanded((v) => (v === item.label ? null : item.label))}
                      aria-label={`${mobileExpanded === item.label ? "Collapse" : "Expand"} ${item.label}`}
                      aria-expanded={mobileExpanded === item.label}
                      className="grid size-9 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-accent"
                    >
                      <ChevronDown
                        aria-hidden
                        className={cn("size-4 transition-transform duration-200", mobileExpanded === item.label && "rotate-180")}
                      />
                    </button>
                  </div>
                  {mobileExpanded === item.label ? (
                    <ul className="grid grid-cols-2 gap-1 pb-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
                          >
                            <span
                              className="grid size-7 shrink-0 place-items-center rounded-lg text-[#26262a]"
                              style={{ backgroundImage: toneGradient(themeFor(child.href).tone) }}
                            >
                              {child.icon ? <Icon name={child.icon} className="size-3.5" /> : null}
                            </span>
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ) : (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block cursor-pointer py-3.5 text-base font-medium text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
          <Link
            href={site.navCta?.href ?? "/contact"}
            onClick={() => setOpen(false)}
            className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
          >
            {site.navCta?.label ?? "Get started"}
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
      ) : null}
    </header>
  );
}
