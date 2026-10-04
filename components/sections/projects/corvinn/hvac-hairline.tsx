"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { corvinnDeck } from "@/content/corvinn";

/**
 * Interactive hairline drawing of a split HVAC install: outdoor condenser,
 * refrigerant line set up through the wall, supply trunk with a flex drop to
 * a ceiling diffuser, and the thermostat.
 *
 * - Draws itself on, part by part, when the slide opens.
 * - While the system is on, the fan turns and refrigerant and supply air flow.
 * - Hover, focus or tap a part to highlight it and read how Corvinn handles it.
 * - Tap the thermostat to switch the system on or off.
 * Reduced motion: drawn instantly, nothing loops.
 */

type PartId = keyof typeof corvinnDeck.overview.blueprint.parts;

const EASE = [0.22, 1, 0.36, 1] as const;
const stroke: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  shown: { pathLength: 1, opacity: 1, transition: { pathLength: { duration: 0.6, ease: EASE }, opacity: { duration: 0.1 } } },
};
const fade: Variants = { hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.4 } } };

// Shape helpers: every shape draws on through the shared `stroke` variants.
const P = (props: React.ComponentProps<typeof motion.path>) => <motion.path variants={stroke} {...props} />;
const L = (props: React.ComponentProps<typeof motion.line>) => <motion.line variants={stroke} {...props} />;
const C = (props: React.ComponentProps<typeof motion.circle>) => <motion.circle variants={stroke} {...props} />;
const R = (props: React.ComponentProps<typeof motion.rect>) => <motion.rect variants={stroke} {...props} />;
const T = (props: React.ComponentProps<typeof motion.text>) => <motion.text variants={fade} fill="currentColor" stroke="none" fontSize={11} letterSpacing={0.4} {...props} />;

function Group({ delay, dim, children }: { delay: number; dim?: boolean; children: React.ReactNode }) {
  return (
    <g style={{ opacity: dim ? 0.28 : 1, transition: "opacity 250ms ease-out" }}>
      <motion.g variants={{ hidden: {}, shown: { transition: { delayChildren: delay, staggerChildren: 0.012 } } }}>{children}</motion.g>
    </g>
  );
}

/** Callout placement in viewBox units, so it scales with the drawing. */
const CALLOUT: Record<PartId, { x: number; y: number; align: "left" | "right" }> = {
  trunk: { x: 24, y: 178, align: "left" },
  condenser: { x: 290, y: 170, align: "left" },
  lineset: { x: 24, y: 178, align: "left" },
  stat: { x: 455, y: 362, align: "right" },
};

/** Invisible hit areas, drawn last so they sit on top. */
const HIT: Record<PartId, { x: number; y: number; w: number; h: number }[]> = {
  trunk: [{ x: 110, y: 86, w: 410, h: 190 }],
  condenser: [{ x: 50, y: 266, w: 320, h: 252 }],
  lineset: [
    { x: 370, y: 410, w: 90, h: 50 },
    { x: 426, y: 172, w: 34, h: 250 },
    { x: 460, y: 172, w: 60, h: 34 },
  ],
  stat: [{ x: 456, y: 276, w: 52, h: 78 }],
};

export function HvacHairline({ className }: { className?: string }) {
  const copy = corvinnDeck.overview.blueprint;
  const reduce = useReducedMotion();
  const [hovered, setHovered] = React.useState<PartId | null>(null);
  const [pinned, setPinned] = React.useState<PartId | null>(null);
  const [on, setOn] = React.useState(true);
  const [drawn, setDrawn] = React.useState(!!reduce);
  const active = hovered ?? pinned;
  const running = on && drawn && !reduce;

  const dim = (part: PartId) => active !== null && active !== part;
  const spokes = Array.from({ length: 16 }, (_, i) => (i * Math.PI) / 8);
  const louvers = Array.from({ length: 17 }, (_, i) => 318 + i * 10);
  const hatch = Array.from({ length: 28 }, (_, i) => 24 + i * 20);
  const wallHatch = Array.from({ length: 22 }, (_, i) => 70 + i * 20);

  function activate(part: PartId) {
    if (part === "stat") setOn((v) => !v);
    setPinned((p) => (p === part && part !== "stat" ? null : part));
  }

  const callout = active ? CALLOUT[active] : null;

  return (
    <div className={cn("relative", className)}>
      <motion.svg
        role="img"
        aria-label={copy.label}
        viewBox="0 0 600 600"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.15}
        strokeLinecap="round"
        className="size-full overflow-visible"
        initial={reduce ? "shown" : "hidden"}
        animate="shown"
        onClick={(e) => e.target === e.currentTarget && setPinned(null)}
      >
        {/* Structure: registration marks, ground, wall */}
        <Group delay={0}>
          {[
            [24, 24],
            [576, 24],
            [24, 576],
            [576, 576],
          ].map(([x, y]) => (
            <P key={`${x}-${y}`} d={`M${x! - 8} ${y} H${x! + 8} M${x} ${y! - 8} V${y! + 8}`} opacity={0.7} />
          ))}
          <L x1={20} y1={512} x2={580} y2={512} />
          {hatch.map((x) => (
            <L key={x} x1={x} y1={512} x2={x - 10} y2={524} opacity={0.6} />
          ))}
          <L x1={520} y1={60} x2={520} y2={512} />
          <L x1={530} y1={60} x2={530} y2={512} />
          {wallHatch.map((y) => (
            <L key={y} x1={520} y1={y + 10} x2={530} y2={y} opacity={0.5} />
          ))}
        </Group>

        {/* Supply trunk, flex drop, diffuser */}
        <Group delay={0.25} dim={dim("trunk")}>
          <P d="M120 110 H520 M120 160 H520 M120 110 V160" />
          <P d="M120 110 L138 98 H520" opacity={0.8} />
          {[200, 300, 400].map((x) => (
            <P key={x} d={`M${x} 106 V164 M${x} 106 L${x + 18} 94`} />
          ))}
          <P d="M236 160 C230 168 242 172 236 180 C230 188 242 192 236 200 C230 208 242 212 236 220" />
          <P d="M264 160 C258 168 270 172 264 180 C258 188 270 192 264 200 C258 208 270 212 264 220" />
          <R x={214} y={220} width={72} height={12} />
          {[226, 238, 250, 262, 274].map((x) => (
            <L key={x} x1={x} y1={220} x2={x} y2={232} opacity={0.6} />
          ))}
          {[222, 250, 278].map((x) => (
            <P key={x} d={`M${x} 244 V266 M${x - 5} 260 L${x} 266 L${x + 5} 260`} opacity={0.8} />
          ))}
          <P d="M120 120 L84 74 H40" opacity={0.8} />
          <T x={40} y={68}>
            supply trunk
          </T>
          {/* Supply air moving down the trunk and out of the diffuser */}
          {running && (
            <g opacity={0.9}>
              <path d="M510 135 H130" strokeDasharray="2 14">
                <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="1.4s" repeatCount="indefinite" />
              </path>
              {[222, 250, 278].map((x) => (
                <path key={x} d={`M${x} 236 V290`} strokeDasharray="3 9">
                  <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="1s" repeatCount="indefinite" />
                </path>
              ))}
            </g>
          )}
        </Group>

        {/* Condenser */}
        <Group delay={0.55} dim={dim("condenser")}>
          <P d="M60 300 H330 V500 H60 Z" />
          <P d="M60 300 L96 276 H366 L330 300" />
          <P d="M330 500 L366 476 V276" />
          <P d="M342 300 L354 292 V470 L342 478" opacity={0.6} />
          <C cx={165} cy={400} r={82} />
          {[66, 50, 34, 18].map((r) => (
            <C key={r} cx={165} cy={400} r={r} opacity={0.75} />
          ))}
          <C cx={165} cy={400} r={6} />
          {spokes.map((a) => (
            <L key={a} x1={165 + Math.cos(a) * 18} y1={400 + Math.sin(a) * 18} x2={165 + Math.cos(a) * 82} y2={400 + Math.sin(a) * 82} opacity={0.5} />
          ))}
          {/* Fan blades: turn while the system runs */}
          <g opacity={0.6}>
            {running && <animateTransform attributeName="transform" type="rotate" from="0 165 400" to="360 165 400" dur="1.6s" repeatCount="indefinite" />}
            {[0, 120, 240].map((deg) => (
              <P key={deg} d="M165 400 C190 372 226 372 238 390 C214 396 190 402 165 400 Z" transform={`rotate(${deg} 165 400)`} />
            ))}
          </g>
          {louvers.map((y) => (
            <L key={y} x1={266} y1={y} x2={318} y2={y} opacity={0.7} />
          ))}
          <R x={266} y={306} width={52} height={6} opacity={0.8} />
          <P d="M84 500 V512 M120 500 V512 M272 500 V512 M308 500 V512" />
          <P d="M60 546 H330 M60 538 V554 M330 538 V554" />
          <P d="M104 286 L76 252 H30" opacity={0.8} />
          <T x={168} y={566} textAnchor="middle">
            36 in
          </T>
          <T x={30} y={246}>
            condenser, 3 ton
          </T>
          {/* Warm air off the coil */}
          {running &&
            [330, 360, 390].map((y, i) => (
              <path key={y} d={`M${372 + i * 4} ${y - 40} q 8 -10 0 -20 q -8 -10 0 -20`} opacity={0.55} strokeDasharray="3 6">
                <animate attributeName="stroke-dashoffset" from="0" to="-18" dur={`${1.1 + i * 0.2}s`} repeatCount="indefinite" />
              </path>
            ))}
        </Group>

        {/* Line set */}
        <Group delay={0.85} dim={dim("lineset")}>
          <P d="M366 430 H420 Q436 430 436 414 V196 Q436 180 452 180 H520" />
          <P d="M366 446 H428 Q452 446 452 422 V212 Q452 196 468 196 H520" />
          {Array.from({ length: 11 }, (_, i) => 220 + i * 18).map((y) => (
            <L key={y} x1={436} y1={y + 6} x2={452} y2={y} opacity={0.5} />
          ))}
          <R x={372} y={424} width={10} height={12} />
          <R x={386} y={440} width={10} height={12} />
          <P d="M452 400 L470 384 H500" opacity={0.8} />
          <T x={472} y={378}>
            line set
          </T>
          {/* Refrigerant: suction back to the unit, liquid out to the house */}
          {running && (
            <g strokeWidth={1.8}>
              <path d="M520 180 H452 Q436 180 436 196 V414 Q436 430 420 430 H366" strokeDasharray="2 10">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.9s" repeatCount="indefinite" />
              </path>
              <path d="M366 446 H428 Q452 446 452 422 V212 Q452 196 468 196 H520" strokeDasharray="2 10">
                <animate attributeName="stroke-dashoffset" from="0" to="-24" dur="0.9s" repeatCount="indefinite" />
              </path>
            </g>
          )}
        </Group>

        {/* Thermostat */}
        <Group delay={1.1} dim={dim("stat")}>
          <R x={462} y={292} width={40} height={56} rx={8} />
          <C cx={482} cy={314} r={12} />
          <L x1={472} y1={336} x2={492} y2={336} opacity={0.7} />
          <P d="M502 320 H520" strokeDasharray="2 3" opacity={0.7} />
          <T x={462} y={284}>
            stat
          </T>
          <motion.text
            variants={fade}
            x={482}
            y={317}
            textAnchor="middle"
            fill="currentColor"
            stroke="none"
            fontSize={9}
            fontWeight={600}
            onAnimationComplete={() => setDrawn(true)}
          >
            {on ? "72°" : "off"}
          </motion.text>
          <circle cx={497} cy={297} r={2} fill="currentColor" stroke="none" opacity={on ? 1 : 0.3} />
        </Group>

        {/* Hit areas */}
        {(Object.keys(HIT) as PartId[]).map((part) => (
          <g
            key={part}
            role="button"
            tabIndex={0}
            aria-label={part === "stat" ? `${copy.parts.stat.title}. ${on ? copy.on : copy.off}` : copy.parts[part].title}
            aria-pressed={part === "stat" ? on : pinned === part}
            className="cursor-pointer outline-none"
            onMouseEnter={() => setHovered(part)}
            onMouseLeave={() => setHovered((h) => (h === part ? null : h))}
            onFocus={() => setHovered(part)}
            onBlur={() => setHovered((h) => (h === part ? null : h))}
            onClick={() => activate(part)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                activate(part);
              }
            }}
          >
            {HIT[part].map((r, i) => (
              <rect key={i} x={r.x} y={r.y} width={r.w} height={r.h} fill="transparent" stroke="none" />
            ))}
          </g>
        ))}
      </motion.svg>

      {/* Callout card */}
      <AnimatePresence>
        {active && callout && (
          <motion.div
            key={active}
            initial={{ opacity: 0, y: reduce ? 0 : 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="pointer-events-none absolute z-10 w-56 rounded-2xl bg-white p-3.5 text-left shadow-[0_12px_32px_rgba(0,0,0,.16)]"
            style={{
              top: `${(callout.y / 600) * 100}%`,
              ...(callout.align === "left" ? { left: `${(callout.x / 600) * 100}%` } : { right: `${100 - (callout.x / 600) * 100}%` }),
            }}
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-foreground">{copy.parts[active].title}</p>
              {active === "stat" && (
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap", on ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground")}>
                  {on ? copy.on : copy.off}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{copy.parts[active].body}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
