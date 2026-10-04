"use client";

import Link from "next/link";
import { IndustryThumb } from "@/components/sections/industries/industry-thumb";

/** The industries hub hero's figure: every trade's tile, live, in a 3 × 3 grid. Each links to its page. */
export function IndustryMosaic({ items }: { items: { name: string; href: string }[] }) {
  return (
    <ul className="grid grid-cols-3 gap-3">
      {items.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-label={item.name}
            className="block cursor-pointer rounded-lg transition-transform duration-200 ease-out hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#26262a] focus-visible:ring-offset-2"
          >
            <IndustryThumb href={item.href} live />
          </Link>
        </li>
      ))}
    </ul>
  );
}
