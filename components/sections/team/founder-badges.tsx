import { cn } from "@/lib/utils";
import { brand } from "@/brand.config";
import type { TeamMember } from "@/content/types";

/** Flat, static badge colours per founder: soft lilac pink, then peach. */
const MEMBER_COLOR = ["#F2C4FF", "#FFBA7B"];

/**
 * The team hero's figure: the two founders as overlapping ID badges, tilted
 * apart on the hairline grid, each with a flat colour monogram, name, role and what
 * they build. Decorative restatement of the profiles below, so aria-hidden.
 */
export function FounderBadges({ members }: { members: TeamMember[] }) {
  return (
    <div aria-hidden className="relative mx-auto flex h-[24rem] w-full max-w-md items-center justify-center sm:h-[28rem]">
      {members.slice(0, 2).map((m, i) => (
        <div
          key={m.name}
          className={cn(
            "absolute w-[15rem] rounded-md border border-border bg-card p-5 shadow-[0_24px_60px_rgba(0,0,0,.14)] sm:w-[17rem]",
            i === 0 ? "top-4 left-0 -rotate-6 sm:left-2" : "right-0 bottom-4 rotate-[5deg] sm:right-2",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">{brand.name}</span>
            <span className="size-2 rounded-full" style={{ backgroundColor: MEMBER_COLOR[i % 2] }} />
          </div>
          <div className="mt-4 flex aspect-[16/10] items-center justify-center rounded-md" style={{ backgroundColor: MEMBER_COLOR[i % 2] }}>
            <span className="font-display text-6xl font-bold tracking-tight text-[#26262a]">{m.initials}</span>
          </div>
          <p className="mt-4 font-display text-lg leading-tight font-bold tracking-tight text-foreground">{m.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{m.role}</p>
          {m.skills?.length ? (
            <div className="mt-3 flex flex-wrap gap-1">
              {m.skills.slice(0, 2).map((s) => (
                <span key={s} className="rounded-sm bg-muted px-1.5 py-0.5 text-[11px] font-medium text-foreground">{s}</span>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
