import Link from "next/link";
import { Globe, TrendingUp, MessageSquare, Workflow, Mic, Plug, type LucideIcon } from "lucide-react";
import type { ServiceItem } from "@/content/services";

const ICON: Record<ServiceItem["id"], LucideIcon> = {
  "website-redesign": Globe,
  seo: TrendingUp,
  widgets: MessageSquare,
  automation: Workflow,
  "voice-agents": Mic,
  integrations: Plug,
};

/** Cycles through the brand's three accent colours, lifted from the logo mark. */
const TILE_HOVER = ["hover:bg-[#FFDE59]", "hover:bg-[#FFBA7B]", "hover:bg-[#F2C4FF]"];

/**
 * Bespoke: a 3x2 grid of real services, each tile painting in one of the
 * brand's three accent colours on hover and linking straight to its section
 * on the services page. Built to fill the hero's second panel edge to edge,
 * not float a single small graphic in open space.
 */
export function HeroServiceTiles({ items }: { items: ServiceItem[] }) {
  return (
    <div className="grid h-full w-full grid-cols-2 gap-px overflow-hidden rounded-sm bg-border sm:grid-cols-3">
      {items.map((item, i) => {
        const ServiceIcon = ICON[item.id];
        return (
          <Link
            key={item.id}
            href={`/services#${item.id}`}
            className={`group flex cursor-pointer flex-col justify-between gap-6 bg-white p-5 transition-colors duration-200 ${TILE_HOVER[i % TILE_HOVER.length]}`}
          >
            <ServiceIcon aria-hidden className="size-5 text-muted-foreground transition-colors duration-200 group-hover:text-foreground" />
            <p className="font-display text-sm leading-snug font-semibold text-balance text-foreground">{item.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
